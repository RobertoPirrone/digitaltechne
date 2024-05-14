import { statSync, existsSync, readFileSync, unlinkSync } from 'fs';
import mime from 'mime';
import { v4 as uuidv4 } from 'uuid';
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { Actor , HttpAgent} from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { AssetManager } from '@dfinity/assets';
import { Ed25519KeyIdentity } from '@dfinity/identity';

console.log(process.argv);
// console.log(process.env);

const identity = Ed25519KeyIdentity.generate(new Uint8Array(Array.from({ length: 32 }).fill(0)));
export const principal = identity.getPrincipal();
console.log(principal.toString());
export const makeAgent = async (options) => {
  const agent = new HttpAgent({
    host: `http://127.0.0.1:4943`,
    ...options,
    identity
  });
  try {
    await agent.fetchRootKey();
  } catch (_) {
    //
  }
  return agent;
};
const agent = makeAgent();

// let canisterId="br5f7-7uaaa-aaaaa-qaaca-cai";
let canisterId=process.argv[2];
let filePath=process.argv[3];

const assetManager = new AssetManager({
  canisterId,
  agent: await agent,
});
const name = filePath.split(".");
const extension = name.pop();
const fileName = [uuidv4(), extension].join(".");
const file = readFileSync(filePath);
// const {size} = statSync(filePath);
// const mimetype = mime.getType(filePath);
// console.log(file);
const batch = assetManager.batch();
const key = await batch.store(file, { path: "/uploads", fileName: fileName });
await batch.commit();
console.log("key: ", key);
// const asset = await assetManager.get(key);

