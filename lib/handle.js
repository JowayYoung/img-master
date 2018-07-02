const chalk = require("chalk");
const promisify = require("util").promisify;
const imageMagick = require("gm").subClass({ imageMagick: true });
const inquirer = require("inquirer");
const rimraf = require("rimraf");

const utils = require("../utils");

const removeDir = promisify(rimraf);

const question = {
	resize: [{
		default: false,
		message: "Whether or not to reset the image size",
		name: "value",
		type: "confirm"
	}]
};
const processing = {
	resize: [{
		message: "Please input the image size and use space partition (100 200)",
		name: "value",
		type: "input"
	}]
};

async function outputRes(filePath) {

}

async function handleBy(opt) {
	const result = await utils.mapFile(
		process.cwd() + "/src",
		filePath => outputRes(filePath, opt)
	);
	result && console.log(chalk.white.bgGreen("\nImage grouping completion\n"));
	return result;
}

async function handle() {
	const dist = process.cwd() + "/dist";
	const answer = {};
	const isResize = await inquirer.prompt(question.resize);
	if (isResize.value) {
		const resize = await inquirer.prompt(processing.resize);
		Object.assign(answer, { resize: resize.value });
	}
	console.log(answer, dist);
	await removeDir(dist);
	console.log(chalk.white.bgGreen("\nThe output directory is deleted successfully\n"));
	console.time("Execution Time");
	await handleBy(answer);
	console.timeEnd("Execution Time");
}

module.exports = handle;