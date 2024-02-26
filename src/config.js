const path = require("path");

const outputDir = path.resolve(process.cwd(), "./output");
const zhipuPy = path.resolve(process.cwd(), "./src/ai/zhipu/index.py");

const regions = [
  // {
  //   region: "金川",
  //   regionPinYin: "jinchuan",
  // },
  // {
  //   region: "林芝",
  //   regionPinYin: "lingzhi",
  // },
  // {
  //   region: "波密",
  //   regionPinYin: "bomi",
  // },
  {
    region: "武汉",
    regionPinYin: "wuhan",
  },
  {
    region: "无锡",
    regionPinYin: "wuxi",
  },
  {
    region: "罗平",
    regionPinYin: "luoping",
  },
  {
    region: "婺源",
    regionPinYin: "wuyuan",
  },
];

module.exports = {
  outputDir,
  zhipuPy,
  regions,
};
