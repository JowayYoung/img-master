const ChildProcess = require("child_process");
const Fs = require("fs");
const Promisify = require("util").promisify;
const Bluebird = require("bluebird");
const Chalk = require("chalk");
const ImageMagick = require("gm").subClass({ imageMagick: true });
const Inquirer = require("inquirer");

const Utils = require("../utils");

Bluebird.promisifyAll(ImageMagick.prototype);

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
	}],
	format: [{
		default: false,
		message: "Whether to format the image",
		name: "value",
		type: "confirm"
	}],
	compress: [{
		default: false,
		message: "Whether to compress the image",
		name: "value",
		type: "confirm"
	}]
};
const processing = {
	resize: [{
		message: `Please input the image size and use comma partition\n${Chalk.yellowBright("width,height => 100,200")}`,
		name: "value",
		type: "input",
		validate: val => Utils.validType(val, "resize")
	}],
	crop: [{
		message: `Please input the image clipping area and use comma partition\n${Chalk.yellowBright("width,height,x,y => 100,200,10,20")}`,
		name: "value",
		type: "input",
		validate: val => Utils.validType(val, "crop")
	}],
	format: [{
		choices: ["png", "jpg"],
		message: "Please select the image extension",
		name: "value",
		type: "list"
	}],
	compress: [{
		message: `Please input the image quality\n${Chalk.blueBright("quality => 100")}`,
		name: "value",
		type: "input",
		validate: val => Utils.validType(val, "compress")
	}]
};

async function outputRes(filePath, opts) {
	const target = ImageMagick(filePath);
	if (opts.resize) {
		const size = Utils.formatAnswer(opts.resize);
		const width = size[0] ? size[0] : null;
		const height = size[1] ? size[1] : null;
		width && height
			? target.resize(width, height, "!")
			: target.resize(width, height);
	}
	if (opts.crop) {
		const clip = Utils.formatAnswer(opts.crop);
		const width = clip[0];
		const height = clip[1];
		const x = clip[2] ? clip[2] : 0;
		const y = clip[3] ? clip[3] : 0;
		target.crop(width, height, x, y);
	}
	if (opts.format) {
		filePath = filePath.split(".")[0] + "." + opts.format;
	}
	if (opts.compress) {
		target.quality(opts.compress);
		opts.format === "png" && target.compress("lossless");
		opts.format === "jpg" && target.compress("jpeg");
	} else {
		target.quality(100);
	}
	await target.writeAsync(`${process.cwd()}/dist/${Utils.getFileName(filePath)}`);
	console.log(
		Chalk.blueBright("Output >>"),
		Chalk.magentaBright(filePath.replace(/src/g, "dist"))
	);
}

async function handle() {
	const exec = Promisify(ChildProcess.exec);
	try {
		const [err, stats] = await exec("magick --version");
		if (err || !stats) {
			return console.log(Chalk.redBright("\nPlease installing GraphicsMagick or ImageMagick\n"));
		}
	} catch (err) {
		return console.log(Chalk.redBright("\nPlease installing GraphicsMagick or ImageMagick\n"));
	}
	const answer = {};
	for (let k in question) {
		const keep = await Inquirer.prompt(question[k]);
		if (keep.value) {
			const key = await Inquirer.prompt(processing[k]);
			Object.assign(answer, {
				[k]: key.value
			});
		}
	}
	if (Object.keys(answer).length > 0) {
		console.time("Execution Time");
		const createDir = Promisify(Fs.mkdir);
		await Utils.removeDist();
		await createDir(process.cwd() + "/dist");
		await Utils.mapFile({
			sucMsg: "Image handling completed",
			isFileCb: filePath => outputRes(filePath, answer)
		});
		console.timeEnd("Execution Time");
	}
}

module.exports = handle;