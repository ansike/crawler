const path = require("path");

const outputDir = path.resolve(process.cwd(), "./output");
const zhipuPy = path.resolve(process.cwd(), "./src/ai/zhipu/index.py");

module.exports = {
  outputDir,
  zhipuPy
};
