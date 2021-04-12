var fs = require("fs");
var clash_path = 'D:/Clash/Clash for Windows/'//指定clash安装路径
clash_path += clash_path.endsWith('/') ? '' : '/';
var electron_path = clash_path + 'resources/app/dist/electron/'

if (!fs.existsSync(clash_path)) {

    throw new Error("请检查文件夹路径");
}

inst();
var ren_str = fs.readFileSync(electron_path + 'renderer.js', 'utf-8').toString();
insetwswmjs();
console.log(ren_str.slice(0, 100))
var ucssidex=getusefulcssindex()
tiqucss();
fs.writeFileSync(electron_path + 'renderer.js',ren_str,'utf8')







/**
 * 提取css文件
 */
function tiqucss() {
    let rex = new RegExp(/push\(\[e\.i,[^\S]*("[^\n'"]{0,}\{[^\n'"]{0,}"),/, 'g');
    let rex1 = new RegExp(/"[^\n'"]{0,}\{[^\n'"]{0,}"/, 'g');
    let cc = ren_str.match(rex);
    if(!(cc))return;
    for (let j = 0, len = cc.length; j < len; j++) {

        let i = ucssidex + j;
        let acc = cc[j].match(rex1)[0];
        let fmat = acc.slice(1, -1).replace(/{/g, '{\n\t').replace(/;/g, ';\n\t').replace(/}/g, "\n}\n\n");
        let sre = "wswm.read(" + i + ")";
        ren_str = ren_str.replace(acc, sre);

        let fn = electron_path + 'static/css/raw/' + i + '.css';
        fs.writeFileSync(fn, fmat, 'utf8');
    }
}

/**
 * 获取已经存在的css文件，序号+1
 */
function getusefulcssindex() {
    cssindex=1;
    while (cssindex < 200) {
        console.log(cssindex)
        cssfile = electron_path + 'static/css/raw/' + cssindex + '.css';
        if (!fs.existsSync(cssfile)) {
            break;
        }
        cssindex += 1;
    }
    return cssindex;
}





/** 
 * 注入wswmjs
 */
function insetwswmjs() {
    if (ren_str.startsWith("module")) {
        ren_str = "const wswm= require('./wswm.js')\n" + ren_str;
    }
}

/*** 
 * 创建文件夹/
 * 复制js文件
 */
function inst() {
    mkdir('static/css');
    mkdir('static/css/common');
    mkdir('static/css/light');
    mkdir('static/css/dark');
    mkdir('static/css/red');
    mkdir('static/css/2077');
    mkdir('static/css/raw');
    mkdir('static/dic');
    mkdir('static/append-css');
    fs.copyFileSync('wswm.js', electron_path + 'wswm.js');
}

function mkdir(p) {
    p = electron_path + p;
    p = p.replace(/\/\//, '/')
    if (!fs.existsSync(p)) {
        fs.mkdirSync(p)
    } else {
        console.log(p)
    }

}