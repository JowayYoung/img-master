const Chalk = require("chalk");

const { QUESTION_TEXT } = require("../i18n");
const { MARK_REGEXP } = require("../util/getting");

const QT_GROUP = {
	choices: QUESTION_TEXT.groupList,
	default: "type",
	message: QUESTION_TEXT.gruop,
	name: "group",
	type: "list"
};

const QT_MARK_BLEND = {
	choices: QUESTION_TEXT.markBlendList,
	default: "over",
	message: QUESTION_TEXT.markBlend,
	name: "markBlend",
	type: "list"
};

const QT_MARK_COLOR = {
	default: "#000",
	message: QUESTION_TEXT.markColor,
	name: "markColor",
	type: "input",
	validate: val => MARK_REGEXP.color.test(val) ? true : Chalk.redBright(QUESTION_TEXT.judgeMarkColor)
};

const QT_MARK_GRAVITY = {
	choices: QUESTION_TEXT.markGravityList,
	default: "none",
	message: QUESTION_TEXT.markGravity,
	name: "markGravity",
	type: "list"
};

const QT_MARK_LEFT = {
	default: "10",
	message: QUESTION_TEXT.markLeft,
	name: "markLeft",
	type: "input",
	validate: val => MARK_REGEXP.left.test(val) ? true : Chalk.redBright(QUESTION_TEXT.judgeMarkLeft)
};

const QT_MARK_SIZE = {
	default: "20",
	message: QUESTION_TEXT.markSize,
	name: "markSize",
	type: "input",
	validate: val => MARK_REGEXP.size.test(val) ? true : Chalk.redBright(QUESTION_TEXT.judgeMarkSize)
};

const QT_MARK_TEXT = {
	default: "JowayYoung",
	message: QUESTION_TEXT.markText,
	name: "markText",
	type: "input",
	validate: val => MARK_REGEXP.text.test(val) ? true : Chalk.redBright(QUESTION_TEXT.judgeMarkText)
};

const QT_MARK_TOP = {
	default: "10",
	message: QUESTION_TEXT.markTop,
	name: "markTop",
	type: "input",
	validate: val => MARK_REGEXP.top.test(val) ? true : Chalk.redBright(QUESTION_TEXT.judgeMarkTop)
};

module.exports = {
	QT_GROUP,
	QT_MARK_BLEND,
	QT_MARK_COLOR,
	QT_MARK_GRAVITY,
	QT_MARK_LEFT,
	QT_MARK_SIZE,
	QT_MARK_TEXT,
	QT_MARK_TOP
};