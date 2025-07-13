// 通过当前的脚本在浏览器的控制台中批量创建资源

// 携程价格的比率
const priceRate = 1.087083333333;
const vendorId = "1279416";
const vendorBookingContactId = 1368298;
const cars = [];
for (let i = 100; i <= 70000; i += 50) {
  // for (let i = 400; i <= 400; i += 100) {
  cars.push(i);
}

// 1. 修改用车ID
// 2. 修改用车名字
// 3. 修改用车最大人数

const carType = {
  normal_5: {
    carIds: [2060, 6947, 2754],
    carName: "经济5座：丰田卡罗拉/长安汽车锐程PLUS 等同级车",
    maxPersonQuantity: 3,
  },
  comfort_5: {
    carIds: [2050, 2066, 2251],
    carName: "舒适5座：丰田凯美瑞/丰田亚洲龙 等同级车",
    maxPersonQuantity: 3,
  },
  7: {
    carIds: [2077, 2076, 4718],
    carName: "商务7座：丰田塞纳/丰田普瑞维亚 等同级车",
    maxPersonQuantity: 5,
  },
  9: {
    carIds: [4196, 4206, 2623],
    carName: "9座小巴：丰田海狮9座/丰田考斯特9座 等同级车",
    maxPersonQuantity: 7,
  },
  12: {
    carIds: [4199, 4208, 4289],
    carName: "12座中巴：丰田海狮12座/丰田考斯特12座 等同级车",
    maxPersonQuantity: 10,
  },
  14: {
    carIds: [8352, 7127, 8891],
    carName: "14座中巴：亚星14座/亚星欧睿 等同级车",
    maxPersonQuantity: 12,
  },
  19: {
    carIds: [8359, 4255, 4293],
    carName: "19座中巴：亚星19座/宇通19座 等同级车",
    maxPersonQuantity: 15,
  },
};

(async () => {
  const {
    carIds,
    carName,
    maxPersonQuantity
  } = carType["19"];
  for (let i = 0; i < cars.length; i++) {
    const price = cars[i];


    const resourceId = await saveResource({
      price,
      carName,
      maxPersonQuantity,
      carIds,
    });
    console.log("save resource", price, resourceId);
    if (resourceId) {
      await savePrice(resourceId, price);
    }
  }
})();

function getDatesBetween(start, end) {
  for (
    var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(dt.toISOString().slice(0, 10));
  }
  return arr;
}

