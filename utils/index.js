const fs = require("fs");
const promisify = require("util").promisify;
const chalk = require("chalk");
const isImage = require("is-image");
const rimraf = require("rimraf");

const readDir = promisify(fs.readdir);
const readStat = promisify(fs.stat);
const removeDir = promisify(rimraf);

function authType(val, type) {
	const target = formatAnswer(val);
	if (!target) {
		return chalk.white.bgRed("Only input number and comma");
	}
	if (type === "resize") {
		return true;
	}
	if (type === "crop") {
		const size = target[0] && target[1];
		return size ? true : chalk.white.bgRed("Width and height can only input positive number");
	}
	if (type === "compress") {
		const quality = target[0];
		return quality > 0 && quality <= 100 ? true : chalk.white.bgRed("Quality can only input positive number between 0 and 100");
	}
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
	const files = await readDir(currPath);
	if (files.constructor !== Array || !files.length) {
		console.log(chalk.white.bgRed("The current directory is empty\n"));
		return false;
	}
	for (let file of files) {
		const filePath = currPath + "/" + file;
		const stat = await readStat(filePath);
		if (stat.isFile() && isImage(filePath)) {
			isFileCb && await isFileCb(filePath);
		} else if (stat.isDirectory()) {
			mapFile(filePath);
		}
	}
	console.log(chalk.white.bgGreen("\n" + sucMsg + "\n"));
	return true;
}

async function removeDist() {
	await removeDir(process.cwd() + "/dist");
	console.log(chalk.white.bgGreen("\nThe output directory was cleared successfully\n"));
}

module.exports = {
	authType,
	formatAnswer,
	getFileName,
	help,
	mapFile,
	removeDist
};