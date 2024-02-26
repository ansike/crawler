const carRate = [
  {
    label: "5座经济",
    value: 1.2,
  },
  {
    label: "5座舒适",
    value: 1.35,
  },
  {
    label: "7座",
    value: 2.6,
  },
  {
    label: "9座",
    value: 3.3,
  },
  {
    label: "12座",
    value: 4.2,
  },
  {
    label: "14座",
    value: 4.5,
  },
  {
    label: "19座",
    value: 5.5,
  },
];

const rate5 = 1.2;
for (let i = 100; i <= 200; i += 50) {
  const basePrice = i / rate5;
  const prices = carRate.map((car) => {
    let price = Math.ceil(parseInt(car.value * basePrice));
    // 确保价格是50的倍数
    price = Math.ceil(price / 50) * 50;
    return `${car.label}${price}`;
  });
  const priceStr = prices.join("+");
  console.log(`${priceStr}`);
}

function addCarIntoGroup() {
  const resourceGroupId = "";
  const resourceIds = "";
  fetch(
    "https://online.ctrip.com/restapi/soa2/15638/AddResourcesIntoCarGroup?_fxpcqlniredt=09031111115146167449&_fxpcqlniredt=09031111115146167449",
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
      referrer: `https://vbooking.ctrip.com/product/input/resourceGroupDetail?from=vbk&resourceGroupId=${resourceGroupId}`,
      referrerPolicy: "no-referrer-when-downgrade",
      body: `{"contentType":"json","head":{"cid":"09031111115146167449","ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","extension":[]},"resourceGroupId":"${resourceGroupId}","resourceIds":[${resourceIds}]}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
}

function updateResourceGroup() {
  const resourceGroupId = "";
  const resourceGroupName = "";
  fetch(
    "https://online.ctrip.com/restapi/soa2/15638/updateResourceGroup?_fxpcqlniredt=09031111115146167449&_fxpcqlniredt=09031111115146167449",
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
      referrer: `https://vbooking.ctrip.com/product/input/resourceGroupDetail?from=vbk&resourceGroupId=${resourceGroupId}`,
      referrerPolicy: "no-referrer-when-downgrade",
      body: `{"contentType":"json","head":{"cid":"09031111115146167449","ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","extension":[]},"resourceGroupDto":{"resourceGroupId":"${resourceGroupId}","resourceGroupName":"5座经济100+7座250+9座300+12座350+14座400+19座500","active":"T","mandatory":"T"}}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
}
