import supertest from "supertest";
import { web } from "../src/application/web.js";
import { createUser, getUser, removeUsers } from "./test-utils.js";
import bcrypt from "bcrypt";

const user = {
  username: "zamzami",
  password: "rahasia",
  name: "Mohammad Yusuf Zamzami",
};

describe("POST /api/users", function () {
  afterEach(async () => {
    await removeUsers(user);
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send(user);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe(user.username);
    expect(result.body.data.name).toBe(user.name);
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject if data invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if data already exists", async () => {
    let result = await supertest(web).post("/api/users").send(user);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe(user.username);
    expect(result.body.data.name).toBe(user.name);
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send(user);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await createUser(user);
  });

  afterEach(async () => {
    await removeUsers(user);
  });

  it("should can login", async () => {
    let result = await supertest(web).post("/api/users/login").send({
      username: user.username,
      password: user.password,
    });

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });

  it("should reject when password wrong", async () => {
    let result = await supertest(web).post("/api/users/login").send({
      username: user.username,
      password: "salah",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject when username wrong", async () => {
    let result = await supertest(web).post("/api/users/login").send({
      username: "gaada",
      password: user.username,
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject when username and password wrong", async () => {
    let result = await supertest(web).post("/api/users/login").send({
      username: "gaada",
      password: user.username,
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/current", () => {
  beforeEach(async () => {
    await createUser(user);
  });

  afterEach(async () => {
    await removeUsers(user);
  });

  it("should can get user", async () => {
    let result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "test")
      .send();

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe(user.username);
    expect(result.body.data.name).toBe(user.name);
  });

  it("should rejects when token invalid", async () => {
    let result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "salah")
      .send();

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should rejects when token not set", async () => {
    let result = await supertest(web).get("/api/users/current").send();

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await createUser(user);
  });

  afterEach(async () => {
    await removeUsers(user);
  });

  it("should can update name and password", async () => {
    const updated = {
      name: "zamizami",
      password: "zamizamipassword",
    };

    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send(updated);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBeDefined();
    expect(result.body.data.username).toBe(user.username);
    expect(result.body.data.name).toBeDefined();
    expect(result.body.data.name).toBe(updated.name);

    const updatedUser = await getUser(result.body.data.username);
    expect(
      await bcrypt.compare(updated.password, updatedUser.password)
    ).toBeTruthy();
  });

  it("should can update password", async () => {
    const updated = {
      password: "zamizamipassword",
    };

    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send(updated);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBeDefined();
    expect(result.body.data.name).toBeDefined();

    const updatedUser = await getUser(result.body.data.username);
    expect(
      await bcrypt.compare(updated.password, updatedUser.password)
    ).toBeTruthy();
  });

  it("should can update name", async () => {
    const updated = {
      name: "zamizami",
    };

    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send(updated);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBeDefined();
    expect(result.body.data.username).toBe(user.username);
    expect(result.body.data.name).toBeDefined();
    expect(result.body.data.name).toBe(updated.name);
  });

  it("should reject update user when token invalid", async () => {
    const updated = {
      name: "zamizami",
      password: "zamizamipassword",
    };

    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "invalid")
      .send(updated);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/users/logout", () => {
  beforeEach(async () => {
    await createUser(user);
  });

  afterEach(async () => {
    await removeUsers(user);
  });

  it("should can logged out", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "test")
      .send();

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Ok");

    const loggedOut = await getUser(user.username);
    expect(loggedOut.token).toBeNull();
  });

  it("should reject loggout when unauthorized", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "gatau")
      .send();

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});
