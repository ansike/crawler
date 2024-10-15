// 通过当前的脚本在浏览器的控制台中批量创建导游资源200-2000

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

  for (let i = 100; i <= 2000; i+=50) {
    // const { id, price } = ids[i];
    const price = i
    const tour = await createTour(price, vendorId);
    const dateArr = getDatesBetween(
      new Date(),
      new Date("2030/03/31")
    );
    await SaveResourceStoragePriceInfo(tour.resourceId, price, dateArr);
    console.log(price, tour.resourceId)
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
async function createTour(price = 300, vendorId) {
  const conf = vendorMap[vendorId]
  const data = {
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
    resourceInfo: {
      baseInfo: {
        piCategoryId: 1037,
        name: "导游" + price,
        categoryId: 58,
        categoryName: "导游",
        inputLocale: "zh-CN",
        subName: "",
        description: price + "",
        chargeUnit: "天",
        visaPeopleGroupType: 0,
        destinationCity: {
          cityId: 41,
          cityName: "拉萨",
          countryId: 1,
          countryName: "中国",
          provinceId: 30,
          provinceName: "西藏",
          eName: "Lhasa",
          key: 41,
          value: "拉萨",
        },
        departureCities: [],
        saleCities: [],
        departurePlace: "",
        departureTime: "08:00",
        zone: [],
        airportInfo: [],
        businessType: "OPT",
        carInfo: {
          carMode: 1,
          useCarMode: 1,
        },
        trainInfo: {
          trainType: 1,
        },
        ticketType: 0,
        peopleGroup: 1,
        poiScenicSpot: {},
        isHighRisk: "F",
        isHotelResource: "F",
        isHotelShareRoom: "F",
        receiveAndSend: {
          isNeed: "F",
          selectedReceiveAndSend: [],
        },
        isChildNeedExtraPriceForNotShareRoom: "T",
        isChildAsAdult: "F",
        maxAdultNum: 1,
        maxChildNum: 1,
        isVisaOnTheirOwn: "F",
        visaInfo: [],
        isAutoVisa: "F",
        isAutoGetVisa: "F",
        expansionCouponId: 0,
        businessOwner: "VBK",
        transportation: 0,
        canCashBack: "F",
        isVisaAssignInAdvance: "F",
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
  const res = await fetch(
    "https://online.ctrip.com/restapi/soa2/15638/saveResource?_fxpcqlniredt=09031111115146167449&_fxpcqlniredt=09031111115146167449",
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
        "https://vbooking.ctrip.com/ivbk/vendor/serviceInfoMerge?from=vbk",
      referrerPolicy: "no-referrer-when-downgrade",
      body: JSON.stringify(data),
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  return await res.json();
}
// 使用这个函数：
async function SaveResourceStoragePriceInfo(resourceId, price, resourcePrices) {
  const data = {
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
    resourcePrices: resourcePrices.map((date) => {
      return { date, active: true, marketPrice: price, cost: price };
    }),
    // [
    //   { date: "2024-03-19", active: true, marketPrice: 300, cost: 300 },
    // ],
    resourceChildPrices: [],
    resourceStorages: [],
    relatedSingleRoomPrices: [],
  };
  const res = await fetch(
    "https://online.ctrip.com/restapi/soa2/15638/SaveResourceStoragePriceInfo.json?_fxpcqlniredt=09031111115146167449&_fxpcqlniredt=09031111115146167449",
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
      // referrer:
      //   "https://vbooking.ctrip.com/ivbk/vendor/additionalservicedetail?type=new&tabkey=2&resourceid=42369553&from=vbk",
      referrerPolicy: "no-referrer-when-downgrade",
      body: JSON.stringify(data),
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  return await res.json();
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
main()