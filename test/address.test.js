import supertest from "supertest";
import {
  user as modelUser,
  contact as modelContact,
  address as modelAddress,
  createContacts,
  removeAllAddresses,
  removeAllContacts,
  removeUsers,
  createUser,
  getContact,
  getAddress,
  createAddress,
  createAddressMany,
} from "./test-utils";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

describe("POST /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createUser(modelUser);
    await createContacts(modelContact);
  });

  afterEach(async () => {
    await removeAllAddresses(modelUser);
    await removeAllContacts(modelUser);
    await removeUsers(modelUser);
  });

  it("should success create address", async () => {
    const contact = await getContact(modelUser);
    const result = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set("Authorization", "test")
      .send(modelAddress);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe(modelAddress.street);
    expect(result.body.data.city).toBe(modelAddress.city);
    expect(result.body.data.province).toBe(modelAddress.province);
    expect(result.body.data.country).toBe(modelAddress.country);
    expect(result.body.data.postal_code).toBe(modelAddress.postal_code);
  });

  it("should reject if address invalid", async () => {
    const contact = await getContact(modelUser);
    const address = modelAddress;
    address.country = "";
    const result = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set("Authorization", "test")
      .send(address);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if contact not found", async () => {
    const contact = await getContact(modelUser);
    const result = await supertest(web)
      .post(`/api/contacts/${contact.id + 1}/addresses`)
      .set("Authorization", "test")
      .send(modelAddress);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if unauthorized", async () => {
    const contact = await getContact(modelUser);
    const result = await supertest(web)
      .post(`/api/contacts/${contact.id + 1}/addresses`)
      .set("Authorization", "")
      .send(modelAddress);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createUser(modelUser);
    await createContacts(modelContact);
    await createAddress(modelAddress);
  });

  afterEach(async () => {
    await removeAllAddresses(modelUser);
    await removeAllContacts(modelUser);
    await removeUsers(modelUser);
  });

  it("should update contact address", async () => {
    const address = await getAddress(modelUser);
    const contact = await getContact(modelContact);

    const result = await supertest(web)
      .put("/api/contacts/" + contact.id + "/addresses/" + address.id)
      .set("Authorization", "test")
      .send({
        street: address.street,
        city: address.city,
        country: "Indonesia",
        postal_code: address.postal_code,
      });

    logger.warn(result);

    expect(result.status).toBe(200);
    expect(result.body.data.country).toBe("Indonesia");
  });

  it("should reject when address invalid", async () => {
    const address = await getAddress(modelUser);
    const contact = await getContact(modelContact);

    const result = await supertest(web)
      .put("/api/contacts/" + contact.id + "/addresses/" + address.id)
      .set("Authorization", "test")
      .send({
        street: address.street,
        city: address.city,
        country: "",
        postal_code: address.postal_code,
      });

    logger.warn(result);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject when contact not found", async () => {
    const address = await getAddress(modelUser);
    const contact = await getContact(modelContact);

    const result = await supertest(web)
      .put("/api/contacts/" + (contact.id + 1) + "/addresses/" + address.id)
      .set("Authorization", "test")
      .send({
        street: address.street,
        city: address.city,
        country: address.country,
        postal_code: address.postal_code,
      });

    logger.warn(result);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject when address not found", async () => {
    const address = await getAddress(modelUser);
    const contact = await getContact(modelContact);

    const result = await supertest(web)
      .put("/api/contacts/" + contact.id + "/addresses/" + (address.id + 1000))
      .set("Authorization", "test")
      .send({
        street: address.street,
        city: address.city,
        province: address.province,
        country: "some country",
        postal_code: address.postal_code,
      });

    logger.warn(result);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createUser(modelUser);
    await createContacts(modelContact);
    await createAddress(modelAddress);
  });

  afterEach(async () => {
    await removeAllAddresses(modelUser);
    await removeAllContacts(modelUser);
    await removeUsers(modelUser);
  });

  it("should get address for given contactId and addressId", async () => {
    const address = await getAddress(modelUser);
    const contact = await getContact(modelContact);

    const result = await supertest(web)
      .get("/api/contacts/" + contact.id + "/addresses/" + address.id)
      .set("Authorization", "test")
      .send();

    logger.warn(result);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(address.id);
    expect(result.body.data.street).toBe(address.street);
    expect(result.body.data.city).toBe(address.city);
    expect(result.body.data.province).toBe(address.province);
    expect(result.body.data.country).toBe(address.country);
    expect(result.body.data.postal_code).toBe(address.postal_code);
  });

  it("should reject when address not found", async () => {
    const address = await getAddress(modelUser);
    const contact = await getContact(modelContact);

    const result = await supertest(web)
      .get("/api/contacts/" + contact.id + "/addresses/" + (address.id + 1))
      .set("Authorization", "test")
      .send();

    logger.warn(result);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject when contact not found", async () => {
    const address = await getAddress(modelUser);
    const contact = await getContact(modelContact);

    const result = await supertest(web)
      .get("/api/contacts/" + (contact.id + 1) + "/addresses/" + address.id)
      .set("Authorization", "test")
      .send();

    logger.warn(result);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createUser(modelUser);
    await createContacts(modelContact);
    await createAddressMany(modelAddress, 12);
  });

  afterEach(async () => {
    await removeAllAddresses(modelUser);
    await removeAllContacts(modelUser);
    await removeUsers(modelUser);
  });

  it("should get list address for given contactId", async () => {
    const contact = await getContact(modelContact);
    const result = await supertest(web)
      .get("/api/contacts/" + contact.id + "/addresses")
      .set("Authorization", "test")
      .send();

    logger.warn(result);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(12);
  });

  it("should reject if contact not found", async () => {
    const contact = await getContact(modelContact);
    const result = await supertest(web)
      .get("/api/contacts/" + (contact.id + 1) + "/addresses")
      .set("Authorization", "test")
      .send();

    logger.warn(result);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if user unauthorized", async () => {
    const contact = await getContact(modelContact);
    const result = await supertest(web)
      .get("/api/contacts/" + contact.id + "/addresses")
      .set("Authorization", "")
      .send();

    logger.warn(result);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createUser(modelUser);
    await createContacts(modelContact);
    await createAddress(modelAddress);
  });

  afterEach(async () => {
    await removeAllAddresses(modelUser);
    await removeAllContacts(modelUser);
    await removeUsers(modelUser);
  });

  it("should delete existing address", async () => {
    const address = await getAddress(modelUser);
    const contact = await getContact(modelContact);

    const result = await supertest(web)
      .delete("/api/contacts/" + contact.id + "/addresses/" + address.id)
      .set("Authorization", "test")
      .send();

    logger.warn(result);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
  });

  it("should reject if address not found", async () => {
    const address = await getAddress(modelUser);
    const contact = await getContact(modelContact);

    const result = await supertest(web)
      .delete("/api/contacts/" + contact.id + "/addresses/" + (address.id + 1))
      .set("Authorization", "test")
      .send();

    logger.warn(result);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if contact not found", async () => {
    const address = await getAddress(modelUser);
    const contact = await getContact(modelContact);

    const result = await supertest(web)
      .delete("/api/contacts/" + (contact.id + 1) + "/addresses/" + address.id)
      .set("Authorization", "test")
      .send();

    logger.warn(result);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if unauthorized", async () => {
    const address = await getAddress(modelUser);
    const contact = await getContact(modelContact);

    const result = await supertest(web)
      .delete("/api/contacts/" + contact.id + "/addresses/" + address.id)
      .set("Authorization", "")
      .send();

    logger.warn(result);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});
