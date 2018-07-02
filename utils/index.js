const fs = require("fs");
const promisify = require("util").promisify;
const chalk = require("chalk");
const isImage = require("is-image");
const rimraf = require("rimraf");

const readDir = promisify(fs.readdir);
const readStat = promisify(fs.stat);
const removeDir = promisify(rimraf);

function help(commander) {
	commander.parse(process.argv);
	if (!commander.args.length) {
		commander.help();
	}
}

function getFileName(dir) {
	const target = dir.split("/");
	return target[target.length - 1];
}

function authType(val, type) {
	if (type === "resize") {
		const flag = val
			.split(" ")
			.every(v => typeof +v === "number" && +v % 1 === 0);
		return flag ? true : chalk.white.bgRed("Only inputting integer");
	}
	if (type === "crop") {
		const _val = val.split(" ");
		const flag = _val.every(v => typeof +v === "number" && +v % 1 === 0);
		const size = +_val[0] && +_val[1];
		return flag && size ? true : chalk.white.bgRed("Only inputting positive integer");
	}
}

async function mapFile({ currPath = process.cwd() + "/src", sucMsg, isFileCb }) {
	const files = await readDir(currPath);
	if (files.constructor !== Array || !files.length) {
		console.log(chalk.white.bgRed("There is no file in the current directory\n"));
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
	console.log(chalk.white.bgGreen("\nThe output directory is deleted successfully\n"));
}

module.exports = {
	help,
	getFileName,
	authType,
	mapFile,
	removeDist
};