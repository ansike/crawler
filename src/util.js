const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { promisify } = require("util");
const promiseWrite = promisify(fs.writeFile);
const promiseMkdir = promisify(fs.mkdir);
const promiseReaddir = promisify(fs.readdir);

const { outputDir, zhipuPy } = require("./config");
const { TaskQueue } = require("./TaskQueue");

async function writeJson(data, file) {
  if (fs.existsSync(outputDir)) {
    console.log("Directory exists");
  } else {
    console.log("Directory not found.");
    console.log("Create a new directory.");
    await promiseMkdir(outputDir);
  }
  await promiseWrite(file, data, {
    encode: "utf-8",
  });
  console.log(`success output ${file}`);
}

// 测试
// writeJson('{"a":1}');

// 获取产品详情
async function getProductInfo(browser, product, resolve, reject) {
  // 打开一个新的页面
  const page2 = await browser.newPage();
  // await page2.waitForNavigation({'timeout': 1000*60})
  const url = `https://vacations.ctrip.com/travel/detail/p${product.id}/?city=1&rdc=1`;
  try {
    // 设置页面的URL
    await page2.goto(url);
    await page2.waitForSelector(".daily_itinerary_con");
    console.log("start new page", url);

    try {
      const pmRec = await page2.$eval(".pm_rec", (el) => {
        return el.innerText;
      });
      product.pmRec = pmRec; // 产品卖点
    } catch (error) {
      console.error("产品卖点", error);
    }

    try {
      const detailDescriptionContentView = await page2.$eval(
        ".detail_description_content_view",
        (el) => {
          return {
            text: el.innerText,
            // imgs: Array.from(el.querySelectorAll("img")).map((img) => img.src),
          };
        }
      );
      product.detailDescriptionContentView = detailDescriptionContentView; // 产品特色
    } catch (error) {
      if (error.message.includes("failed to find element matching selector")) {
        // console.error(`没有获取到产品特色：`);
      } else {
        console.error("产品特色", error);
      }
    }
    try {
      const dailyItinerary = await page2.$$eval(
        ".daily_itinerary_item",
        (els) => {
          return els.map((el) => {
            return {
              title: el.querySelector(".day_title .day_txt").innerText,
              subItems: Array.from(
                el.querySelectorAll(".daily_itinerary_sub_item")
              ).map((item) => {
                const obj = {
                  time: item.querySelector(".time_num")?.innerText,
                  daily_itinerary_sub_tit: item.querySelector(
                    ".daily_itinerary_sub_tit"
                  )?.innerText,
                  rich_content_view: item.querySelector(
                    "[class^=rich_content_view]"
                  )?.innerText,
                  meal_hours_box:
                    item.querySelector(".meal_hours_box")?.innerText,
                };

                const daily_itinerary_sces = Array.from(
                  item.querySelectorAll(".daily_itinerary_sce")
                ).map((it) => {
                  const itinerary_sce_hover = it
                    .querySelector(".itinerary_sce_hover")
                    ?.getAttribute("data-json");
                  console.log(itinerary_sce_hover, it.innerText);
                  return itinerary_sce_hover
                    ? JSON.parse(itinerary_sce_hover)
                    : "";
                });

                if (daily_itinerary_sces.length) {
                  obj["daily_itinerary_sces"] = daily_itinerary_sces;
                }

                const hotel = item
                  .querySelector(".daily_itinerary_hotel_box a")
                  ?.getAttribute("data-json");
                if (hotel) {
                  obj["daily_itinerary_hotel"] = JSON.parse(hotel);
                }

                return obj;
              }),
            };
          });
        }
      );

      product.dailyItinerary = dailyItinerary; // 推荐行程
      product.days = dailyItinerary.map((day) => day.title);
    } catch (error) {
      console.error("推荐行程", error);
    }
  } catch (error) {
    console.log("getProductInfo", url, error);
    await page2.close();
    resolve(null);
    return;
  }
  await page2.close();
  resolve(product);
}

