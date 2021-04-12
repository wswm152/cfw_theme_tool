var fs = require("fs");
var themes = ["common", "light", "dark", "red", "2077"]

var clash_path = 'D:/Clash/Clash for Windows/'//指定clash安装路径
clash_path += clash_path.endsWith('/') ? '' : '/';

var electron_path = clash_path + 'resources/app/dist/electron/'
var css = require('css');
csspath = electron_path + 'static/css/';



for (const tn of themes) {
    fenlicss(tn);
}



function fenlicss(themename) {

    let raw=csspath+'raw/'
    files = fs.readdirSync(raw)
    for (let j = 0, len = files.length; j < len; j++) {
        let cpath = raw + files[j];
        if (fs.lstatSync(cpath).isDirectory()) { continue }
        let cssstr = fs.readFileSync(cpath, 'utf-8');
        se(themename, cssstr, files[j])
    }
}
function se(themename, cssstr, filename) {
    let rmtheme = ''
    for (const tn of themes) {
        if (themename != tn) {
            rmtheme += '|(' + tn + ')'
        }
    }
    rmtheme = rmtheme.slice(1)
    let rmrex = new RegExp(rmtheme)
    let askrex = new RegExp(themename)

    let obj = css.parse(cssstr);
    let wfn = csspath + themename + '/' + filename
    obj.stylesheet.rules = obj.stylesheet.rules.filter(function (r) {
        return r.type == 'rule' || themename == 'common'
    })
    for (const rule of obj.stylesheet.rules) {
        if (rule.type != 'rule') { continue; }
        let slcs = rule.selectors
        rule.selectors = slcs.filter(function (e) {
            let aa = false
            if (themename == 'common') {
                aa = (!rmrex.test(e))
            } else {
                aa = (askrex.test(e))
            }

            return aa
        })
        //console.log(rule);
    }
    obj.stylesheet.rules = obj.stylesheet.rules.filter(function (r) {
        let res = (r.type == 'rule' && r.selectors.length > 0) || (r.type != 'rule')
        return res;
    })
    let fmat = css.stringify(obj, { indent: '\t' })
    let feik = new RegExp(/\{/, 'g')
    if (feik.test(fmat)) {
        console.log(wfn)
        fs.writeFileSync(wfn, fmat, 'utf8');
    }
}