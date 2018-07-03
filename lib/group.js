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
	await copyDir(
		filePath,
		`${process.cwd()}/dist/${storePath}/${utils.getFileName(filePath)}`
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
		chalk.white.bgGreen("\nStatistical data completed\n")
	);
}

async function group() {
	const answer = await inquirer.prompt(question);
	const mode = {
		a: "size",
		b: "ext"
	}[answer.group[0].toLowerCase()];
	console.time("Execution Time");
	await utils.removeDist();
	const res = await await utils.mapFile({
		sucMsg: "Image grouping completed",
		isFileCb: filePath => outputRes(filePath, mode)
	});
	res && await addUp();
	console.timeEnd("Execution Time");
}

module.exports = group;