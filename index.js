const puppeteer = require("puppeteer");
const path = require("path");
const { writeJson, getProductInfo, sleep, getProductList } = require("./src/util");
// const { generateExcel } = require("./src/generateExcel");
const { TaskQueue } = require("./src/TaskQueue");
const { outputDir } = require("./src/config");



const listFile = path.resolve(outputDir, "list.json");
const url = 'https://vacations.ctrip.com/list/personalgroup/sc28.html?moi=358&mot=D&st=%E8%8E%AB%E6%96%AF%E7%A7%91&sv=%E8%8E%AB%E6%96%AF%E7%A7%91&startcity=28';
// const url = 'https://vacations.ctrip.com/list/personalgroup/sc28.html?filter=g5n4&s=2&st=%E8%B5%8F%E8%8A%B1&startcity=28&sv=%E8%B5%8F%E8%8A%B1';

(async () => {
  // 创建一个浏览器对象
  // const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch();
  // 打开一个新的页面
  const page = await browser.newPage();
  // 设置页面的URL
  await page.goto(
    url
  );

  // 等待页面元素加载完成
  await page.waitForSelector(".list_product_box,.js_product_item");

  // 获取总的页数
  // const pageNums = 1
  const pageNums = await page.$eval(".paging_item:nth-last-child(3)", (el) => {
    return el.getAttribute("data-page");
  });

  const pages = Array.from({ length: pageNums });
  console.log(pageNums, pages);
  const queue1 = new TaskQueue(10);
  const allPageProducts = await Promise.all(
    pages.map(async (_, idx) => {
      return new Promise((resolve) => {
        queue1.add(async () => await getProductList(browser, `${url}&p=${idx + 1}`, resolve))
      })
    })
  );


  // const list = allPageProducts.reduce((prev, cur) => {
  //   prev = prev.concat(cur);
  //   return prev;
  // }, []);

  // 获取所有产品的信息数据
  await writeJson(JSON.stringify(allPageProducts), listFile);

  const queue2 = new TaskQueue(5);
  for (let i = 0; i < allPageProducts.length; i++) {
    const list = allPageProducts[i]
    const newProducts = (await Promise.all(
      // list.slice(0, 1).map(getProductInfo)
      list.map(
        (pro) =>
          new Promise((resolve,) =>
            queue2.add(async () => await getProductInfo(browser, pro, resolve))
          )
      )
    )).filter(pro => pro);
    const productFile = path.resolve(outputDir, `products-${i + 1}.json`);
    await writeJson(JSON.stringify(newProducts), productFile);
  }
  //   await generateExcel(products);

  // 最后关闭浏览器（如果不关闭，node程序也不会结束的）
  await browser.close();
})();
