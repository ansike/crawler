const OpenAI = require("openai");

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "你是一个旅游大师，能帮我核算行程门票价格，只需回答数字即可" },

      {
        role: "user",
        content:
          `怎么给你增加互联网访问能力`,
      },
      // {
      //   role: "user",
      //   content:
      //     `【重庆】抵达重庆-酒店-自由活动【赠送长江索道+两江夜游船票+专车接机/站】
      //     【重庆】自然醒+解放碑+李子坝轻轨穿楼+鹅岭二厂+渣滓洞+白公馆+八一好吃街【专车】
      //     【重庆】武隆天生三桥+龙水峡地缝【专车】
      //     【重庆】自由活动-返程【专车送机/站】`,
      // },
    ],
    model: "gpt-4-0125-preview",
  });

  console.log(completion.choices[0]);
}

main();
