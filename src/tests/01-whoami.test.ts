import { expect, test } from "vitest";
import { Actor, CanisterStatus, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { backendCanister, backend } from "./actor";

test("should return the anonymous II (2vxsx-fae)", async () => {
  const result1 = await backend.whoami();
  expect(result1).toBe("2vxsx-fae");
});
