var invisible = function () {
	console.log("invisible");
}
exports.themes = ["light", "common", "dark", "red", "2077"]
const fs = require('fs');
const localdebug = 0;
const static_path = localdebug ? "D:/Clash/Clash for Windows/resources/app/dist/electron/static/" : __static + "\\";
console.log("ssss" + static_path);
exports.message = "hi";

exports.read = function (index) {
	var s = "";
	let themes = exports.themes
	for (const theme of themes) {


		try {
			let path = static_path + "css/" + theme + '/' + index + ".css"
			if (fs.existsSync(path)) {
				let ones=fs.readFileSync(path, 'utf-8');
				ones=exports.repcolor(theme,ones,index)
				s += ones;
			}
		} catch (err) {
			console.log(err);
		}
	}
	if (index == 11) {
		console.log(index);
	}
	return s}
exports.repcolor = function (theme,s, index) {
	try {
		var alld = fs.readFileSync(static_path + "dic/"+theme+"-all.css", 'utf-8');
		alld = alld.replace(/\r/g, '').replace(/,\n/g, ',').replace(/\n\}/g, '}').replace(/\{\n\t/g, '{').replace(/ /g, '');
		if (index == 1) {
			console.log(alld);
		}
	} catch (err) {
		return s;
	}
	const matches = alld.matchAll(/(\S*)\{\s?color: ?([\S ]*)\}/g);
	for (const match of matches) {
		if (index == 13) {
			console.log(match[1]);
		}
		try {
			alls = match[1].split(',');
			colorstr = match[2];
			alls.map(function (val) {
				//val=new RegExp(val,'g');
				s = s.replace(val, colorstr);
			})

			//s = s.replace(match[1], match[2]);
		} catch (e) {
			console.log("wswmerr" + e)
		}
	}

	//console.log(s);
	return s;
}
exports.test = function () {
	background
	var s = "start";
	return s;

}
/* fs.readdirSync(testFolder).forEach(file => {
  console.log(file);}) */
