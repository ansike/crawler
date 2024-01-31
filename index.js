const puppeteer = require("puppeteer");
const { writeJson } = require("./src/util");
const { generateExcel } = require("./src/generateExcel");

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

  // // 获取总的页数
  //   const pageNums = await page.$eval(".paging_item:nth-last-child(3)", (el) => {
  //     return el.getAttribute("data-page");
  //   });
  //   console.log({ pageNums });

  // 依次点击列表中的每一个行程打开新的页面 for
  const list = await page.$$eval(".list_product_box,.js_product_item", (el) =>
    el.map((el) => ({
      id: el.getAttribute("data-track-product-id"),
      title: el.querySelector(".list_product_right .list_product_title").title,
      subTitle: el.querySelector(".list_product_right .list_product_subtitle")
        .title,
      src: el.querySelector(".list_product_left .list_product_pic").src,
    }))
  );
  const products = await Promise.all(
    list.map(async (product) => {
      // list.slice(0, 1).map(async (product) => {
      // 打开一个新的页面
      const page2 = await browser.newPage();
      // 设置页面的URL

      const url = `https://vacations.ctrip.com/travel/detail/p${product.id}/?city=1&rdc=1`;
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
              imgs: Array.from(el.querySelectorAll("img")).map(
                (img) => img.src
              ),
            };
          }
        );
        product.detailDescriptionContentView = detailDescriptionContentView; // 产品特色
      } catch (error) {
        console.error("产品特色", error);
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
      await page2.close();
      return product;
    })
  );

  //   console.log(JSON.stringify(products));
  //   console.log(products);
  //   await writeJson(JSON.stringify(products));
  await generateExcel(products);

  // 最后关闭浏览器（如果不关闭，node程序也不会结束的）
  await browser.close();
})();
