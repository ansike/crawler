// 通过当前的脚本在浏览器的控制台中批量修改车辆资源

// 携程价格的比率
const priceRate = 1.087083333333;

// 2024年
// 1.10到2.6~1.3倍
// 2.6到2.24~1.5倍
// 2.25到3.1~1.3倍
// 清明：4.1~4.7  乘1.3
// 劳动：4.27~5.5乘1.5
// 暑期：7.20~8.20乘1.5
// 国庆：9.26~10.8*1.5
// 寒假：2025.1.16~1.23   2.5~2.12乘1.3
// 春节：2025.1.24~2.4*1.5
// 春节：2024.2.6~2.20 （这里注意调整）

const holidays = [
  // 清明节
  {
    start: "2024-04-01",
    end: "2024-04-07",
    rate: "1.3",
  },
  // 劳动节
  {
    start: "2024-04-27",
    end: "2024-05-05",
    rate: "1.5",
  },
  // 暑假
  {
    start: "2024-07-20",
    end: "2024-08-20",
    rate: "1.5",
  },
  // 中秋节
  {
    start: "2024-09-15",
    end: "2024-09-17",
    rate: "1.5",
  },
  // 国庆节
  {
    start: "2024-09-26",
    end: "2024-10-08",
    rate: "1.5",
  },
];

const pageSize = 1;
(async () => {
  const res = await getResourceList();
  // 总的资源数量
  const totalCount = res.totalCount;
  const pageNums = Math.ceil(totalCount / pageSize);
  for (let i = 1; i <= 1; i++) {
    console
    const { resources } = await getResourceList(i);
    console.log(i, resources.length);
    for (let j = 0; j < resources.length; j++) {
      const resource = resources[j];
      await changeResource(resource);
    }
  }

  // changeResource({
  //   resourceId: 41832416,
  //   resourceDesc: 64750,
  // });
})();

// 修改资源
async function changeResource(resource) {
  const { resourceId, resourceDesc } = resource;
  for (let i = 0; i < holidays.length; i++) {
    const { start, end, rate } = holidays[i];
    const cost = Math.ceil(resourceDesc * rate);
    console.log(start, end, cost)
    await changePrice({ resourceId, cost, start, end });
  }
}

function getDatesBetween(start, end) {
  for (
    var arr = [], dt = new Date(start);
    dt <= end;
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(dt.toISOString().slice(0, 10));
  }
  return arr;
}

// 使用这个函数：
async function getResourceList(pageNo = 1) {
  const res = await fetch(
    "https://online.ctrip.com/restapi/soa2/15638/searchResourceList.json?_fxpcqlniredt=09031119411217359276&_fxpcqlniredt=09031119411217359276",
    {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/json",
        cookieorigin: "https://vbooking.ctrip.com",
        "sec-ch-ua":
          '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-ctx-locale": "zh-CN",
      },
      referrer:
        "https://vbooking.ctrip.com/ivbk/vendor/additionalservicelist?from=vbk",
      referrerPolicy: "no-referrer-when-downgrade",
      body: `{\"contentType\":\"json\",\"head\":{\"cid\":\"09031119411217359276\",\"ctok\":\"\",\"cver\":\"1.0\",\"lang\":\"01\",\"sid\":\"8888\",\"syscode\":\"09\",\"auth\":\"\",\"extension\":[]},\"resourceIds\":[],\"resourceName\":\"\",\"categoryList\":[{\"categoryId\":\"2\",\"piCategoryId\":\"1132\"}],\"departureCityId\":null,\"destinationCityId\":null,\"productRegion\":null,\"active\":\"\",\"vendorId\":null,\"pmEid\":\"\",\"paEid\":\"\",\"createTimeStart\":null,\"createTimeEnd\":null,\"bookingContactId\":642097,\"pageNo\":${pageNo},\"pageSize\":${pageSize},\"businessOwner\":\"VBK\"}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  return await res.json();
}

async function changePrice({ resourceId, cost, start, end }) {
  let dateArr = getDatesBetween(new Date(start), new Date(end));
  const marketPrice = Math.ceil(cost * priceRate);
  const body = {
    contentType: "json",
    head: {
      cid: "09031111115146167449",
      ctok: "",
      cver: "1.0",
      lang: "01",
      sid: "8888",
      syscode: "09",
      auth: "",
      extension: [],
    },
    resourceId,
    costPriceCurrency: "CNY",
    inventoryMode: "U",
    saveType: "M",
    resourcePrices: dateArr.map((date) => {
      return {
        date: date,
        active: true,
        marketPrice,
        cost,
      };
    }),
    resourceChildPrices: [],
    resourceStorages: [],
    relatedSingleRoomPrices: [],
    vendorId: "1431565",
  };
  const res = await fetch("https://online.ctrip.com/restapi/soa2/15638/SaveResourceStoragePriceInfo.json?_fxpcqlniredt=09031119411217359276&_fxpcqlniredt=09031119411217359276", {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9",
      "content-type": "application/json",
      "cookieorigin": "https://vbooking.ctrip.com",
      "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-ctx-locale": "zh-CN"
    },
    "referrer": "https://vbooking.ctrip.com/ivbk/vendor/additionalservicedetail?type=edit&tabkey=2&vendorid=1431565&resourceid=41832416&from=vbk",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": JSON.stringify(body),
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });
  //   console.log("save price", res);
}
