const puppeteer = require("puppeteer");
const { writeJson, getProductInfo, sleep } = require("./src/util");
const { generateExcel } = require("./src/generateExcel");
const { TaskQueue } = require("./src/TaskQueue");

const queue = new TaskQueue();

(async () => {
  // 创建一个浏览器对象
  //   const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch();
  // 打开一个新的页面
  const page = await browser.newPage();
  // 设置页面的URL
  await page.goto(
    "https://vacations.ctrip.com/list/whole/d-shanghai-2.html?filter=g5u2&s=2&startcity=28"
  );

  // 等待页面元素加载完成
  await page.waitForSelector(".list_product_box,.js_product_item");

  // 获取到首页行程列表，下一步考虑分页循环获取 for

  // 获取总的页数
  const pageNums = await page.$eval(".paging_item:nth-last-child(3)", (el) => {
    return el.getAttribute("data-page");
  });

  //   const pages = new Array(1).fill(1);
  const pages = [1];

  console.log({ pageNums, pages });

  const allPageProducts = await Promise.all(
    pages.map(async (_, pageNum) => {
      const newPage = await browser.newPage();
      await newPage.goto(
        `https://vacations.ctrip.com/list/whole/d-shanghai-2.html?filter=g5u2&s=2&startcity=28&p=${
          pageNum + 1
        }`
      );
      // 等待页面元素加载完成
      await newPage.waitForSelector(".list_product_box,.js_product_item");
      // 依次点击列表中的每一个行程打开新的页面 for
      const list = await newPage.$$eval(
        ".list_product_box,.js_product_item",
        (el) =>
          el.map((el) => ({
            id: el.getAttribute("data-track-product-id"),
            title: el.querySelector(".list_product_right .list_product_title")
              .title,
            subTitle: el.querySelector(
              ".list_product_right .list_product_subtitle"
            ).title,
            src: el.querySelector(".list_product_left .list_product_pic").src,
          }))
      );
      await newPage.close();
      return list;
    })
  );

  //   const list = allPageProducts.reduce((prev, cur) => {
  //     prev = prev.concat(cur);
  //     return prev;
  //   }, []);

  const products = [];
  for (const list of allPageProducts) {
    const newProducts = await Promise.all(
      // list.slice(0, 1).map(getProductInfo)
      list.map(
        (pro) =>
          new Promise((resolve) =>
            queue.add(async () => await getProductInfo(browser, pro, resolve))
          )
      )
    );
    await sleep(5);
    console.log("list", list);
    products.push(...newProducts);
  }

  //   console.log(JSON.stringify(products));
  //   console.log(products);
  //   console.log(allPageProducts);

  await writeJson(JSON.stringify(allPageProducts[0]));
//   await generateExcel(products);

  // 最后关闭浏览器（如果不关闭，node程序也不会结束的）
  await browser.close();
})();
