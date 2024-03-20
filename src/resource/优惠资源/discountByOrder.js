// 通过当前的脚本在浏览器的控制台中批量创建优惠资源200-2000

(async () => {
  for (let i = 200; i <= 200; i += 100) {
    const tour = await createDiscount(i);
    const dateArr = getDatesBetween(
      new Date("2024/02/26"),
      new Date("2030/03/31")
    );
    await SaveResourceStoragePriceInfo(tour.resourceId, -i, dateArr);
  }
})();

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
async function createDiscount(price) {
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
        piCategoryId: 1174,
        // resourceId: 42107791,
        name: `整单优惠${price}`,
        categoryId: 18,
        categoryName: "优惠",
        inputLocale: "zh-CN",
        subName: "",
        description: `-${price}`,
        chargeUnit: "单",
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
        carInfo: { carMode: 1, useCarMode: 1 },
        trainInfo: { trainType: 1, productTrainID: 3239797 },
        ticketType: 0,
        peopleGroup: 1,
        poiScenicSpot: {},
        isHighRisk: "F",
        isHotelResource: "F",
        isHotelShareRoom: "F",
        receiveAndSend: { isNeed: "F", selectedReceiveAndSend: [] },
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
        vendorBookingContactId: 642097,
        vendorBookingEmergencyContactId: 501507,
        vendorComplainContactId: 501507,
        isChooseRequired: "F",
        isDefaultChoose: "T",
        quantityCalculateMode: "P",
        minQuantity: 1,
        maxQuantity: 1,
        chooseMode: "O",
        forAdult: "T",
        forAdultQuantity: 1,
        forAdultProductQuantity: 1,
        forChild: "T",
        forChildQuantity: 1,
        forChildProductQuantity: 1,
        minPersonQuantity: 1,
        maxPersonQuantity: 9999,
        minTravelDays: 1,
        maxTravelDays: 999,
        advanceBookingDays: 1,
        advanceBookingTime: "23:59",
        visaAdvanceBookingDayTime: {
          visaStuffMakeTime: 0,
          visaWaitTime: 0,
          visaWorkday: 0,
          visaDeliverDay: 0,
          visaOrderAndStuff: 0,
          visaConfirmDay: 0,
          visaAdvanceBookingTime: "23:59",
          bookingTimeZoneId: 21,
        },
        isWeekendWork: "F",
        isHolidayWork: "F",
        workTemplateId: 1,
        vendorConfirmModeID: 2,
        vendorConfirmHours: 0,
        contact: "安思科",
        vendorBookingPhone: "15910250965",
        msgVenderToConfirmFax: "F",
        vendorBookingContactPhoneAreaCode: "86",
        isChooseDate: "F",
        departureDays: [1, 2, 3, 4, 5, 6, 7],
        canFirstDayBooking: "T",
        canLastDayBooking: "T",
        isAutoMatch: "F",
        dPSuitPattern: [1, 2, 4],
        active: "T",
        isShow: "T",
        customerInfoTemplateID: 0,
        needCertificate: "F",
        isSmsNotice: "F",
        smsInfo: "",
        bookingTimeZoneId: 21,
        isSmsVBKNotice: "F",
        isDefinedPhone: "F",
        isSmsVBKNoticeType: 1,
        fillInNumberLimit: "A",
        piCustomerInfoTemplateId: 29718325,
        unBookingInfo: {},
        vendorBookingEmergencyPhoneAreaCode: "86",
        vendorBookingEmergencyContact: "李鑫",
        vendorBookingEmergencyPhone: "17740792695",
        vendorComplainContact: "李鑫",
        vendorComplainPhoneAreaCode: "86",
        vendorComplainPhone: "17740792695",
        vendorComplainEMail: "1065035216@qq.com",
        vendorBookingEmail: "ansike@qq.com",
        fullVendorBookingPhone: "+86 15910250965",
        fullVendorBookingEmergencyPhone: "+86 17740792695",
        fullVendorComplainPhone: "+86 17740792695",
        providerERAId: null,
      },
      vendorRelatedInfo: {
        bookingMode: "S",
        forModifyOrder: "F",
        canModify: "T",
        exchangeMode: 1,
        isProviderDistribution: "F",
        operationNote: "",
        vendorId: 1431565,
        vendorName: "西藏北纬三十度旅行社有限责任公司",
        isNeedReceipt: "F",
        receiptDay: 0,
        receiptTime: "",
        receiptContent: "",
        pMEID: "PTZC",
        pAEID: "PTZC",
        pBMEI: "",
        regionId: 32,
        regionName: "代理-运营支持",
        isClientAssign: "F",
        productDistributionChannelList: [
          "bestone",
          "bestoneb2b",
          "youtripshop",
          "ctripshop",
          "ctrip",
          "trip",
          "tripsystem",
        ],
        deliveryType: 0,
        deliveryGoodsDescription: "",
      },
    },
    customerInfoTemplateOpen: "T",
  };
  const res = await fetch("https://online.ctrip.com/restapi/soa2/15638/saveResource?_fxpcqlniredt=09031111115146167449&_fxpcqlniredt=09031111115146167449", {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "cookieorigin": "https://vbooking.ctrip.com",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-ctx-locale": "zh-CN"
    },
    // "referrer": "https://vbooking.ctrip.com/ivbk/vendor/serviceInfoMerge?resourceid=42107791&from=vbk",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": JSON.stringify(data),
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });
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
    vendorId: "1431565",
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
