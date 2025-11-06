import { expect, test } from "bun:test";
import { GET } from "../app/health/route";

/**
 * HTTP status code for successful response
 */
const HTTP_STATUS_OK = 200;

test("Health Check", async () => {
  const response = await GET();
  expect(response.status).toBe(HTTP_STATUS_OK);
  expect(await response.text()).toBe("OK");
});
