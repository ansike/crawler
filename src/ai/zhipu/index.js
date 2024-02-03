var jwt = require("jsonwebtoken");
const request = require("request");

const apiKey = "2f186fbc05dd789c09cc255e6af32cca.JkSWAyivLRJi1605";

function generateToken() {
  let id, secret;
  try {
    [id, secret] = apiKey;
  } catch (error) {
    console.log(error);
    return;
  }
  const now = new Date().getTime();
  const token = jwt.sign(
    {
      api_key: id,
      exp: now + 24 * 60 * 60 * 1000,
      timestamp: now,
    },
    secret,
    {
      algorithm: "HS256",
      header: {
        alg: "HS256",
        typ: "SIGN",
      },
    }
  );
  return token;
}

function main(str) {
  const token = generateToken();
  console.log("token", token);
  const options = {
    method: "POST",
    url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model: "glm-4",
      system:
        "你是一个旅游管家，你只需要优化文案，文案的长度只能小于等于提供的长度",
      messages: [
        {
          role: "system",
          content:
            "你是一个旅游行程规划大师，主要帮忙修改文案，修改后的文案字符数不能比原来的多。仅给出答案即可无关信息不要输出",
        },
        { role: "user", content: str },
      ],
    }),
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}

main(
  "『快乐迪士尼 假期嗨翻天』指定入住智微国际品牌酒店 高性价比【畅享迪士尼7大园区+烟花秀】【第二天迪士尼】"
);
