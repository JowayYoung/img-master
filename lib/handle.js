const fs = require("fs");
const promisify = require("util").promisify;
const bluebird = require("bluebird");
const chalk = require("chalk");
const imageMagick = require("gm").subClass({ imageMagick: true });
const inquirer = require("inquirer");

const utils = require("../utils");

const createDir = promisify(fs.mkdir);
bluebird.promisifyAll(imageMagick.prototype);

const question = {
	resize: [{
		default: false,
		message: "Whether to resize the image",
		name: "value",
		type: "confirm"
	}],
	crop: [{
		default: false,
		message: "Whether to clip the image",
		name: "value",
		type: "confirm"
	}]
};
const processing = {
	resize: [{
		message: `Please input the image size and use comma partition\n${chalk.blueBright("width,height => 100,200")}`,
		name: "value",
		type: "input",
		validate: val => utils.authType(val, "resize")
	}],
	crop: [{
		message: `Please input the image clipping area and use comma partition\n${chalk.blueBright("width,height,x,y => 100,200,10,20")}`,
		name: "value",
		type: "input",
		validate: val => utils.authType(val, "crop")
	}]
};

async function outputRes(filePath, opts) {
	const target = imageMagick(filePath);
	if (opts.resize) {
		const size = utils.formatAnswer(opts.resize);
		const width = size[0] ? size[0] : null;
		const height = size[1] ? size[1] : null;
		width && height
			? target.resize(width, height, "!")
			: target.resize(width, height);
	}
	if (opts.crop) {
		const clip = utils.formatAnswer(opts.crop);
		const width = clip[0];
		const height = clip[1];
		const x = clip[2] ? clip[2] : 0;
		const y = clip[3] ? clip[3] : 0;
		target.crop(width, height, x, y);
	}
	await target.writeAsync(`${process.cwd()}/dist/${utils.getFileName(filePath)}`);
	console.log(
		chalk.blueBright("Output >>"),
		chalk.magentaBright(filePath)
	);
}

async function handle() {
	const answer = {};
	const isResize = await inquirer.prompt(question.resize);
	if (isResize.value) {
		const resize = await inquirer.prompt(processing.resize);
		Object.assign(answer, { resize: resize.value });
	}
	const isCrop = await inquirer.prompt(question.crop);
	if (isCrop.value) {
		const crop = await inquirer.prompt(processing.crop);
		Object.assign(answer, { crop: crop.value });
	}
	if (Object.keys(answer).length > 0) {
		console.time("Execution Time");
		await utils.removeDist();
		await createDir(process.cwd() + "/dist");
		await utils.mapFile({
			sucMsg: "Image handling completed",
			isFileCb: filePath => outputRes(filePath, answer)
		});
		console.timeEnd("Execution Time");
	}
}

module.exports = handle;