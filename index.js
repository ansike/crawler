const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const {
  getDataByUrl,
  writeJson,
  getProductInfo,
  sortFileName,
} = require("./src/util");
const { generateExcel } = require("./src/generateExcel");
const { TaskQueue } = require("./src/TaskQueue");
const { outputDir, zhipuPy } = require("./src/config");
const promiseReaddir = promisify(fs.readdir);
const promiseMkdir = promisify(fs.mkdir);
const promiseReadFile = promisify(fs.readFile);
const promiseExists = promisify(fs.exists);
const { spawn } = require("child_process");

const url =
  "https://vacations.ctrip.com/list/personalgroup/sc1.html?p=6&s=2&st=%E6%9E%97%E8%8A%9D&startcity=1&sv=%E6%9E%97%E8%8A%9D";

const region = "lingzhi";
const groupSize = 20;
(async () => {
  const productDir = path.resolve(outputDir, `${region}`);
  const isExist = await promiseExists(productDir);
  if (!isExist) {
    await promiseMkdir(productDir);
  }
  const listFile = path.resolve(productDir, "list.json");
  // 创建一个浏览器对象
  // const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch();

  // ----------------------- 1. 获取产品列表 --------------------------
  // {
  //   const allPageProducts = await getDataByUrl(browser, url, (pro) => {
  //     return pro.tags.find((tag) => tag.includes("花")) && !!pro.sellNum;
  //   });

  //   const flatList = allPageProducts.flat(1);
  //   console.log("flatList", flatList.length);
  //   const resGroupProducts = [];
  //   for (let i = 0; i < flatList.length; i += groupSize) {
  //     resGroupProducts.push(flatList.slice(i, i + groupSize));
  //   }

  //   // 获取所有产品的信息数据
  //   await writeJson(JSON.stringify(resGroupProducts), listFile);
  // }
  // ----------------------- 2. 获取产品详情 --------------------------
  const groupProductStr = await promiseReadFile(listFile, {
    encoding: "utf-8",
  });

  const groupProducts = JSON.parse(groupProductStr);
  const queue2 = new TaskQueue(5);
  for (let i = 0; i < groupProducts.length; i++) {
    const list = groupProducts[i];
    const newProducts = (
      await Promise.all(
        list.map(
          (pro) =>
            new Promise((resolve) =>
              queue2.add(
                async () => await getProductInfo(browser, pro, resolve)
              )
            )
        )
      )
    ).filter((pro) => pro);
    const productFile = path.resolve(productDir, `product-${i + 1}.json`);
    await writeJson(JSON.stringify(newProducts), productFile);
  }

  // 最后关闭浏览器（如果不关闭，node程序也不会结束的）
  await browser.close();

  // ----------------------- 3. AI 清洗数据 --------------------------

  // await filterProductByAI()
  // const files = await promiseReaddir(outputDir);
  // const productFiles = files.filter((file) => file.includes("products"));
  // const sortProductFiles = productFiles.sort(sortFileName);
  // console.log(sortProductFiles);

  // const sourceFile = path.resolve(outputDir, "product-1.json");
  // const outputFile = path.resolve(outputDir, "format-product-1.json");
  // // 执行Python脚本并传递参数
  // const pythonProcess = spawn("python3", [zhipuPy, sourceFile, outputFile],{
  //   stdio: "inherit",
  //   env: { ...process.env }, // 要确保子进程继承父进程的环境变量
  //   encoding: "utf-8", // 指定编码为UTF-8
  // });
  // // const pythonProcess = spawn(
  // //   "python3.12.exe",
  // //   [zhipuPy, sourceFile, outputFile],
  // //   {
  // //     env: { ...process.env }, // 要确保子进程继承父进程的环境变量
  // //     encoding: "utf-8", // 指定编码为UTF-8
  // //   }
  // // );

  // // 监听Python脚本的退出事件
  // pythonProcess.on("close", (code) => {
  //   console.log(`Python脚本退出，退出码：${code}`);
  // });
})();
