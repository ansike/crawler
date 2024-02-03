const ExcelJS = require("exceljs");
const path = require("path");

const jsonData = require("../output/products.json");
const newJsonData = require("../output/new_products.json");

const { outputIdr } = require("./config");

async function generateExcel(jsonData, file = "products.xlsx") {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("products");

  // 设置表头样式
  const headerStyle = {
    font: {
      bold: true,
      size: 14,
    },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" }, // 黄色背景色
    },
  };

  // 设置表头
  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "主标题", key: "title", width: 30 },
    { header: "副标题", key: "subTitle", width: 50 },
    { header: "产品卖点", key: "pmRec", width: 80 },
    {
      header: "产品特色",
      key: "detailDescriptionContentView",
      width: 100,
    },
    { header: "每日行程", key: "dailyItinerary", width: 200 },
  ];

  worksheet.getRow(1).eachCell((cell) => {
    cell.fill = headerStyle.fill;
    cell.font = headerStyle.font;
  });

  // 添加数据行
  jsonData.forEach((data) => {
    if (!data) return;
    const dailyItinerary = data?.dailyItinerary.map((daily, idx) => {
      return `
Day ${idx + 1} ${daily.title}
  ${daily.subItems
    .map((it) => {
      if (
        it.daily_itinerary_sub_tit === "交通" ||
        it.daily_itinerary_sub_tit.includes("餐")
      ) {
        return `
  ${it.time || ""} ${it.daily_itinerary_sub_tit || ""}
${it.rich_content_view
  .split("\n")
  .map((str) => {
    return `        ${str}`;
  })
  .join("\n")}
        ${it?.meal_hours_box || ""}
      `;
      } else if (it.daily_itinerary_sub_tit === "酒店") {
        return `
  ${it.time || ""} ${it.daily_itinerary_sub_tit || ""}
      ${it.daily_itinerary_hotel?.HotelName}(${
          it.daily_itinerary_hotel?.HotelID
        })
      `;
      } else if (it.daily_itinerary_sub_tit === "景点/场馆") {
        return `
  ${it.time || ""} ${it.daily_itinerary_sub_tit || ""}
      ${it.daily_itinerary_sces
        .map((scene) => {
          return `
          ${scene.PreName || ""}${scene.Name || ""}${scene.SuffixName || ""} (${
            scene.GSScenicSpotID || ""
          })
        `;
        })
        .join("")}
${
  it?.rich_content_view
    ?.split("\n")
    .map((str) => {
      return `        ${str || ""}`;
    })
    .join("\n") || ""
}
        ${it?.meal_hours_box || ""}
`;
      }
    })
    .join("\n")}
    `;
    });
    const detailDescriptionContentView =
      data?.detailDescriptionContentView?.text || "";
    worksheet.addRow({
      id: data.id,
      title: data.title,
      subTitle: data.subTitle,
      pmRec: data.pmRec,
      detailDescriptionContentView: detailDescriptionContentView.startsWith("-")
        ? "'" + detailDescriptionContentView
        : detailDescriptionContentView,
      dailyItinerary: dailyItinerary?.join(""),
    });
  });

  // 保存为 Excel 文件
  await workbook.xlsx.writeFile(path.resolve(outputIdr, file));
  console.log("Excel file generated.");
}

generateExcel(jsonData, "products.xlsx");
generateExcel(newJsonData, "new_products.xlsx");

module.exports = {
  generateExcel,
};
