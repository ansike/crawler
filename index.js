const puppeteer = require("puppeteer");
const path = require("path");
const { getDataByUrl, writeJson, getProductInfo } = require("./src/util");
// const { generateExcel } = require("./src/generateExcel");
const { TaskQueue } = require("./src/TaskQueue");
const { outputDir } = require("./src/config");

const listFile = path.resolve(outputDir, "list.json");
const url =
  "https://vacations.ctrip.com/list/personalgroup/sc1.html?st=%E9%87%91%E5%B7%9D&startcity=1&sv=%E9%87%91%E5%B7%9D";

(async () => {
  // 创建一个浏览器对象
  // const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch();

  const allPageProducts = await getDataByUrl(browser, url, "花");

  // // 获取所有产品的信息数据
  await writeJson(JSON.stringify(allPageProducts), listFile);

  const queue2 = new TaskQueue(5);
  for (let i = 0; i < allPageProducts.length; i++) {
    const list = allPageProducts[i];
    const newProducts = (
      await Promise.all(
        // list.slice(0, 1).map(getProductInfo)
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
    const productFile = path.resolve(outputDir, `products-${i + 1}.json`);
    await writeJson(JSON.stringify(newProducts), productFile);
  }

  // 最后关闭浏览器（如果不关闭，node程序也不会结束的）
  await browser.close();
})();
