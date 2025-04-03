const request = require("request");

async function main() {
  var options = {
    method: "POST",
    url: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=24.54582acfce477bcfe3d2c90d88ea51ab.2592000.1709530797.282335-49103956",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      system:
        "你是一个旅游管家，你只需要优化文案，文案的长度只能小于等于提供的长度",
      // system: "你是一个旅游管家，你知道旅游相关的所有信息，请简单干练的回答问题不要有额外的回答；询问门票只回答数字，不需要单位元。如天空寺门票多少钱？你只需回答：80",
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            title: "上海迪士尼度假区2日1晚自由行",
            subTitle:
              "『快乐迪士尼 假期嗨翻天』指定入住智微国际品牌酒店 高性价比【畅享迪士尼7大园区+烟花秀】【第二天迪士尼】",
          }),
        },
      ],
      disable_search: false,
      enable_citation: false,
    }),
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}

main();
