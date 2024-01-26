import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/ResponseError.js";
import {
  createAddressValidation,
  getAddressValidation,
  updateAddressvalidation,
} from "../validation/address-validation.js";
import {
  getContactValidation,
  removeContactValidation,
} from "../validation/contact-validation.js";
import { validate } from "../validation/validation.js";

const checkContactExists = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  const count = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contactId,
    },
  });

  if (count !== 1) {
    throw new ResponseError(404, "contact not found.");
  }
  return contactId;
};

const create = async (user, contactId, request) => {
  contactId = await checkContactExists(user, contactId);

  const address = validate(createAddressValidation, request);
  address.contact_id = contactId;

  return await prismaClient.address.create({
    data: address,
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

const update = async (user, contactId, request) => {
  contactId = await checkContactExists(user, contactId);
  const address = validate(updateAddressvalidation, request);

  const countAddressInDatabase = await prismaClient.address.count({
    where: {
      id: address.id,
    },
  });

  if (countAddressInDatabase === 0) {
    throw new ResponseError(404, "Address not found");
  }

  return await prismaClient.address.update({
    where: {
      id: address.id,
      contact_id: contactId,
    },
    data: address,
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

const get = async (user, contactId, request) => {
  contactId = await checkContactExists(user, contactId);
  const addressId = validate(getAddressValidation, request);

  const address = await prismaClient.address.findUnique({
    where: {
      id: addressId,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });

  if (!address) {
    throw new ResponseError(404, "Address not found");
  }

  return address;
};

const list = async (user, contactId) => {
  contactId = await checkContactExists(user, contactId);

  const addresses = await prismaClient.address.findMany({
    where: {
      contact_id: contactId,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });

  if (!addresses) {
    throw new ResponseError(404, "Address not found");
  }

  return addresses;
};

const remove = async (user, contactId, request) => {
  contactId = await checkContactExists(user, contactId);
  request = validate(removeContactValidation, request);

  const isAddressExists = await prismaClient.address.count({
    where: {
      contact_id: contactId,
      id: request,
    },
  });

  if (!isAddressExists) {
    throw new ResponseError(404, "address not found");
  }

  return await prismaClient.address.delete({
    where: {
      id: request,
      contact_id: contactId,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

export default { create, update, get, list, remove };