async function saveResource({ price, carName, maxPersonQuantity, carIds }) {
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
    "resourceInfo": {
      "baseInfo": {
        "piCategoryId": 1132,
        "isVisaOnTheirOwn": "F",
        "isHotelResource": "F",
        "inputLocale": "zh-CN",
        "description": `${price}`,
        "chargeUnit": "辆",
        "trainInfo": {
          "trainType": 1
        },
        "carInfo": {
          "useCarMode": 1,
          "carMode": 1
        },
        "ticketType": 0,
        "peopleGroup": 1,
        "canCashBack": "F",
        "isHighRisk": "F",
        "receiveAndSend": {
          "isNeed": "F",
          "selectedReceiveAndSend": []
        },
        "isChildAsAdult": "F",
        "maxAdultNum": 1,
        "maxChildNum": 1,
        "isVisaAssignInAdvance": "F",
        "isAutoVisa": "F",
        "isAutoGetVisa": "F",
        "destinationCity": {
          "cityId": 41,
          "name": "拉萨",
          "eName": "Lhasa",
          "countryId": 1,
          "countryName": "中国",
          "provinceId": 30,
          "provinceName": "西藏",
          "cityCode": "LXA",
          "key": 41,
          "value": "拉萨/西藏/中国"
        },
        "resourceId": null,
        "categoryId": 2,
        "businessType": "OPT",
        "name": carName,
        "forProductCategory": [
          9,
          10
        ],
        "forProductPattern": [
          2,
          4
        ],
        "forSaleMode": [
          "P"
        ]
      },
      "bookingControllerInfo": {
        "vendorBookingSeneschalContactId": 0,
        "vendorBookingSeneschalContact": "",
        "vendorBookingSeneschalPhone": "",
        "vendorBookingSeneschalPhoneAreaCode": "",
        "vendorBookingSeneschalEmail": "",
        "vendorConfirmModeID": 2,
        "workTemplateId": 1,
        "vendorBookingContactId": vendorBookingContactId,
        "vendorConfirmHours": 0,
        "isChooseRequired": "T",
        "isDefaultChoose": "T",
        "chooseMode": "O",
        "isChooseDate": "F",
        "canFirstDayBooking": "T",
        "canLastDayBooking": "T",
        "isAutoMatch": "F",
        "active": "T",
        "isShow": "T",
        "isSmsNotice": "F",
        "isSmsVBKNoticeType": 1,
        "forAdult": "T",
        "forAdultQuantity": 1,
        "forAdultProductQuantity": 1,
        "forChild": "T",
        "forChildQuantity": 1,
        "forChildProductQuantity": 1,
        "advanceBookingDays": 1,
        "advanceBookingTime": "20:00",
        "bookingTimeZoneId": 21,
        "minPersonQuantity": 1,
        "maxPersonQuantity": maxPersonQuantity,
        "minTravelDays": 1,
        "maxTravelDays": 999,
        "maxQuantity": 1,
        "minQuantity": 1,
        "visaAdvanceBookingDayTime": {
          "visaStuffMakeTime": 0,
          "visaWaitTime": 0,
          "visaWorkday": 0,
          "visaDeliverDay": 0,
          "visaOrderAndStuff": 0,
          "visaConfirmDay": 0,
          "visaAdvanceBookingTime": "12:00",
          "bookingTimeZoneId": 21
        },
        "providerERAId": null,
        "unBookingInfo": {
          "unBookingRule": 4
        },
        "contact": "安思科",
        "vendorBookingEmail": "ansike@qq.com",
        "vendorBookingContactPhoneAreaCode": "+86",
        "vendorBookingPhone": "15910250965",
        "fullVendorBookingPhone": "+86 15910250965",
        "piCustomerInfoTemplateId": 61012746
      },
      "vendorRelatedInfo": {
        "bookingMode": "S",
        "forModifyOrder": "F",
        "canModify": "T",
        "exchangeMode": 1,
        "isProviderDistribution": "F",
        "isNeedReceipt": "T",
        "receiptDay": 2,
        "receiptTime": "12:00",
        "receiptContent": "等待地点，司机电话，司机姓名，供应商紧急联系人，供应商紧急电话",
        "pMEID": "PTZC",
        "pAEID": "PTZC",
        "regionId": 32,
        "isClientAssign": "F",
        "productDistributionChannelList": [
          "bestone",
          "bestoneb2b",
          "youtripshop",
          "ctripshop",
          "online",
          "ctrip",
          "trip",
          "tripsystem"
        ]
      },
      "carIds": carIds
    },
    "customerInfoTemplateOpen": "T"
  }

  const resourceRes = await fetch(
    "https://online.ctrip.com/restapi/soa2/15638/saveResource?_fxpcqlniredt=09031111115146167449&_fxpcqlniredt=09031111115146167449", {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/json",
        cookieorigin: "https://vbooking.ctrip.com",
        "sec-ch-ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
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
  const data = await resourceRes.json();
  return data.resourceId;
}
// 使用这个函数：
async function savePrice(resourceId, cost) {
  let dateArr = getDatesBetween(new Date("2025/07/12"), new Date("2030/07/12"));
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
    "https://online.ctrip.com/restapi/soa2/15638/SaveResourceStoragePriceInfo.json?_fxpcqlniredt=09031111115146167449&_fxpcqlniredt=09031111115146167449", {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/json",
        cookieorigin: "https://vbooking.ctrip.com",
        "sec-ch-ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
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