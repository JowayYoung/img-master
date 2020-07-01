const Inquirer = require("inquirer");

const { QT_GROUP } = require("./question");

async function GroupAnswer() {
	const answer = await Inquirer.prompt(QT_GROUP);
	return answer;
}

module.exports = {
	GroupAnswer
};