async function getProductList(browser, url, resolve, filterFn) {
  const newPage = await browser.newPage();
  let list = null;
  try {
    await newPage.goto(url);
    // 等待页面元素加载完成
    await newPage.waitForSelector(".list_label_blue");
    // 依次点击列表中的每一个行程打开新的页面 for
    list = await newPage.$$eval(".js_product_item", (el) =>
      el.map((el) => {
        console.log("=====", el.querySelectorAll(".list_label_blue").length);
        const sell = el.querySelector(".list_product_travel");
        return {
          id: el.getAttribute("data-track-product-id"),
          title: el.querySelector(".list_product_right .list_product_title")
            .title,
          subTitle: el.querySelector(
            ".list_product_right .list_product_subtitle"
          ).title,
          tags: Array.from(el.querySelectorAll(".list_label_blue span")).map(
            (it) => it.innerText
          ),
          sellNum: sell ? sell.innerText : "",
          // src: el.querySelector(".list_product_left .list_product_pic").src,
        };
      })
    );
    if (filterFn) {
      list = list.filter(filterFn);
    }
  } catch (error) {
    console.log("getProductList error", error);
    await newPage.close();
    resolve([]);
    return;
  }
  await newPage.close();
  resolve(list);
}

async function getDataByUrl(browser, url, filterFn) {
  // 打开一个新的页面
  const page = await browser.newPage();
  // 设置页面的URL
  await page.goto(url);

  // 等待页面元素加载完成
  await page.waitForSelector(".list_product_box,.js_product_item");

  // 获取总的页数
  // const pageNums = 1;
  const pageNums = await page.$eval(".paging_item:nth-last-child(3)", (el) => {
    return el.getAttribute("data-page");
  });

  const pages = Array.from({ length: pageNums });
  console.log(pageNums, pages);
  const queue1 = new TaskQueue(10);
  const allPageProducts = await Promise.all(
    pages.map(async (_, idx) => {
      return new Promise((resolve) => {
        queue1.add(
          async () =>
            await getProductList(
              browser,
              `${url}&p=${idx + 1}`,
              resolve,
              filterFn
            )
        );
      });
    })
  );

  // console.log(allPageProducts);
  return allPageProducts;
}

function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeout * 1000);
  });
}

// 自定义排序函数
const sortFileName = (a, b) => {
  const numA = parseInt(a.split("-")[1].split(".")[0]);
  const numB = parseInt(b.split("-")[1].split(".")[0]);
  return numA - numB;
};

const filterProductByAI = async (filterDir) => {
  const files = await promiseReaddir(filterDir);
  const productFiles = files.filter((file) => file.startsWith("product"));
  const sortProductFiles = productFiles.sort(sortFileName);
  console.log(sortProductFiles);

  const queue = new TaskQueue(3);
  await Promise.all(
    sortProductFiles.map(async (productFile, idx) => {
      const sourceFile = path.resolve(filterDir, productFile);
      const outputFile = path.resolve(filterDir, `format-${productFile}`);
      return new Promise((resolve1) => {
        queue.add(() => {
          return new Promise((resolve2) => {
            // 执行Python脚本并传递参数
            // const pythonProcess = spawn(
            //   "python3",
            //   ["-u", zhipuPy, sourceFile, outputFile],
            //   {
            //     stdio: "inherit",
            //     env: { ...process.env }, // 要确保子进程继承父进程的环境变量
            //     encoding: "utf-8", // 指定编码为UTF-8
            //   }
            // );
            const pythonProcess = spawn(
              "python.exe",
              ["-u", zhipuPy, sourceFile, outputFile],
              {
                stdio: "inherit",
                env: { ...process.env }, // 要确保子进程继承父进程的环境变量
                encoding: "utf-8", // 指定编码为UTF-8
              }
            );

            // 监听Python脚本的退出事件
            pythonProcess.on("close", (code) => {
              console.log(`Python脚本退出，退出码：${code}`);
              resolve2();
              resolve1();
            });
          });
        });
      });
    })
  );
};

module.exports = {
  sleep,
  writeJson,
  getProductList,
  getProductInfo,
  getDataByUrl,
  sortFileName,
  filterProductByAI,
};
