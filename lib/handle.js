const fs = require("fs");
const promisify = require("util").promisify;
const imageMagick = require("gm").subClass({ imageMagick: true });
const inquirer = require("inquirer");

const utils = require("../utils");

const createDir = promisify(fs.mkdir);

const question = {
	resize: [{
		default: false,
		message: "Whether or not to reset the image size",
		name: "value",
		type: "confirm"
	}],
	crop: [{
		default: false,
		message: "Whether to reset the clipped image",
		name: "value",
		type: "confirm"
	}]
};
const processing = {
	resize: [{
		message: "Please input the image size and use space partition\n(width height) => (100 200)",
		name: "value",
		type: "input"
	}],
	crop: [{
		message: "Please input the clipping area and use space partition\n(width, height, x, y) => (100, 200, 10, 20)",
		name: "value",
		type: "input"
	}]
};

async function outputRes(filePath, opts) {
	const target = imageMagick(filePath);
	if (opts.resize) {
		const size = opts.resize.split(" ");
		const width = +size[0] ? +size[0] : null;
		const height = +size[1] ? +size[1] : null;
		console.log(width, height);
		width && height ? target.resize(width, height, "!") : target.resize(width, height);
	}
	if (opts.crop) {
		const clip = opts.crop.split(" ");
		target.crop(clip[0] || null, clip[1] || null, clip[2] || 0, clip[3] || 0);
	}
	target.write(
		`${process.cwd()}/dist/${utils.getFileName(filePath)}`,
		err => console.log(err || "Done")
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
	await utils.removeDist();
	await createDir(process.cwd() + "/dist");
	console.time("Execution Time");
	await utils.mapFile({
		sucMsg: "Image handling completion",
		isFileCb: filePath => outputRes(filePath, answer)
	});
	console.timeEnd("Execution Time");
	/* imageMagick(process.cwd() + "/test.jpg")
		.size((err, size) => {
			err ? console.log(err) : console.log(size.width, size.height);
		});
	imageMagick(process.cwd() + "/test.jpg")
		.resize(300, 400, "!")
		.write(process.cwd() + "/dist/test.jpg", err => {
			err ? console.log(err) : console.log("Done");
		}); */
}

module.exports = handle;