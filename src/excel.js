const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const promiseReaddir = promisify(fs.readdir);
const promisifyReadFile = promisify(fs.readFile);
const { generateExcel } = require("./generateExcel");

async function dealFilterExcel(filterDir) {
  const files = await promiseReaddir(filterDir);
  const formatProductFiles = files.filter((file) =>
    file.startsWith("format-product")
  );
  for (let i = 0; i < formatProductFiles.length; i++) {
    const fileName = formatProductFiles[i];
    const sourceFile = path.resolve(filterDir, fileName);
    const destFileName = fileName.replace("json", "xlsx");
    const destFile = path.resolve(filterDir, destFileName);
    const data = await promisifyReadFile(sourceFile, { encoding: "utf-8" });
    await generateExcel(JSON.parse(data), destFile);
    console.log("success", destFile);
  }
}

module.exports = {
  dealFilterExcel,
};
