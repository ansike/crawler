const path = require("path");

const outputDir = path.resolve(process.cwd(), "./output");
const zhipuPy = path.resolve(process.cwd(), "./src/ai/zhipu/index.py");

// 新疆（10）、陕西（10）、江苏（20）、浙江（30）、上海（10）
const regions = [
  // // 第一批
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
  // {
  //   region: "武汉",
  //   regionPinYin: "wuhan",
  // },
  // {
  //   region: "无锡",
  //   regionPinYin: "wuxi",
  // },
  // {
  //   region: "罗平",
  //   regionPinYin: "luoping",
  // },
  // {
  //   region: "婺源",
  //   regionPinYin: "wuyuan",
  // },
  // // 第二批
  // {
  //   region: "西藏",
  //   regionPinYin: "xizang",
  // },
  // {
  //   region: "陕西",
  //   regionPinYin: "shanxi",
  // },
  // {
  //   region: "江苏",
  //   regionPinYin: "jiangsu",
  // },
  // {
  //   region: "浙江",
  //   regionPinYin: "zhejiang",
  // },
  // {
  //   region: "上海",
  //   regionPinYin: "shanghai",
  // },
  // {
  //   region: "新疆",
  //   regionPinYin: "xinjiang",
  // },
];

module.exports = {
  outputDir,
  zhipuPy,
  regions,
};
