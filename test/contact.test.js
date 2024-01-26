import supertest from "supertest";
import { web } from "../src/application/web.js";
import {
  createContacts,
  createUser,
  getContact,
  populateContacts,
  removeAllContacts,
  removeUsers,
} from "./test-utils.js";
import { logger } from "../src/application/logging.js";

const user = {
  username: "zamzami",
  password: "rahasia",
  name: "Mohammad Yusuf Zamzami",
};

const contact = {
  first_name: "yusuf",
  last_name: "zamzami",
  email: "yusf@yusuf.com",
  phone: "081611333010",
};

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await createUser(user);
  });

  afterEach(async () => {
    await removeAllContacts(user);
    await removeUsers(user);
  });

  it("should can create new contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send(contact);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.firs_name).toBe(contact.username);
    expect(result.body.data.last_name).toBe(contact.last_name);
    expect(result.body.data.email).toBe(contact.email);
    expect(result.body.data.phone).toBe(contact.phone);
  });

  it("should reject create new contact when data invalid.", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        last_name: "zamzami",
        email: "yusf",
        phone: "0816113300003010",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:id", () => {
  beforeEach(async () => {
    await createUser(user);
    await createContacts(contact);
  });

  afterEach(async () => {
    await removeAllContacts(user);
    await removeUsers(user);
  });

  it("should get contact for current user", async () => {
    const contact = await getContact(user);
    const result = await supertest(web)
      .get("/api/contacts/" + contact.id)
      .set("Authorization", "test")
      .send();

    expect(result.status).toBe(200);
    expect(result.body.data.first_name).toBe(contact.first_name);
    expect(result.body.data.last_name).toBe(contact.last_name);
    expect(result.body.data.email).toBe(contact.email);
    expect(result.body.data.phone).toBe(contact.phone);
  });

  it("should not found when id not exists", async () => {
    const result = await supertest(web)
      .get("/api/contacts/0")
      .set("Authorization", "test")
      .send();

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:id", () => {
  beforeEach(async () => {
    await createUser(user);
    await createContacts(contact);
  });

  afterEach(async () => {
    await removeAllContacts(user);
    await removeUsers(user);
  });

  it("should update existing contact", async () => {
    const contact = await getContact(user);
    const updatedContact = {
      first_name: "zamizamizami",
      last_name: "yusufyusuf",
      email: "yusuf@mail.com",
    };

    const result = await supertest(web)
      .put("/api/contacts/" + contact.id)
      .set("Authorization", "test")
      .send(updatedContact);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(contact.id);
    expect(result.body.data.first_name).toBe(updatedContact.first_name);
    expect(result.body.data.last_name).toBe(updatedContact.last_name);
    expect(result.body.data.email).toBe(updatedContact.email);
  });

  it("should only update first name", async () => {
    const contact = await getContact(user);
    const updatedContact = {
      first_name: "zamizamizami",
    };

    const result = await supertest(web)
      .put("/api/contacts/" + contact.id)
      .set("Authorization", "test")
      .send(updatedContact);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(contact.id);
    expect(result.body.data.first_name).toBe(updatedContact.first_name);
    expect(result.body.data.last_name).toBe(contact.last_name);
    expect(result.body.data.email).toBe(contact.email);
    expect(result.body.data.phone).toBe(contact.phone);
  });

  it("should reject with status 400 if first name not given", async () => {
    const contact = await getContact(user);
    const updatedContact = {
      last_name: "zamizamizami",
    };

    const result = await supertest(web)
      .put("/api/contacts/" + contact.id)
      .set("Authorization", "test")
      .send(updatedContact);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject with status 404 if contact not found", async () => {
    const updatedContact = {
      first_name: "zamizamizami",
      last_name: "yusufyusuf",
      email: "yusuf@mail.com",
    };

    const result = await supertest(web)
      .put("/api/contacts/1")
      .set("Authorization", "test")
      .send(updatedContact);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/contacts/:id", () => {
  beforeEach(async () => {
    await createUser(user);
    await createContacts(contact);
  });

  afterEach(async () => {
    await removeAllContacts(user);
    await removeUsers(user);
  });

  it("should delete existing contact", async () => {
    const contact = await getContact(user);
    const result = await supertest(web)
      .delete("/api/contacts/" + contact.id)
      .set("Authorization", "test")
      .send();

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
  });

  it("should reject delete contact if id invalid", async () => {
    const result = await supertest(web)
      .delete("/api/contacts/-1")
      .set("Authorization", "test")
      .send();

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject delete contact if not exists", async () => {
    const result = await supertest(web)
      .delete("/api/contacts/1")
      .set("Authorization", "test")
      .send();

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts", () => {
  beforeEach(async () => {
    await createUser(user);
    await populateContacts(contact, 17);
  });

  afterEach(async () => {
    await removeAllContacts(user);
    await removeUsers(user);
  });

  it("should search contact", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .set("Authorization", "test")
      .send();

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_item).toBe(17);
    expect(result.body.paging.total_page).toBe(2);
  });

  it("should search contact that have last_name test 1", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .set("Authorization", "test")
      .query({
        name: "test 13",
      })
      .send();

    logger.warn(result);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_item).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
  });
});
