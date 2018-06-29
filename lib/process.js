const imageMagick = require("gm").subClass({ imageMagick: true });
const inquirer = require("inquirer");

const question = {
	resize: [{
		default: false,
		message: "Whether or not to reset the image size",
		name: "value",
		type: "confirm"
	}]
};
const handle = {
	resize: [{
		message: "Please input the image size and use space partition (100 200)",
		name: "value",
		type: "input"
	}]
};

async function process() {
	// const dist = process.cwd() + "/dist";
	const answer = [];
	const isResize = await inquirer.prompt(question.resize);
	if (isResize.value) {
		const resize = await inquirer.prompt(handle.resize);
		answer.push(resize.value);
	}
	console.log(answer);
}

module.exports = process;