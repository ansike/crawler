// 通过当前的脚本在浏览器的控制台中批量检查车辆资源是否正常

const ErrorConf = {
  ResourceDescError: "resourceDesc未设置或者不是数字",
  EmptyPriceError: "未设置价格库存",
  NotEqualError: "描述金额与价格库存金额不等",
};
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
const errorIds = [];
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
      taskQueue.add(() => checkResource(resource));
    }
  }
})();

// 修改资源
async function checkResource(resource) {
  const { resourceId, resourceDesc } = resource;
  // 不存在或者不是数字
  if (!resourceDesc || !/^\d+$/.test(resourceDesc.replace(/\s/, ""))) {
    errorIds.push({
      id: resourceId,
      errorType: "ResourceDescError",
      reason: ErrorConf.ResourceDescError,
    });
    console.error("resourceDesc有误：", resourceId, resourceDesc);
    return;
  }
  checkResourcePrice({ resourceId, expectCost: resourceDesc });
}

// 使用这个函数：
async function getResourceList(pageNo = 1) {
  // dr 506368
  // tl 621237
  const bookingContactId = 506368;
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
      body: `{\"contentType\":\"json\",\"head\":{\"cid\":\"09031119411217359276\",\"ctok\":\"\",\"cver\":\"1.0\",\"lang\":\"01\",\"sid\":\"8888\",\"syscode\":\"09\",\"auth\":\"\",\"extension\":[]},\"resourceIds\":[],\"resourceName\":\"\",\"categoryList\":[{\"categoryId\":\"2\",\"piCategoryId\":\"1132\"}],\"departureCityId\":null,\"destinationCityId\":null,\"productRegion\":null,\"active\":\"\",\"vendorId\":null,\"pmEid\":\"\",\"paEid\":\"\",\"createTimeStart\":null,\"createTimeEnd\":null,\"bookingContactId\":${bookingContactId},\"pageNo\":${pageNo},\"pageSize\":${pageSize},\"businessOwner\":\"VBK\"}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  return await res.json();
}

async function checkResourcePrice({ resourceId, expectCost }) {
  const res = await fetch(
    "https://online.ctrip.com/restapi/soa2/15638/getResourceStoragePriceInfo.json?_fxpcqlniredt=09031111115146167449&_fxpcqlniredt=09031111115146167449",
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
        "https://vbooking.ctrip.com/ivbk/vendor/additionalservicedetail?type=edit&tabkey=2&vendorid=1431565&resourceid=41640588&from=vbk",
      referrerPolicy: "no-referrer-when-downgrade",
      body: `{"contentType":"json","head":{"cid":"09031111115146167449","ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","extension":[]},"resourceId":${resourceId},"begin":"2024-03-16","end":"2024-03-16"}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  const { resourcePricesAdultAndChild } = await res.json();
  try {
    let realCost = null;
    try {
      realCost = resourcePricesAdultAndChild[0].cost;
    } catch (error) {
      const id = await getResourceInfo(resourceId);
      errorIds.push({
        id: resourceId,
        errorType: "EmptyPriceError",
        reason: ErrorConf.EmptyPriceError,
        vendorBookingContactId: id,
      });
      throw new Error("未设置价格库存");
    }
    if (+expectCost !== +realCost) {
      const id = await getResourceInfo(resourceId);
      errorIds.push({
        id: resourceId,
        errorType: "NotEqualError",
        reason: ErrorConf.NotEqualError,
        vendorBookingContactId: id,
      });
      throw new Error("描述金额与价格库存金额不等");
    }
  } catch (error) {
    console.error(`resourceId 检查出错`, resourceId, error);
  }
  console.log("errorIds", JSON.stringify(errorIds));
}

function groupBy(arr, key) {
  const map = new Map();
  arr.forEach((it) => {
    if (map.has(it[key])) {
      const group = map.get(it[key]);
      group.push(it);
      map.set(it[key], group);
    } else {
      map.set(it[key], [it]);
    }
  });
  return Array.from(map.values());
}

async function getResourceInfo(resourceId) {
  const res = await fetch(
    "https://online.ctrip.com/restapi/soa2/15638/queryResourceInfo?_fxpcqlniredt=09031111115146167449&_fxpcqlniredt=09031111115146167449",
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
        "https://vbooking.ctrip.com/ivbk/vendor/serviceInfoMerge?resourceid=41381397&from=vbk",
      referrerPolicy: "no-referrer-when-downgrade",
      body: `{"contentType":"json","head":{"cid":"09031111115146167449","ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","extension":[]},"resourceId":${resourceId}}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  const data = await res.json();
  return data["resourceInfo"]["bookingControllerInfo"][
    "vendorBookingContactId"
  ];
}
