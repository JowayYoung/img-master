const Fs = require("fs");
const Promisify = require("util").promisify;
const Chalk = require("chalk");
const IsImage = require("is-image");
const Rimraf = require("rimraf");

function asyncTo(promise) {
	return promise.then(data => [null, data]).catch(err => [err]);
}

function formatAnswer(val) {
	const reg = new RegExp(/^[0-9,]+$/);
	const flag = reg.test(val);
	return flag
		? val
			.replace(/\s+/g, "") // 清除所有空格
			.replace(/^,*|,*$/g, "") // 清除前后逗号
			.split(",") // 以逗号分割
			.map(v => +v) // 转换成数字
		: false;
}

function getFileName(dir) {
	const target = dir.split("/");
	return target[target.length - 1];
}

function help(commander) {
	commander.parse(process.argv);
	if (!commander.args.length) {
		commander.help();
	}
}

async function mapFile({ currPath = process.cwd() + "/src", sucMsg, isFileCb }) {
	const readDir = Promisify(Fs.readdir);
	const readStat = Promisify(Fs.stat);
	const files = await readDir(currPath);
	if (files.constructor !== Array || !files.length) {
		console.log(Chalk.redBright("The current directory is empty\n"));
		return false;
	}
	for (let file of files) {
		const filePath = currPath + "/" + file;
		const stat = await readStat(filePath);
		if (stat.isFile() && IsImage(filePath)) {
			isFileCb && await isFileCb(filePath);
		} else if (stat.isDirectory()) {
			mapFile(filePath);
		}
	}
	console.log(Chalk.greenBright("\n" + sucMsg + "\n"));
	return true;
}

async function removeDist() {
	const removeDir = Promisify(Rimraf);
	await removeDir(process.cwd() + "/dist");
	console.log(Chalk.greenBright("\nThe output directory was cleared successfully\n"));
}

function validType(val, type) {
	const target = formatAnswer(val);
	if (!target) {
		return Chalk.white.redBright("Only input number and comma");
	}
	if (type === "resize") {
		return true;
	}
	if (type === "crop") {
		const size = target[0] && target[1];
		return size ? true : Chalk.redBright("Width and height can only input positive number");
	}
	if (type === "compress") {
		const quality = target[0];
		return quality > 0 && quality <= 100 ? true : Chalk.redBright("Quality can only input positive number between 0 and 100");
	}
}

module.exports = {
	asyncTo,
	formatAnswer,
	getFileName,
	help,
	mapFile,
	removeDist,
	validType
};