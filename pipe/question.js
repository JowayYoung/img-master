const { QUESTION_TEXT } = require("../i18n");

const QT_GROUP = {
	choices: QUESTION_TEXT.groupList,
	default: "type",
	message: QUESTION_TEXT.gruop,
	name: "GROUP",
	type: "list"
};

module.exports = {
	QT_GROUP
};