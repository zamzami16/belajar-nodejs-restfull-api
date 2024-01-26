import { prismaClient } from "../src/application/database.js";
import bcrypt from "bcrypt";

export const user = {
  username: "zamzami",
  password: "rahasia",
  name: "Mohammad Yusuf Zamzami",
};

export const contact = {
  first_name: "yusuf",
  last_name: "zamzami",
  email: "yusf@yusuf.com",
  phone: "081611333010",
};

export const address = {
  street: "Jalanin aja dulu",
  city: "siapa tau cocok",
  city: "kalau cocok ya cocok",
  province: "semoga yaa",
  country: "kalau enggak ya enggak",
  postal_code: "661133",
};

const removeUsers = async (user) => {
  await prismaClient.user.deleteMany({
    where: {
      username: user.username,
    },
  });
};

const createUser = async (user) => {
  await prismaClient.user.create({
    data: {
      username: user.username,
      password: await bcrypt.hash(user.password, 10),
      name: user.name,
      token: "test",
    },
  });
};

const getUser = async (username) => {
  return await prismaClient.user.findUnique({
    where: {
      username: username,
    },
  });
};

const removeAllContacts = async (user) => {
  await prismaClient.contact.deleteMany({
    where: {
      username: user.username,
    },
  });
};

const createContacts = async (contact) => {
  contact.username = "zamzami";
  await prismaClient.contact.create({
    data: contact,
  });
};

const getContact = async (user) => {
  return await prismaClient.contact.findFirst({
    where: {
      username: user.username,
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

const populateContacts = async (contact, count) => {
  const contacts = [];
  for (let i = 0; i < count; i++) {
    contacts.push({
      username: "zamzami",
      first_name: `${contact.first_name} test ${i}`,
      last_name: `${contact.last_name} ${i}`,
      email: `${contact.email}${i}.com`,
      phone: `${contact.phone}${i}`,
    });
  }
  return await prismaClient.contact.createMany({
    data: contacts,
  });
};

export const removeAllAddresses = async (user) => {
  await prismaClient.address.deleteMany({
    where: {
      contact: {
        username: user.username,
      },
    },
  });
};

export const getAddress = async (user) => {
  return prismaClient.address.findFirst({
    where: {
      contact: {
        username: user.username,
      },
    },
  });
};

export const createAddress = async (address) => {
  const _contact = await getContact(user);
  address.contact_id = _contact.id;
  await prismaClient.address.create({
    data: address,
  });
};

export const createAddressMany = async (address, count) => {
  const _contact = await getContact(user);
  address.contact_id = _contact.id;

  const addresses = [];
  for (let i = 0; i < count; i++) {
    addresses.push({
      street: `${address.street} test ${i}`,
      city: `${address.city} test ${i}`,
      province: `${address.province} test ${i}`,
      country: `${address.country} test ${i}`,
      postal_code: `${address.postal_code} test ${i}`,
      contact_id: address.contact_id,
    });
  }

  await prismaClient.address.createMany({
    data: addresses,
  });
};

export {
  removeUsers,
  createUser,
  getUser,
  removeAllContacts,
  createContacts,
  getContact,
  populateContacts,
};
