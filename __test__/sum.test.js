const sum = require("../helpers/sum");
const { test, expect } = require("@jest/globals");

test("adds 1 + 2 to equal 3", () => {
  const result = sum(1, 2);

  expect(result).toBe(3);
});
