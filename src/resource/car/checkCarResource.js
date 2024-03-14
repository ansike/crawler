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
  // 寒假
  {
    start: "2025-01-16",
    end: "2025-01-23",
    rate: "1.3",
  },
  {
    start: "2025-01-24",
    end: "2025-02-04",
    rate: "1.5",
  },
  {
    start: "2025-02-05",
    end: "2025-02-12",
    rate: "1.3",
  },
];

class Queue {
  constructor() {
    this.limit = 10;
    this.running = 0;
    this.queue = [];
  }
  async add(task) {
    this.queue.push(task);
    await this.run();
  }
  async run() {
    while (this.queue.length && this.running < this.limit) {
      const task = this.queue.shift();
      try {
        this.running++;
        await task();
      } catch (error) {
        console.log("task run", error);
      }
      this.running--;
      await this.run();
    }
  }
}
const pageSize = 100;
const taskQueue = new Queue();
(async () => {
  const res = await getResourceList();
  // 总的资源数量
  const totalCount = res.totalCount;
  const pageNums = Math.ceil(totalCount / pageSize);
  for (let i = 0; i <= pageNums; i++) {
    const { resources } = await getResourceList(i);
    console.log(i, resources.length);
    for (let j = 0; j < resources.length; j++) {
      const resource = resources[j];
      // console.log(`page: ${i}, num: ${j}`);
      taskQueue.add(() => changeResource(resource));
    }
  }
})();

// 修改资源
async function changeResource(resource) {
  const { resourceId, resourceDesc } = resource;
  // 不存在或者不是数字
  if (!resourceDesc || !/^\d+$/.test(resourceDesc.replace(/\s/,''))) {
    console.log("resourceDesc有误：", resourceId, resourceDesc);
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
      body: `{\"contentType\":\"json\",\"head\":{\"cid\":\"09031119411217359276\",\"ctok\":\"\",\"cver\":\"1.0\",\"lang\":\"01\",\"sid\":\"8888\",\"syscode\":\"09\",\"auth\":\"\",\"extension\":[]},\"resourceIds\":[],\"resourceName\":\"\",\"categoryList\":[{\"categoryId\":\"2\",\"piCategoryId\":\"1132\"}],\"departureCityId\":null,\"destinationCityId\":null,\"productRegion\":null,\"active\":\"\",\"vendorId\":null,\"pmEid\":\"\",\"paEid\":\"\",\"createTimeStart\":null,\"createTimeEnd\":null,\"bookingContactId\":506368,\"pageNo\":${pageNo},\"pageSize\":${pageSize},\"businessOwner\":\"VBK\"}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  return await res.json();
}

async function changePrice({ resourceId, resourcePrices }) {
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
    resourcePrices,
    resourceChildPrices: [],
    resourceStorages: [],
    relatedSingleRoomPrices: [],
    vendorId: "1431565",
  };
  const res = await fetch(
    "https://online.ctrip.com/restapi/soa2/15638/SaveResourceStoragePriceInfo.json?_fxpcqlniredt=09031119411217359276&_fxpcqlniredt=09031119411217359276",
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
        "https://vbooking.ctrip.com/ivbk/vendor/additionalservicedetail?type=edit&tabkey=2&vendorid=1431565&resourceid=41832416&from=vbk",
      referrerPolicy: "no-referrer-when-downgrade",
      body: JSON.stringify(body),
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  //   console.log("save price", res);
}
