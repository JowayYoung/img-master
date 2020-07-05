const Inquirer = require("inquirer");

const {
	QT_GROUP,
	QT_MARK_BLEND,
	QT_MARK_COLOR,
	QT_MARK_GRAVITY,
	QT_MARK_LEFT,
	QT_MARK_SIZE,
	QT_MARK_TEXT,
	QT_MARK_TOP
} = require("./question");

async function GroupAnswer() {
	const answer = await Inquirer.prompt(QT_GROUP);
	return answer;
}

async function MarkAnswer() {
	const question1 = [
		QT_MARK_TEXT,
		QT_MARK_SIZE,
		QT_MARK_COLOR,
		QT_MARK_BLEND,
		QT_MARK_GRAVITY
	];
	const question2 = [
		QT_MARK_LEFT,
		QT_MARK_TOP
	];
	const answer1 = await Inquirer.prompt(question1);
	const answer2 = answer1.markGravity === "none"
		? await await Inquirer.prompt(question2)
		: {};
	return { ...answer1, ...answer2 };
}

module.exports = {
	GroupAnswer,
	MarkAnswer
};