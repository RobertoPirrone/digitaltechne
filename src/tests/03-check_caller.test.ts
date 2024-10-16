import { expect, test } from "vitest";
import { Actor, CanisterStatus, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { backendCanister, backend } from "./actor";

test("add rbac for anonymous, if missing", {timeout: 10000}, async () => {
  console.log("check_caller");
  let result1 = await backend.check_caller();
  console.log(result1);
  if ('Err' in result1) {
    const result2 = await backend.insert_caller("Anonymous Caller");
    console.log("insert_caller");
    console.log(result2);
    result1 = await backend.check_caller();
    console.log("check_caller after insert");
    console.log(result1);
  }
  expect(result1.Ok.principal).toBe("2vxsx-fae");
  if (!result1.Ok.add_opera_ok) {
      console.log("add permissions");
        const sql_string = "update rbac set add_opera_ok = true, associate_dna_ok = true, add_dna_ok = true, admin_ok = true where principal = '2vxsx-fae'"
        const result2 = await backend.execute(sql_string);
        console.log(result2);
  }
  result1 = await backend.check_caller();
  expect(result1.Ok.add_opera_ok).toBeTruthy();
});

