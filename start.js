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
                var $ = cheerio.load(strJson)
                if ($("#list")) {
                    $("#list dd").each(function(index, ele) {
                        arr.push($(ele).find("a").attr("href"))
                    })
                    getBook2(arr);
                }


            });
    });
}

function getBook2(arr) {
    var len = arr.length;
    console.log(len);
    var i=0;
    setInterval(function () {
    	// console.log(arr[i]);
        var u = arr[i];
        (function(i,u) {
            http.get("http://www.xxbiquge.com" + u, function(res) {
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
                        var bookname = u.substring(u.lastIndexOf("/") + 1, u.lastIndexOf("."));

                        var file = $("#content").text();
                        console.log(bookname);
                        i++;

                        createFile(i,file);
                    });
            }).on("error", function(e) {
                console.log(`错误: ${e.message}`);
            });
        })(i,u)
        i++;
        if(i>len){
        	return;
        }
    },100)
        


}

function createFile(index,file) {
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
