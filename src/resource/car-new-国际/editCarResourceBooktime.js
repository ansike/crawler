  // 通过当前的脚本在浏览器的控制台中批量修改产品类型

  const vendorBookingContactId = 1351925;

  const pageSize = 100;
  (async () => {
    const res = await getResourceList(1, vendorBookingContactId);
    // 总的资源数量
    const totalCount = res.totalCount;
    const pageNums = Math.ceil(totalCount / pageSize);
    console.log({
      totalCount,
      pageNums
    });
    for (let i = 1; i <= pageNums; i++) {
      const {
        resources
      } = await getResourceList(i, vendorBookingContactId);
      console.log(i, resources.length);
      for (let j = 0; j < resources.length; j++) {
        const resource = resources[j];
        console.log(`page: ${i}, num: ${j}`);
        await changeResource(resource.resourceId);
      }
    }

    // changeResource(63192321)
  })();

  // 修改资源
  async function changeResource(resourceId) {
    const resourceData = await getResource({
      resourceId
    });
    changeResourceInfo({
      resourceId,
      resourceData: resourceData.resourceInfo
    });
    console.log("success", resourceData);
  }

  // 使用这个函数：
  async function getResourceList(pageNo = 1, bookingContactId = '', resourceName = '座') {
    const res = await fetch(
      "https://online.ctrip.com/restapi/soa2/15638/searchResourceList.json?_fxpcqlniredt=09031119411217359276&_fxpcqlniredt=09031119411217359276", {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9",
          "content-type": "application/json",
          cookieorigin: "https://vbooking.ctrip.com",
          "sec-ch-ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "x-ctx-locale": "zh-CN",
        },
        referrer: "https://vbooking.ctrip.com/ivbk/vendor/additionalservicelist?from=vbk",
        referrerPolicy: "no-referrer-when-downgrade",
        body: `{\"contentType\":\"json\",\"head\":{\"cid\":\"09031119411217359276\",\"ctok\":\"\",\"cver\":\"1.0\",\"lang\":\"01\",\"sid\":\"8888\",\"syscode\":\"09\",\"auth\":\"\",\"extension\":[]},\"resourceIds\":[],\"resourceName\":\"${resourceName}\",\"categoryList\":[{\"categoryId\":\"2\",\"piCategoryId\":\"1132\"}],\"departureCityId\":null,\"destinationCityId\":null,\"productRegion\":null,\"active\":\"\",\"vendorId\":null,\"pmEid\":\"\",\"paEid\":\"\",\"createTimeStart\":null,\"createTimeEnd\":null,\"bookingContactId\":${bookingContactId},\"pageNo\":${pageNo},\"pageSize\":${pageSize},\"businessOwner\":\"VBK\"}`,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    return await res.json();
  }

  async function getResource({
    resourceId
  }) {

    const body = {
      "contentType": "json",
      "head": {
        "cid": "09031023410212933560",
        "ctok": "",
        "cver": "1.0",
        "lang": "01",
        "sid": "8888",
        "syscode": "09",
        "auth": "",
        "extension": []
      },
      "resourceId": resourceId
    }


    const res = await fetch(
      "https://online.ctrip.com/restapi/soa2/15638/queryResourceInfo?_fxpcqlniredt=09031072216594047056&_fxpcqlniredt=09031072216594047056", {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9",
          "content-type": "application/json",
          cookieorigin: "https://vbooking.ctrip.com",
          priority: "u=1, i",
          "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "x-ctx-locale": "zh-CN",
        },
        referrerPolicy: "no-referrer-when-downgrade",
        body: JSON.stringify(body),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    return await res.json();
  }
  async function changeResourceInfo({
    resourceData
  }) {
    const {
      baseInfo,
      bookingControllerInfo,
      vendorRelatedInfo,
      carIds
    } =
    resourceData;

    bookingControllerInfo.advanceBookingTime = "12:00";
    // baseInfo.forProductCategory = [26, 11];

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
      "https://online.ctrip.com/restapi/soa2/15638/saveResource?_fxpcqlniredt=09031072216594047056&_fxpcqlniredt=09031072216594047056", {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9",
          "content-type": "application/json",
          cookieorigin: "https://vbooking.ctrip.com",
          priority: "u=1, i",
          "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
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