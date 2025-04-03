// 一人补车差

// 携程价格的比率
const priceRate = 1.087083333333;

const cars = [];
for (let i = 150; i <= 10000; i += 50) {
  cars.push(i);
}

// 西藏 642097， 安徽 981597
const vendorMap = {
  // 西藏
  1431565: {
    vendorBookingContactId: 642097,
    piCustomerInfoTemplateId: 31578645,
  },
  // 安徽
  1393638: {
    vendorBookingContactId: 981597,
    piCustomerInfoTemplateId: 29312799,
  },
};
const main = async () => {
  const vendorId = await getVendorId();
  for (let i = 0; i < cars.length; i++) {
    const price = cars[i];

    const data = await saveResource(price, vendorId);
    await savePrice(data.resourceId, price, vendorId);
    console.log("save resource", price, data.resourceId);
    // await savePrice(41654939, price);
  }
};

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
async function saveResource(price, vendorId) {
  const conf = vendorMap[vendorId];
  const body = {
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
      baseInfo: {
        piCategoryId: 1132,
        isVisaOnTheirOwn: "F",
        isHotelResource: "F",
        inputLocale: "zh-CN",
        description: `${price}` + "",
        chargeUnit: "人",
        trainInfo: { trainType: 1 },
        carInfo: { useCarMode: 1, carMode: 1 },
        ticketType: 0,
        peopleGroup: 1,
        canCashBack: "F",
        isHighRisk: "F",
        isHotelShareRoom: "F",
        receiveAndSend: { isNeed: "F", selectedReceiveAndSend: [] },
        isChildAsAdult: "F",
        maxAdultNum: 1,
        maxChildNum: 1,
        isVisaAssignInAdvance: "F",
        isAutoVisa: "F",
        isAutoGetVisa: "F",
        destinationCity: {
          cityId: 39,
          name: "乌鲁木齐",
          eName: "Urumqi",
          countryId: 1,
          countryName: "中国",
          provinceId: 29,
          provinceName: "新疆",
          cityCode: "URC",
          key: 39,
          value: "乌鲁木齐/新疆/中国",
        },
        resourceId: null,
        categoryId: 2,
        businessType: "OPT",
        name: "一人补车差",
      },
      bookingControllerInfo: {
        vendorConfirmModeID: 2,
        workTemplateId: 1,
        vendorBookingContactId: conf.vendorBookingContactId,
        vendorConfirmHours: 0,
        isChooseRequired: "T",
        isDefaultChoose: "T",
        chooseMode: "P",
        isChooseDate: "F",
        canFirstDayBooking: "T",
        canLastDayBooking: "T",
        isAutoMatch: "F",
        active: "T",
        isShow: "T",
        isSmsNotice: "F",
        isSmsVBKNoticeType: 1,
        forAdult: "T",
        forAdultQuantity: 1,
        forAdultProductQuantity: 1,
        forChild: "T",
        forChildQuantity: 1,
        forChildProductQuantity: 1,
        advanceBookingDays: 1,
        advanceBookingTime: "12:00",
        bookingTimeZoneId: 21,
        minPersonQuantity: 1,
        maxPersonQuantity: 1,
        minTravelDays: 1,
        maxTravelDays: 999,
        maxQuantity: 99,
        minQuantity: 1,
        visaAdvanceBookingDayTime: {
          visaStuffMakeTime: 0,
          visaWaitTime: 0,
          visaWorkday: 0,
          visaDeliverDay: 0,
          visaOrderAndStuff: 0,
          visaConfirmDay: 0,
          visaAdvanceBookingTime: "12:00",
          bookingTimeZoneId: 21,
        },
        providerERAId: null,
        contact: "安思科",
        vendorBookingEmail: "ansike@qq.com",
        vendorBookingContactPhoneAreaCode: "+86",
        vendorBookingPhone: "15910250965",
        fullVendorBookingPhone: "+86 15910250965",
        piCustomerInfoTemplateId: conf.piCustomerInfoTemplateId,
      },
      vendorRelatedInfo: {
        bookingMode: "S",
        forModifyOrder: "F",
        canModify: "T",
        exchangeMode: 1,
        isProviderDistribution: "F",
        isNeedReceipt: "T",
        receiptDay: 2,
        receiptTime: "12:00",
        receiptContent:
          "等待地点，司机电话，司机姓名，供应商紧急联系人，供应商紧急电话",
        pMEID: "PTZC",
        pAEID: "PTZC",
        regionId: 32,
        isClientAssign: "F",
        productDistributionChannelList: [
          "bestone",
          "bestoneb2b",
          "youtripshop",
          "ctripshop",
          "online",
          "ctrip",
          "trip",
          "tripsystem",
        ],
      },
      carIds: [],
    },
    customerInfoTemplateOpen: "T",
  };
  const resourceRes = await fetch(
    "https://online.ctrip.com/restapi/soa2/15638/saveResource?_fxpcqlniredt=09031072216594047056&_fxpcqlniredt=09031072216594047056",
    {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/json",
        cookieorigin: "https://vbooking.ctrip.com",
        "sec-ch-ua":
          '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
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
  return await resourceRes.json();
}

async function savePrice(resourceId, cost, vendorId) {
  let dateArr = getDatesBetween(new Date(), new Date("2030/05/16"));
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
    saveType: "N",
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
    vendorId: vendorId,
  };
  const res = await fetch(
    "https://online.ctrip.com/restapi/soa2/15638/SaveResourceStoragePriceInfo.json?_fxpcqlniredt=09031111115146167449&_fxpcqlniredt=09031111115146167449",
    {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/json",
        cookieorigin: "https://vbooking.ctrip.com",
        "sec-ch-ua":
          '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
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
  //   console.log("save price", res);
}

const getVendorId = async () => {
  const res = await fetch(
    "https://vbooking.ctrip.com/ivbk/vendor/saleControlMerge?producttype=0&from=vbk",
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        priority: "u=0, i",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "upgrade-insecure-requests": "1",
      },
      referrerPolicy: "no-referrer-when-downgrade",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  );
  const text = await res.text();
  const { vendorId } = parseHtmlToObj(text);
  return vendorId;
};

const parseHtmlToObj = (html) => {
  const match = html.match(/<script>([\s\S]*?)<\/script>/);
  if (match) {
    // TODO 换一个方法获取 product 基础数据
    const str = match[1].split(" = ")[2].split("\n")[0];
    // const obj = JSON.parse(str)
    return JSON.parse(str);
  } else {
    console.log("Unable to find __INITIAL_STATE__ object in the input string.");
    return;
  }
};

main();
