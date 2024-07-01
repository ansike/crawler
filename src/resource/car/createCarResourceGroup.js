// 通过当前脚本创建用车资源组
const { normal5 } = require("./config/car-normal5");
const { comfort5 } = require("./config/car-comfort5");
const { car7 } = require("./config/car-7");
const { car9 } = require("./config/car-9");
const { car12 } = require("./config/car-12");
const { car14 } = require("./config/car-14");
const { car19 } = require("./config/car-19");

// 5-25000
// 5 comfort-29200
// 7-54200
// 9-68750
// 12-70000
// 14-70000
// 19-70000

// 车型  价格  2人  3人   4人  5人  6人
// 5     120  60   40
// 5     140  70   47

// 7     260            65  52   43
// 7     240            60  50   40vc

// 9
// 9

// TODO 1. 调整车型人数
// TODO 2. 7座及以上比率降低0.1

/**
 * 5座经济 1-3人
 * 5座舒适 1-4人
 * 7座 1-6人
 * 9座 1-8人
 * 12座 1-11人
 * 14座 1-14人
 * 19座 1-18人
 */


const carRate = [
  {
    label: "5座经济", 
    value: 1.2,
    carConf: normal5,
  },
  {
    label: "5座舒适",  
    value: 1.4,  
    carConf: comfort5,
  },
  {
    label: "7座", 
    value: 2.6,  
    carConf: car7,
  },
  {
    label: "9座",
    value: 3.3,
    carConf: car9,
  },
  {
    label: "12座",
    value: 4.2,
    carConf: car12,
  },
  {
    label: "14座",
    value: 4.5,
    carConf: car14,
  },
  {
    label: "19座",
    value: 5.5,
    carConf: car19,
  },
];

const maxMoney = 70000;
// 超过7w之后对应的资源不出现在用车资源组中
const limitCar7w = carRate.slice(-3).map((it) => it.label);

// 用车组规则：
// 1. 5座经济最大价格为25000，最小价格为100
// 2. 按照 carRate 中的比例基于5座推导7、9、12、14、19等的用车价格，基于价格筛选用车ID
// 3. 最大用车价格为70,000，超过这个价格不再挂用车资源，该规则适用于12、14、19座车

main();

async function main() {
  const rate5 = 1.2;
  for (let i = 1050; i <= 1050; i += 50) {
    const basePrice = i / rate5;
    const resourceIds = [];
    const prices = carRate
      .map((car) => {
        const { label, value, carConf } = car;
        let price = Math.ceil(parseInt(value * basePrice));
        // 确保价格是50的倍数
        price = Math.ceil(price / 50) * 50;
        // 价格超过最大限制，且在数组内跳过
        if (price > maxMoney && limitCar7w.includes(label)) {
          return;
        }
        // 没有找到当前车辆的ID
        const id = carConf[price];
        if (!id) {
          console.log(car, price);
          return;
        }
        // console.log(`${label} ${price} ${id}`);
        resourceIds.push(id);
        return `${label}${price}`;
      })
      .filter((it) => !!it);

    if (prices.length < 4) {
      return;
    }
    const resourceGroupName = prices.join("+");
    // console.log(`${resourceGroupName}`, resourceIds);
    const resourceGroupId = await createResourceGroup(resourceGroupName);
    // console.log({ resourceGroupId });
    await addCarIntoGroup(resourceGroupId, resourceIds);
    await updateResourceGroup(resourceGroupId, resourceGroupName);
    console.log(`${resourceGroupId} ${resourceGroupName}`);
  }
}

async function createResourceGroup(resourceGroupName) {
  const groupRes = await fetch(
    "https://online.ctrip.com/restapi/soa2/15638/createResourceGroup?_fxpcqlniredt=09031111115146167449&_fxpcqlniredt=09031111115146167449",
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
        "https://vbooking.ctrip.com/product/input/resourceGroup?from=vbk",
      referrerPolicy: "no-referrer-when-downgrade",
      body: `{\"contentType\":\"json\",\"head\":{\"cid\":\"09031111115146167449\",\"ctok\":\"\",\"cver\":\"1.0\",\"lang\":\"01\",\"sid\":\"8888\",\"syscode\":\"09\",\"auth\":\"\",\"extension\":[]},\"resourceGroupDto\":{\"resourceGroupName\":\"${resourceGroupName}\",\"resourcePICategoryId\":1132,\"mandatory\":\"T\"}}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  const data = await groupRes.json();
  // console.log(data.resourceGroupId);
  return data.resourceGroupId;
}

async function addCarIntoGroup(resourceGroupId, resourceIds) {
  // console.log(resourceGroupId, resourceIds);
  const addRes = await fetch(
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
      body: `{"contentType":"json","head":{"cid":"09031111115146167449","ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","extension":[]},"resourceGroupId":"${resourceGroupId}","resourceIds":[${resourceIds.join(
        ","
      )}]}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  const data = await addRes.json();
  // console.log("addCarIntoGroup", data);
}

async function updateResourceGroup(resourcegroupid, resourceGroupName) {
  await fetch(
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
      referrer: `https://vbooking.ctrip.com/product/input/resourceGroupDetail?from=vbk&resourcegroupid=${resourcegroupid}`,
      referrerPolicy: "no-referrer-when-downgrade",
      body: `{"contentType":"json","head":{"cid":"09031111115146167449","ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","extension":[]},"resourceGroupDto":{"resourceGroupId":"${resourcegroupid}","resourceGroupName":"${resourceGroupName}","active":"T","mandatory":"T"}}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
}
