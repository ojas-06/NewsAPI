import request from "supertest";
import app from "../src/index.js";
import mongoose from "mongoose";

describe("GET /home/", () => {
  test("should return 200 and headlines for /home", async () => {
    const response = await request(app).get("/home");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("headlines");
    expect(response.body).toHaveProperty("categoryNews");

    expect(Array.isArray(response.body.headlines)).toBe(true);
  });
  test("should return 200 and headlines for a valid category", async () => {
    const response = await request(app).get("/home/technology");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("headlines");
    expect(response.body).toHaveProperty("categoryNews");

    expect(Array.isArray(response.body.headlines)).toBe(true);
  });

  test("should handle missing categories gracefully", async () => {
    const response = await request(app).get("/home/invalid-category-name");
    expect(response.statusCode).toBe(200);
    expect(response.body.categoryNews[0].category).toBe("business");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
