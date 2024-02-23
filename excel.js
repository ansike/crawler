const path = require("path");
const { generateExcel } = require("./src/generateExcel");
const { outputDir } = require("./src/config");
const outputFile = path.resolve(outputDir, "format-product-1.json");
const { promisify } = require("util");
const fs = require("fs");
const promisifyReadFile = promisify(fs.readFile);

(async () => {
  const data = await promisifyReadFile(outputFile, { encoding: "utf-8" });
  await generateExcel(JSON.parse(data), path.resolve(outputDir, "format-product-1.xlsx"));
  console.log("success");
})();
