import { expect, test } from "vitest";
import { Actor, CanisterStatus, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { backendCanister, backend } from "./actor";

test("simple select, should return a number (of records)", async () => {
  const result1 = await backend.query("select count(*) from dossier");
  // console.log(result1);
  //expect(result1.Ok[0]).toBeTypeOf("object");
  expect(Number(result1.Ok[0][0])).toBeTypeOf("number");
});
