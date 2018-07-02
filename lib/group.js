const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;
const chalk = require("chalk");
const imageSize = require("image-size");
const inquirer = require("inquirer");
const recursiveCopy = require("recursive-copy");

const utils = require("../utils");

const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const copyDir = promisify(recursiveCopy);
const getSize = promisify(imageSize);

const question = [{
	choices: ["A Grouping according to size", "B Grouping according to type"],
	default: 0,
	message: "Please select the image grouping basis",
	name: "group",
	type: "list"
}];

async function outputRes(filePath, mode) {
	const size = await getSize(filePath);
	const storePath = {
		size: size.width + "-" + size.height,
		ext: path.extname(filePath).replace(".", "")
	}[mode];
	const target = filePath.split("/");
	await copyDir(
		filePath,
		`${process.cwd()}/dist/${storePath}/${target[target.length - 1]}`
	);
	console.log(
		chalk.blueBright("Output >>"),
		chalk.magentaBright(filePath),
		chalk.cyanBright(size.width, size.height)
	);
}

async function addUp() {
	const count = {};
	const currPath = process.cwd() + "/dist";
	const imgList = await readDir(currPath);
	for (let v of imgList) {
		const filesPath = currPath + "/" + v;
		const files = await readDir(filesPath);
		Object.assign(count, {
			[v]: files.length
		});
	}
	const targetPath = currPath + "/count.json";
	await writeFile(targetPath, JSON.stringify(count, null, 4));
	const countJson = await readFile(targetPath, "utf-8");
	console.log(
		chalk.yellowBright(countJson + "\n"),
		chalk.white.bgGreen("\nStatistical data completion\n")
	);
}

async function group() {
	const answer = await inquirer.prompt(question);
	const mode = { a: "size", b: "ext" }[answer.group[0].toLowerCase()];
	await utils.removeDist();
	console.time("Execution Time");
	const res = await await utils.mapFile({
		sucMsg: "Image grouping completion",
		isFileCb: filePath => outputRes(filePath, mode)
	});
	res && await addUp();
	console.timeEnd("Execution Time");
}

module.exports = group;

/* async function groupBy(mode = "size", currPath = process.cwd() + "/src") {
	const files = await readDir(currPath);
	if (files.constructor !== Array || !files.length) {
		console.log(chalk.white.bgRed("There is no file in the current directory"));
		return false;
	}
	for (let file of files) {
		const filePath = currPath + "/" + file;
		const stat = await readStat(filePath);
		const ext = path.extname(filePath).replace(".", "");
		if (stat.isFile() && (ext === "png" || ext === "jpg")) {
			const size = await getSize(filePath);
			const storePath = { size: size.width + "-" + size.height, ext }[mode];
			await copyDir(filePath, `${process.cwd()}/dist/${storePath}/${file}`);
			console.log(
				chalk.blueBright("Output >>"),
				chalk.magentaBright(filePath),
				chalk.cyanBright(size.width, size.height)
			);
		} else if (stat.isDirectory()) {
			groupBy(mode, filePath);
		}
	}
	console.log(chalk.white.bgGreen("\nImage grouping completion\n"));
	return true;
} */