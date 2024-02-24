const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const {
  getDataByUrl,
  writeJson,
  getProductInfo,
  sortFileName,
  filterProductByAI,
} = require("./src/util");
const { generateExcel } = require("./src/generateExcel");
const { TaskQueue } = require("./src/TaskQueue");
const { outputDir, zhipuPy, regions } = require("./src/config");
const promiseReaddir = promisify(fs.readdir);
const promiseMkdir = promisify(fs.mkdir);
const promiseReadFile = promisify(fs.readFile);
const promiseExists = promisify(fs.exists);
const { spawn } = require("child_process");
const { dealFilterExcel } = require("./src/excel");

// const url =
//   "https://vacations.ctrip.com/list/personalgroup/sc1.html?p=6&s=2&st=%E6%9E%97%E8%8A%9D&startcity=1&sv=%E6%9E%97%E8%8A%9D";

// const region = "lingzhi";
const groupSize = 20;

async function main(region, url) {
  const productDir = path.resolve(outputDir, `${region}`);
  const isExist = await promiseExists(productDir);
  if (!isExist) {
    await promiseMkdir(productDir);
  }
  const listFile = path.resolve(productDir, "list.json");
  // 创建一个浏览器对象
  // const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch();

  // ----------------------- 1. 获取产品列表 --------------------------
  {
    const allPageProducts = await getDataByUrl(browser, url, (pro) => {
      return pro.tags.find((tag) => tag.includes("花")) && !!pro.sellNum;
    });

    const flatList = allPageProducts.flat(1);
    const resGroupProducts = [];
    for (let i = 0; i < flatList.length; i += groupSize) {
      resGroupProducts.push(flatList.slice(i, i + groupSize));
    }

    // 获取所有产品的信息数据
    await writeJson(JSON.stringify(resGroupProducts), listFile);
  }
  // ----------------------- 2. 获取产品详情 --------------------------
  {
    const groupProductStr = await promiseReadFile(listFile, {
      encoding: "utf-8",
    });

    const groupProducts = JSON.parse(groupProductStr);
    const queue2 = new TaskQueue(5);
    for (let i = 0; i < groupProducts.length; i++) {
      const list = groupProducts[i];
      const newProducts = (
        await Promise.all(
          list.map(
            (pro) =>
              new Promise((resolve) =>
                queue2.add(
                  async () => await getProductInfo(browser, pro, resolve)
                )
              )
          )
        )
      ).filter((pro) => pro);
      const productFile = path.resolve(productDir, `product-${i + 1}.json`);
      await writeJson(JSON.stringify(newProducts), productFile);
    }
  }

  await browser.close();

  // ----------------------- 3. AI 清洗数据 --------------------------
  await filterProductByAI(productDir);
  
  // ----------------------- 4. 生成excel --------------------------
  await dealFilterExcel(productDir);
}
(async () => {
  for (let i = 0; i < regions.length; i++) {
    const { region, regionPinYin } = regions[i];
    const url = `https://vacations.ctrip.com/list/personalgroup/sc1.html?s=2&st=${region}&startcity=1&sv=${region}`;
    console.log(region, url)
    await main(regionPinYin, url);
  }
})();
