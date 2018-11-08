const Fs = require("fs");
const Path = require("path");
const Promisify = require("util").promisify;
const Chalk = require("chalk");
const ImageSize = require("image-size");
const Inquirer = require("inquirer");
const RecursiveCopy = require("recursive-copy");

const utils = require("../utils");

const readDir = Promisify(Fs.readdir);
const readFile = Promisify(Fs.readFile);
const writeFile = Promisify(Fs.writeFile);
const copyDir = Promisify(RecursiveCopy);
const getSize = Promisify(ImageSize);

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
		ext: Path.extname(filePath).replace(".", "")
	}[mode];
	await copyDir(
		filePath,
		`${process.cwd()}/dist/${storePath}/${utils.getFileName(filePath)}`
	);
	console.log(
		Chalk.blueBright("Output >>"),
		Chalk.magentaBright(filePath.replace(/src/g, "dist")),
		Chalk.cyanBright(size.width, size.height)
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
		Chalk.yellowBright(countJson + "\n"),
		Chalk.greenBright("\nStatistical data completed\n")
	);
}

async function group() {
	const answer = await Inquirer.prompt(question);
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