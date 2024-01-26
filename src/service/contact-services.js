import {
  createContactValidation,
  getContactValidation,
  removeContactValidation,
  searchContactValidation,
  updateContactValidation,
} from "../validation/contact-validation.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/ResponseError.js";

const create = async (user, request) => {
  const validatedContact = validate(createContactValidation, request);
  validatedContact.username = user.username;

  return await prismaClient.contact.create({
    data: validatedContact,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

const get = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);
  const contact = await prismaClient.contact.findFirst({
    where: {
      username: user.username,
      id: contactId,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });

  if (!contact) {
    throw new ResponseError(404, "Contact not found.");
  }

  return contact;
};

const search = async (user, request) => {
  request = validate(searchContactValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filters = [];

  filters.push({
    username: user.username,
  });

  if (request.name) {
    filters.push({
      OR: [
        {
          first_name: {
            contains: request.name,
          },
        },
        {
          last_name: {
            contains: request.name,
          },
        },
      ],
    });
  }
  if (request.email) {
    filters.push({
      email: {
        contains: request.email,
      },
    });
  }
  if (request.phone) {
    filters.push({
      phone: {
        contains: request.phone,
      },
    });
  }

  const contacts = await prismaClient.contact.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
  });

  const totalItems = await prismaClient.contact.count({
    where: {
      AND: filters,
    },
  });

  return {
    data: contacts,
    paging: {
      page: request.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
  };
};

const update = async (user, request) => {
  const validatedContact = validate(updateContactValidation, request);

  const totalContactInDatabase = await prismaClient.contact.count({
    where: {
      id: validatedContact.id,
      username: user.username,
    },
  });

  if (totalContactInDatabase !== 1) {
    throw new ResponseError(404, "Contact not found.");
  }

  return await prismaClient.contact.update({
    where: {
      id: validatedContact.id,
    },
    data: validatedContact,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

const remove = async (user, contactId) => {
  contactId = validate(removeContactValidation, contactId);

  const contact = await prismaClient.contact.findFirst({
    where: {
      username: user.id,
      id: contactId,
    },
  });

  if (!contact) {
    throw new ResponseError(404, "contact not found.");
  }

  return await prismaClient.contact.delete({
    where: {
      id: contactId,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

export default { create, get, search, update, remove };
