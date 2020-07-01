const Chalk = require("chalk");
const Glob = require("glob");
const { RandomNum } = require("trample/node");

const { ACTION_TEXT, OPERATION_TEXT } = require("../i18n");
const { EXTS, OUTPUT_DIR, TINYIMG } = require("./getting");

function AutoBin(fn, ...rest) {
	const lib = require(`../lib/${fn}`);
	lib(...rest);
}

function FilterImg() {
	const ignore = Object.values(OUTPUT_DIR);
	const regexp = `**/*.{${EXTS.join(",")}}`;
	const imgs = Glob.sync(regexp).filter(v => ignore.every(w => !v.includes(w)));
	console.log(OPERATION_TEXT.targetCount(imgs.length));
	return imgs;
}

function RandomHeader() {
	const ip = new Array(4).fill(0).map(() => parseInt(Math.random() * 255)).join(".");
	const index = RandomNum(0, 1);
	return {
		headers: {
			"Cache-Control": "no-cache",
			"Content-Type": "application/x-www-form-urlencoded",
			"Postman-Token": Date.now(),
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
			"X-Forwarded-For": ip
		},
		hostname: TINYIMG[index],
		method: "POST",
		path: "/web/shrink",
		rejectUnauthorized: false
	};
}

function ShowTitle(type) {
	console.log(Chalk.white.bgMagenta(`### ${ACTION_TEXT[type]} ###`));
}

module.exports = {
	AutoBin,
	FilterImg,
	RandomHeader,
	ShowTitle
};