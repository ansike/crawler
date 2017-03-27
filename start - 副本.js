// var request = require("request");
// var iconv = require('iconv-lite');
// request('http://www.yznn.com/modules/article/reader.php?aid=39&cid=9171759',function(err,r){
//     if(err){
//         console.log(err);
//     }
//     // var body = iconv.decode(result.body, 'gbk');
//     r = iconv.decode(r, 'GBK');
//     console.log(r.body);
//     var $ = cheerio.load(r.body);
//     // console.log($("body").find("div[class=zjlist4] ol li a").attr("href").trim());

//     // // $('div[class="zjlist4"]').each(function (index,element) {
//     // // 	console.log($(element).find("a").attr("href").trim());
//     // // 	request($(element).find("a").attr("href").trim(),function (err,res) {
//     // // 		console.log(res.body);
//     // // 	})
//     // // })
//     // request($("body").find("div[class=zjlist4] ol li a").attr("href").trim(),function (err,res) {
//     // 	var body2 = iconv.decode(res.body, 'gb2312');
//     // 		var b=cheerio.load(body2);
//     // 		console.log(b("#htmlContent").text().trim());
//     // 	})
// })
var cheerio = require("cheerio");
var fs = require('fs');
var http = require("http");
var iconv = require('iconv-lite');
var async = require('async');
var url = 'http://www.xxbiquge.com/1_1413/';
getBook(url);
var arr = [];

function getBook(url) {
    http.get(url, function(res) {
        var arrBuf = [];
        var bufLength = 0;
        res.on("data", function(chunk) {
                arrBuf.push(chunk);
                bufLength += chunk.length;
            })
            .on("end", function() {
                // arrBuf是个存byte数据块的数组，byte数据块可以转为字符串，数组可不行
                // bufferhelper也就是替你计算了bufLength而已 
                var chunkAll = Buffer.concat(arrBuf, bufLength);
                var strJson = iconv.decode(chunkAll, 'gb2312'); // 汉字不乱码
                var $ = cheerio.load(strJson);
                var i = 0;
                if ($("#list")) {
                    $("#list dd").each(function(index, ele) {
                        arr.push($(ele).find("a").attr("href"))
                    })
                    getBook2(arr);
                    async.mapLimit(arr, 10, fetchUrl(url) {
                        i++;
                        getBook2(i,url);
                    }, function(err, result) {
                        console.log('final:');
                        console.log(result);
                    });
                }


            });
    });
}

function getBook2(i,url) {
    // console.log(arr[i]);
    http.get("http://www.xxbiquge.com" + url, function(res) {
        var arrBuf = [];
        var bufLength = 0;
        res.on("data", function(chunk) {
                arrBuf.push(chunk);
                bufLength += chunk.length;
            })
            .on("end", function() {
                // arrBuf是个存byte数据块的数组，byte数据块可以转为字符串，数组可不行
                // bufferhelper也就是替你计算了bufLength而已 
                var chunkAll = Buffer.concat(arrBuf, bufLength);
                var strJson = iconv.decode(chunkAll, 'utf-8'); // 汉字不乱码
                var $ = cheerio.load(strJson);
                var bookname = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));

                var file = $("#content").text();
                console.log(bookname);

                createFile(i, file);
            });
    }).on("error", function(e) {
        console.log(`错误: ${e.message}`);
    });

}

function createFile(index, file) {
    var name = autoComplete(index);
    fs.writeFile("book/" + name, file, function(err) {
        if (err) {
            return console.log(err);
        }
        // console.log("The file was saved!");
    });

}

function autoComplete(num) {
    num += "";
    if (num.length < 1 || num.length > 4) {
        return
    }
    switch (num.length) {
        case 1:
            return "000" + num + ".txt";
            break;
        case 2:
            return "00" + num + ".txt";
            break;
        case 3:
            return "0" + num + ".txt";
            break;
        case 4:
            return "" + num + ".txt";
            break;
        default:
            return "0001.txt";
            break;
    }
}
