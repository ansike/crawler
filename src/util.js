const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const promiseWrite = promisify(fs.writeFile);
const promiseMkdir = promisify(fs.mkdir);

const { outputDir } = require("./config");


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
    } catch (error) {
      console.error("推荐行程", error);
    }

  } catch (error) {
    console.log('getProductInfo', url, error)
    await page2.close();
    resolve(null)
    return;
  }
  await page2.close();
  resolve(product);
}

async function getProductList(browser, url, resolve, reject) {
  const newPage = await browser.newPage();
  let list = null;
  try {
    await newPage.goto(url);
    // 等待页面元素加载完成
    await newPage.waitForSelector(".list_product_box,.js_product_item");
    // 依次点击列表中的每一个行程打开新的页面 for
    list = await newPage.$$eval(
      ".list_product_box,.js_product_item",
      (el) =>
        el.map((el) => ({
          id: el.getAttribute("data-track-product-id"),
          title: el.querySelector(".list_product_right .list_product_title")
            .title,
          subTitle: el.querySelector(
            ".list_product_right .list_product_subtitle"
          ).title,
          // src: el.querySelector(".list_product_left .list_product_pic").src,
        }))
    );
  } catch (error) {
    await newPage.close();
    resolve(null)
    return;
  }
  await newPage.close();
  resolve(list)
}

function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeout * 1000);
  });
}

module.exports = {
  sleep,
  writeJson,
  getProductList,
  getProductInfo,
};
