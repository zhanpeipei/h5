let fs=require("fs");
let ary=fs.readdirSync("./");
let result=[];

ary.forEach(function (item) {
    if(/\.(png|gif|jpg)$/.test(item)){
        result.push("img/"+item);
    }
})
fs.writeFileSync("./src.js",JSON.stringify(result),"utf-8");


