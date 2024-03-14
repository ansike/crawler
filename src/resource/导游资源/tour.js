// 通过当前的脚本在浏览器的控制台中批量创建导游资源200-2000

// 导游 42107885

// 携程价格的比率
const priceRate = 1.087083333333;



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
  for(let i = 0; i < 2000; i++){
    // 
  }
})();

// 修改资源
async function changeResource(resource) {
  const { resourceId, resourceDesc } = resource;
  const resourcePrices = [];
  for (let i = 0; i < holidays.length; i++) {
    const { start, end, rate } = holidays[i];
    const cost = Math.ceil(resourceDesc * rate);
    const marketPrice = Math.ceil(cost * priceRate);
    const tempArr = getDatesBetween(new Date(start), new Date(end));
    resourcePrices.push(
      ...tempArr.map((date) => {
        return {
          date: date,
          active: true,
          marketPrice,
          cost,
        };
      })
    );
  }
  await changePrice({ resourceId, resourcePrices });
  console.log(resourceId, "success");
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
