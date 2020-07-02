const Chalk = require("chalk");
const Figures = require("figures");
const { ByteSize, RoundNum } = require("trample/node");

const GLOB_TEXT = {
	desc: `Description:\n${Chalk.blueBright("img-master")} 一个多功能无限制的图片批处理工具\n文档详情请查看 ${Chalk.yellowBright("https://github.com/JowayYoung/img-master")}`,
	help: "使用信息",
	version: "版本编号"
};

const ACTION_TEXT = {
	compress: "压缩图片",
	group: "分组图片"
};

const QUESTION_TEXT = {
	gruop: "请选择图片分组依据",
	groupList: [
		{ name: "按照图片类型分组", value: "type" },
		{ name: "按照图片尺寸分组", value: "size" },
		{ name: `按照图片大小区间分组 ${Chalk.blueBright("小于10k为小图，介于10k~100k为中图，大于100k为大图")}`, value: "range" }
	]
};

const COMPRESS_TEXT = {
	compressFailed: (path, msg) => `${Figures.cross} 压缩[${Chalk.yellowBright(path)}]失败：${Chalk.redBright(msg)}`,
	compressOsFailed: path => `${Figures.cross} 压缩[${Chalk.yellowBright(path)}]失败：${Chalk.redBright("请确保图片大小在5M以下")}`,
	compressReqFailed: (path, msg) => `${Figures.cross} 压缩[${Chalk.yellowBright(path)}]失败：请求发送失败，${Chalk.redBright(msg)}`,
	downloadReqFailed: (path, msg) => `${Figures.cross} 下载[${Chalk.yellowBright(path)}]失败：请求发送失败，${Chalk.redBright(msg)}`,
	downloadSuccessed: (path, obj) => `${Figures.tick} 下载[${Chalk.yellowBright(path)}]成功：原始大小${Chalk.redBright(ByteSize(obj.input.size))}，压缩大小${Chalk.greenBright(ByteSize(obj.output.size))}，优化比例${Chalk.blueBright(RoundNum(1 - obj.output.ratio, 2, true))}`
};

const GROUP_TEXT = {
	loading: "图片正在分组中...",
	rangeGroupSuccessed: `${Figures.tick} 按照图片${Chalk.greenBright("大小区间")}分组成功`,
	sizeGroupSuccessed: `${Figures.tick} 按照图片${Chalk.greenBright("尺寸")}分组成功`,
	typeGroupSuccessed: `${Figures.tick} 按照图片${Chalk.greenBright("类型")}分组成功`
};

const OPERATION_TEXT = {
	targetCount: n => `${Figures.pointer} 处理图片总数：${Chalk.blueBright(n)}张`
};

module.exports = {
	ACTION_TEXT,
	COMPRESS_TEXT,
	GLOB_TEXT,
	GROUP_TEXT,
	OPERATION_TEXT,
	QUESTION_TEXT
};