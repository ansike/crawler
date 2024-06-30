  // 通过当前的脚本在浏览器的控制台中批量修改车辆可选人数

  // 1. 调整车型人数
  // 查找ask、tl、dr 三人 创建的所有用车资源，将 5座舒适-19座 等关键字样筛选出来，在原数字的基础上减1设置新的人数。
  /**
   * 5座经济 1-3人
   * 5座舒适 1-4人
   * 7座 1-6人
   * 9座 1-8人
   * 12座 1-11人
   * 14座 1-14人
   * 19座 1-18人
   */

  const carTypeMap = {
    "5座经济": 3,
    "舒适5座": 4,
    "7座": 6,
    "商务9座": 8,
    "12座": 11,
    "14座": 13,
    "19座中巴": 18,
  };

  const carTypeKeys = Object.keys(carTypeMap);

  // 三人的预定ID
  const bookIds = [
    506368, // dr
    621237, // tl
    642097, // ask
  ];

  class Queue {
    constructor() {
      this.limit = 4;
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
    for (let k = 0; k < bookIds.length; k++) {
      const bookId = bookIds[k];
      const res = await getResourceList(1, bookId);
      // 总的资源数量
      const totalCount = res.totalCount;
      const pageNums = Math.ceil(totalCount / pageSize);
      // const pageNums = 1;
      console.log({ totalCount, pageNums });
      for (let i = 1; i <= pageNums; i++) {
        const { resources } = await getResourceList(i, bookId);
        console.log(i, resources.length);
        for (let j = 0; j < resources.length; j++) {
          const resource = resources[j];
          console.log(`page: ${i}, num: ${j}`);
          taskQueue.add(() => changeResource(resource));
        }
      }
    }
  })();

  // 修改资源
  async function changeResource(resource) {
    const { resourceId, resourceDesc } = resource;
    console.log("start change", resourceId, resourceDesc);
    const resourceData = await getResource({ resourceId });
    changeResourcePeopleNum({ resourceId, resourceData: resourceData.resourceInfo });
    console.log("success", resourceData);
  }

  // 使用这个函数：
  async function getResourceList(pageNo = 1, bookingContactId='', resourceName='座') {
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
        body: `{\"contentType\":\"json\",\"head\":{\"cid\":\"09031119411217359276\",\"ctok\":\"\",\"cver\":\"1.0\",\"lang\":\"01\",\"sid\":\"8888\",\"syscode\":\"09\",\"auth\":\"\",\"extension\":[]},\"resourceIds\":[],\"resourceName\":\"${resourceName}\",\"categoryList\":[{\"categoryId\":\"2\",\"piCategoryId\":\"1132\"}],\"departureCityId\":null,\"destinationCityId\":null,\"productRegion\":null,\"active\":\"\",\"vendorId\":null,\"pmEid\":\"\",\"paEid\":\"\",\"createTimeStart\":null,\"createTimeEnd\":null,\"bookingContactId\":${bookingContactId},\"pageNo\":${pageNo},\"pageSize\":${pageSize},\"businessOwner\":\"VBK\"}`,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    return await res.json();
  }

  async function getResource({ resourceId }) {
    const res = await fetch(
      "https://online.ctrip.com/restapi/soa2/15638/queryResourceInfo?_fxpcqlniredt=09031072216594047056&_fxpcqlniredt=09031072216594047056",
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9",
          "content-type": "application/json",
          cookieorigin: "https://vbooking.ctrip.com",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "x-ctx-locale": "zh-CN",
        },
        referrerPolicy: "no-referrer-when-downgrade",
        body: `{"contentType":"json","head":{"cid":"09031072216594047056","ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","extension":[]},"resourceId":${resourceId}}`,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    return await res.json();
  }
  async function changeResourcePeopleNum({ resourceData }) {
    const { baseInfo, bookingControllerInfo, vendorRelatedInfo, carIds } =
      resourceData;
    const { name } = baseInfo;
    const matchCarType = carTypeKeys.reverse().find((key) => {
      return name.includes(key);
    });
    if (matchCarType) {
      bookingControllerInfo.maxPersonQuantity = carTypeMap[matchCarType];
    }else{
      
      return;
    }
    const data = {
      contentType: "json",
      head: {
        cid: "09031072216594047056",
        ctok: "",
        cver: "1.0",
        lang: "01",
        sid: "8888",
        syscode: "09",
        auth: "",
        extension: [],
      },
      resourceInfo: {
        baseInfo,
        bookingControllerInfo,
        vendorRelatedInfo,
        carIds,
      },
      customerInfoTemplateOpen: "T",
    };
    await fetch(
      "https://online.ctrip.com/restapi/soa2/15638/saveResource?_fxpcqlniredt=09031072216594047056&_fxpcqlniredt=09031072216594047056",
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9",
          "content-type": "application/json",
          cookieorigin: "https://vbooking.ctrip.com",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "x-ctx-locale": "zh-CN",
        },
        referrerPolicy: "no-referrer-when-downgrade",
        body: JSON.stringify(data),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
  }
