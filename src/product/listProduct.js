  const name = "安思科";
  (async () => {
    const data = await listProduct(name);
    let parentProducts = [];
    const map = new Map();
    data.resourceInfoList.forEach((info) => {
      if (info.isChild) {
        if (map.has(info.parentId)) {
          const temp = map.get(info.parentId);
          map.set(info.parentId, [
            ...temp,
            {
              parentId: info.parentId,
              productId: info.productId,
              productName: info.productName,
              createTime: info.createTime,
            },
          ]);
        } else {
          map.set(info.parentId, [
            {
              parentId: info.parentId,
              productId: info.productId,
              productName: info.productName,
              createTime: info.createTime,
            },
          ]);
        }
      } else {
        parentProducts.push({
          productId: info.productId,
          productName: info.productName,
          createTime: info.createTime,
        });
      }
    });

    parentProducts = parentProducts.map((pro) => {
      return {
        ...pro,
        child: (map.get(pro.productId)||[]).map(p=>p.productId),
      };
    });

    console.log(parentProducts);

    // parentProducts.forEach((pro,i)=>{
    //   console.log(pro.productName)
    //   // console.log(pro.productName, pro.productId, pro.child.join(','), pro.createTime.split(" ")[0])
    // })
    console.log(parentProducts.filter(pro=>!pro.child?.length));
  })();
  async function listProduct(name) {
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
      categoryIds: [9, 10, 11, 26],
      productPatternList: [1, 3, 4, 2],
      preSaleFilterStatus: [],
      active: "T",
      hasSchedule: "T",
      piCategoryIdLvl1: [],
      logicDelete: "F",
      providerProductName: name,
      onlyIdCondition: false,
      onlyParentChild: false,
      onlyTourPackage: false,
      pageIndex: 1,
      pageSize: 200,
      forCruise: false,
      orderBy: "",
      asc: true,
    };

    const res = await fetch(
      "https://online.ctrip.com/restapi/soa2/15638/getResourceInfoList.json?_fxpcqlniredt=09031111115146167449&_fxpcqlniredt=09031111115146167449",
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
          "https://vbooking.ctrip.com/product/input/productListMerge?from=vbk&typeid=9,10,11,26&pattern=1,3,4",
        referrerPolicy: "no-referrer-when-downgrade",
        body: JSON.stringify(data),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    return await res.json();
  }
