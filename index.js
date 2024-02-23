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
const { spawn } = require("child_process");

const listFile = path.resolve(outputDir, "list.json");
const url =
  "https://vacations.ctrip.com/list/personalgroup/sc1.html?p=6&s=2&st=%E6%9E%97%E8%8A%9D&startcity=1&sv=%E6%9E%97%E8%8A%9D";

(async () => {
  // 创建一个浏览器对象
  // const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch();

  const allPageProducts = await getDataByUrl(browser, url, "花");

  // // 获取所有产品的信息数据
  await writeJson(JSON.stringify(allPageProducts), listFile);

  const queue2 = new TaskQueue(5);
  for (let i = 0; i < allPageProducts.length; i++) {
    const list = allPageProducts[i];
    const newProducts = (
      await Promise.all(
        // list.slice(0, 1).map(getProductInfo)
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
    const productFile = path.resolve(outputDir, `product-${i + 1}.json`);
    await writeJson(JSON.stringify(newProducts), productFile);
  }

  // 最后关闭浏览器（如果不关闭，node程序也不会结束的）
  await browser.close();

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
