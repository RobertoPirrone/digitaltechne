import { expect, test } from "vitest";
import { Actor, CanisterStatus, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { backendCanister, backend } from "./actor";

test("change rbac settings via IDL", {timeout: 15000}, async () => {
  console.log("change_rbac");
  let result1 = await backend.check_caller();
  console.log(result1);
  expect(result1.Ok.principal).toBe("2vxsx-fae");

  let rbac = {
      id: 0, // tanto non si usa
      principal: "7kgjw-iaak5-gnnrk-746vt-oacm7-2golr-4ku65-x2yxg-ba42r-vvlrz-oae",
      admin_ok: false,
      view_opera_ok: false,
      add_opera_ok: false,
      associate_dna_ok: false,
      add_dna_ok: false
  }
  let result2 = await backend.change_rbac(JSON.stringify(rbac));
  console.log(result2)
  expect(result2.Ok).toContain("permissions, with return 1");

  rbac.admin_ok = true;
  rbac.view_opera_ok = true;
  rbac.add_opera_ok = true;
  rbac.associate_dna_ok = true;
  rbac.add_dna_ok = true;
  let result3 = await backend.change_rbac(JSON.stringify(rbac));
  console.log(result3)
  expect(result3.Ok).toContain("permissions, with return 1");
});

