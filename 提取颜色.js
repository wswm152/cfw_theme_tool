const ColorString = require('color-string')
const Color = require('color')
var fs = require("fs");
var themes = ["common", "light", "dark", "red", "2077"]

var clash_path = 'D:/Clash/Clash for Windows/'//指定clash安装路径
clash_path += clash_path.endsWith('/') ? '' : '/';

var electron_path = clash_path + 'resources/app/dist/electron/'
var css = require('css');
csspath = electron_path + 'static/css/';
alld = {}
run('2077')
dic('2077')
/**
 * 替换原css
 * @param {themename} tn 
 */
function run(tn) {
    let raw = csspath + tn + '/'
    files = fs.readdirSync(raw)
    for (let j = 0, len = files.length; j < len; j++) {
        let cpath = raw + files[j];
        if (fs.lstatSync(cpath).isDirectory()) { continue }
        let cssstr = fs.readFileSync(cpath, 'utf-8');
        let rs = tiqu(cssstr)
        fs.writeFileSync(cpath, rs, 'utf-8')
    }
}
/**
 * 建立字典
 */
function dic(tn) {
    let dicstr = ''
    let dicpath=electron_path + 'static/dic/'
    let fn = dicpath+tn+'-all.css'
    Object.keys(alld).forEach(function (k) {
        let v = alld[k]
        dicstr += k + "{color: " + v + "}\n"
    });
    fs.writeFileSync(fn, dicstr, 'utf-8')
}
function tiqu(cssstr) {
    let alls = ''
    let obj = css.parse(cssstr)
    let rules = obj.stylesheet.rules
    let cname = '', ccolorhex = ''
    let crex = /(#[0-9a-fA-F]{3,8})|(rgba\([0-9|. ,]*\))|(hsla\([0-9 \.%,]*\))/
    for (const rule of rules) {
        cname = ''
        if (rule.type != 'rule') {
            continue;
        } else {
            for (const slc of rule.selectors) {
                cname += slc.replace(/ /g, '').replace(/\./g, '_')
            }
            for (const d of rule.declarations) {
                let ac = d.value.match(crex)

                if (ac != null) {
                    let recn='wswm'+(cname + d.property).replace(/ /g, '').replace(/\./g, '_')
                    d.value = d.value.replace(ac[0],recn)
                    if (alld[recn] == null) {
                        alld[recn] = c2hex8(Color(ac[0]))
                    } else {
                        let ind = recn + '--'
                        alld[ind] = c2hex8(Color(ac[0]))
                        console.log('命名冲突，需要检查')
                    }
                }
                //console.log(d.value)
            }
        }
    }
    alls = css.stringify(obj, { indent: '\t' })
    console.log('1次');
    return alls
}
/**
 * 颜色转换为rgba代码
 */
function c2hex8(c) {
    return ColorString.to.hex(c.rgb().round().array())
}
