const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const promiseWrite = promisify(fs.writeFile);
const promiseMkdir = promisify(fs.mkdir);

const { outputIdr } = require("./config");

const products = path.resolve(outputIdr, "products.json");

async function writeJson(json) {
  if (fs.existsSync(outputIdr)) {
    console.log("Directory exists");
  } else {
    console.log("Directory not found.");
    console.log("Create a new directory.");
    await promiseMkdir(outputIdr);
  }
  await promiseWrite(products, json, {
    encode: "utf-8",
  });
  console.log(`success output ${products}`);
}

// 测试
// writeJson('{"a":1}');

module.exports = {
  writeJson,
};
