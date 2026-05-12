import http from "node:http";
import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";

jest.unstable_mockModule("jsdom", () => ({
  JSDOM: class {
    constructor(html, options) {
      this.window = {
        document: {
          html,
          url: options?.url,
        },
      };
    }
  },
}));

jest.unstable_mockModule("@mozilla/readability", () => ({
  Readability: class {
    constructor(document) {
      this.document = document;
    }

    parse() {
      return {
        textContent: this.document.html.includes(
          "This is the perfect article text.",
        )
          ? "This is the perfect article text."
          : "",
      };
    }
  },
}));

const { default: app } = await import("../src/index.js");
const { default: Article } = await import("../src/models/Article.js");

describe("GET /view/:id", () => {
  let server;
  let articleUrl;
  let failUrl;
  let testArticleId;

  beforeAll(async () => {
    server = http.createServer((req, res) => {
      if (req.url === "/article") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <html>
            <head><title>Test Article</title></head>
            <body>
              <article>
                <h1>Test Article</h1>
                <p>This is the perfect article text.</p>
              </article>
            </body>
          </html>
        `);
        return;
      }

      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Network failure");
    });

    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address();
    articleUrl = `http://127.0.0.1:${port}/article`;
    failUrl = `http://127.0.0.1:${port}/fail`;

    const dummyArticle = await Article.create({
      title: "Test Article",
      short: "A short description",
      content: "",
      imageUrl: "https://placeholder.com/img.png",
      author: "Test Author",
      summary: "",
      sourceUrl: articleUrl,
      category: "business",
    });

    testArticleId = dummyArticle._id;
  });

  afterAll(async () => {
    if (testArticleId) {
      await Article.findByIdAndDelete(testArticleId);
    }
    await new Promise((resolve) => server.close(resolve));
    await mongoose.connection.close();
  });

  test("should return 200 and parsed content when HTML is clean", async () => {
    const response = await request(app).get(`/view/${testArticleId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.content).toContain(
      "This is the perfect article text.",
    );
  });

  test("should gracefully handle 500 when JSDOM or fetching fails", async () => {
    await Article.findByIdAndUpdate(testArticleId, {
      content: "",
      sourceUrl: failUrl,
    });

    const response = await request(app).get(`/view/${testArticleId}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("Failed to parse article content.");
  });
});
