import test from "node:test";
import assert from "node:assert/strict";
import { calculateTotal } from "../src/calculator.js";

test("adds tax to an expense amount", () => {
  assert.equal(calculateTotal(100, 0.2), 120);
});

test("returns the amount unchanged when the tax rate is zero", () => {
  assert.equal(calculateTotal(45.5, 0), 45.5);
});

test("returns zero total for a zero amount", () => {
  assert.equal(calculateTotal(0, 0.2), 0);
});

test("calculates fractional amounts and rates", () => {
  assert.equal(calculateTotal(19.99, 0.075), 21.48925);
});
