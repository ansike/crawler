const name = "张春影";
const pageSize = 200;
(async () => {
  const data = await listProduct({ name, pageSize: 10 });
  const total = data.total;
  const products = [];
  for (let i = 1; i <= Math.ceil(total / pageSize); i++) {
    const data = await listProduct({ name, pageSize, pageIndex: i });
    const productIds = data.resourceInfoList.map((item) => item.productId);
    products.push(...productIds);
  }

  console.log(products.length);

  // 浏览器输出到一个csv文件，每行40个productId中间用逗号分隔，超过40个换行
  // 将数组转换为CSV格式
  let csv = "";
  for (let i = 0; i < products.length; i++) {
    if (i % 40 === 0) {
      csv += "\n";
    }
    csv += products[i];
    if (i !== products.length - 1) {
      csv += ",";
    }
  }
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "product_ids.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
})();
async function listProduct({ name, pageSize = 200, pageIndex = 1 }) {
  const data = {
    contentType: "json",
    head: {
      cid: "09031056310749994837",
      ctok: "",
      cver: "1.0",
      lang: "01",
      sid: "8888",
      syscode: "09",
      auth: "",
      extension: [],
    },
    categoryIds: [9, 10, 11, 26],
    productPatternList: [1, 3, 2, 4],
    preSaleFilterStatus: [],
    piCategoryIdLvl1: [],
    logicDelete: "",
    providerProductName: name,

    onlyIdCondition: true,
    onlyParentChild: false,
    onlyTourPackage: false,
    pageIndex,
    pageSize,
    forCruise: false,
    orderBy: "",
    asc: true,
  };

  const res = await fetch(
    "https://online.ctrip.com/restapi/soa2/15638/getResourceInfoList.json?_fxpcqlniredt=09031111115146167449&_fxpcqlniredt=09031111115146167449",
    {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json",
        cookieorigin: "https://vbooking.ctrip.com",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-ctx-locale": "zh-CN",
      },
      referrer:
        "https://vbooking.ctrip.com/product/input/productListMerge?from=vbk&typeid=9,10,11,26&pattern=1,3,4",
      referrerPolicy: "no-referrer-when-downgrade",
      body: JSON.stringify(data),
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  return await res.json();
}
