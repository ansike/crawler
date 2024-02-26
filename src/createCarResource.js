// 通过当前的脚本在浏览器的控制台中批量创建资源
const cars = [];
for (let i = 40200; i <= 64800; i += 100) {
// for (let i = 400; i <= 400; i += 100) {
  cars.push(i);
}

// 1. 修改用车ID
// 2. 修改用车名字
// 3. 修改用车最大人数

const carType = {
  comfort_5: {
    carIds: "4729",
    carName: "舒适5座：丰田bZ4X",
    maxPersonQuantity: 3,
  },
  7: {
    carIds: "4594",
    carName: "商务7座：丰田塞纳",
    maxPersonQuantity: 5,
  },
  9: {
    carIds: "7274, 4378, 4343",
    carName: "商务9座：现代韩版 斯塔利亚/现代Grand Starex 11 Seater 等同级车",
    maxPersonQuantity: 7,
  },
  12: {
    carIds: "4199, 4208, 4268",
    carName: "12座中巴：丰田海狮12座/丰田考斯特12座 等同级车",
    maxPersonQuantity: 10,
  },
  14: {
    carIds: "2678, 4243, 4310",
    carName: "14座中巴：金杯大海狮/奔驰凌特14座 等同级车",
    maxPersonQuantity: 12,
  },
  19: {
    carIds: "4246, 4307, 4212, 4272, 4293",
    carName: "19座中巴：奔驰凌特19座/江铃考斯特19座 等同级车",
    maxPersonQuantity: 15,
  },
};

(async () => {
  const { carIds, carName, maxPersonQuantity } = carType["19"];
  for (let i = 0; i < cars.length; i++) {
    const price = cars[i];
    // console.log("start to create resource", label, price);
    const resourceRes = await fetch(
      "https://online.ctrip.com/restapi/soa2/15638/saveResource?_fxpcqlniredt=09031111115146167449&_fxpcqlniredt=09031111115146167449",
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
        referrer:
          "https://vbooking.ctrip.com/ivbk/vendor/serviceInfoMerge?from=vbk",
        referrerPolicy: "no-referrer-when-downgrade",
        body: `{"contentType":"json","head":{"cid":"09031111115146167449","ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","extension":[]},"resourceInfo":{"baseInfo":{"piCategoryId":1132,"isVisaOnTheirOwn":"F","isHotelResource":"F","inputLocale":"zh-CN","description":"${price}","chargeUnit":"辆","trainInfo":{"trainType":1},"carInfo":{"useCarMode":1,"carMode":1},"ticketType":0,"peopleGroup":1,"canCashBack":"F","isHighRisk":"F","isHotelShareRoom":"F","receiveAndSend":{"isNeed":"F","selectedReceiveAndSend":[]},"isChildAsAdult":"F","maxAdultNum":1,"maxChildNum":1,"isVisaAssignInAdvance":"F","isAutoVisa":"F","isAutoGetVisa":"F","destinationCity":{"cityId":41,"name":"拉萨","eName":"Lhasa","countryId":1,"countryName":"中国","provinceId":30,"provinceName":"西藏","cityCode":"LXA","key":41,"value":"拉萨/西藏/中国"},"resourceId":null,"categoryId":2,"businessType":"OPT","name":"${carName}"},"bookingControllerInfo":{"vendorConfirmModeID":2,"workTemplateId":1,"vendorBookingContactId":642097,"vendorConfirmHours":0,"isChooseRequired":"T","isDefaultChoose":"T","chooseMode":"O","isChooseDate":"F","canFirstDayBooking":"T","canLastDayBooking":"T","isAutoMatch":"F","active":"T","isShow":"T","isSmsNotice":"F","isSmsVBKNoticeType":1,"forAdult":"T","forAdultQuantity":1,"forAdultProductQuantity":1,"forChild":"T","forChildQuantity":1,"forChildProductQuantity":1,"advanceBookingDays":1,"advanceBookingTime":"12:00","bookingTimeZoneId":21,"minPersonQuantity":1,"maxPersonQuantity":${maxPersonQuantity},"minTravelDays":1,"maxTravelDays":999,"maxQuantity":1,"minQuantity":1,"visaAdvanceBookingDayTime":{"visaStuffMakeTime":0,"visaWaitTime":0,"visaWorkday":0,"visaDeliverDay":0,"visaOrderAndStuff":0,"visaConfirmDay":0,"visaAdvanceBookingTime":"12:00","bookingTimeZoneId":21},"providerERAId":null,"contact":"安思科","vendorBookingEmail":"ansike@qq.com","vendorBookingContactPhoneAreaCode":"+86","vendorBookingPhone":"15910250965","fullVendorBookingPhone":"+86 15910250965","piCustomerInfoTemplateId":29312799},"vendorRelatedInfo":{"bookingMode":"S","forModifyOrder":"F","canModify":"T","exchangeMode":1,"isProviderDistribution":"F","isNeedReceipt":"T","receiptDay":2,"receiptTime":"12:00","receiptContent":"等待地点，司机电话，司机姓名，供应商紧急联系人，供应商紧急电话","pMEID":"PTZC","pAEID":"PTZC","regionId":32,"isClientAssign":"F","productDistributionChannelList":["bestone","bestoneb2b","youtripshop","ctripshop","online","ctrip","trip","tripsystem"]},"carIds":[${carIds}]},"customerInfoTemplateOpen":"T"}`,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    const data = await resourceRes.json();
    await savePrice(data.resourceId, price);
    console.log("save resource", price, data.resourceId);
    // await savePrice(41654939, price);
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
async function savePrice(resourceId, cost) {
  let dateArr = getDatesBetween(new Date("2024/02/26"), new Date("2030/03/31"));
  const marketPrice = Math.ceil(cost * 1.087083333333);
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
    vendorId: "1431565",
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
      referrer:
        "https://vbooking.ctrip.com/ivbk/vendor/additionalservicedetail?type=new&tabkey=2&resourceid=41646573&from=vbk",
      referrerPolicy: "no-referrer-when-downgrade",
      body: JSON.stringify(body),
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  //   console.log("save price", res);
}
