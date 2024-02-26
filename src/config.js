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

const carRate = [
  {
    label: "5座经济型车(1-3)",
    value: 1.2,
  },
  {
    label: "5座舒适型车(1-3)",
    value: 1.35,
  },
  {
    label: "7座商务车(1-5)",
    value: 2.6,
  },
  {
    label: "9座商务车(1-7)",
    value: 3.3,
  },
  {
    label: "12座用车",
    value: 4.2,
  },
  {
    label: "14座用车",
    value: 4.5,
  },
  {
    label: "19座用车",
    value: 5.5,
  },
];

module.exports = {
  outputDir,
  zhipuPy,
  regions,
  carRate,
};
