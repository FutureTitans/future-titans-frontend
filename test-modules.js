import { modules, payment } from './lib/api.js';

async function test() {
  try {
    const data = await modules.getAll();
    console.log("MODULES DATA:", data);
  } catch (e) {
    console.error("ERROR:", e);
  }
}
test();
