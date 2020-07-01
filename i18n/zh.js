const Chalk = require("chalk");
const Figures = require("figures");
const { ByteSize, RoundNum } = require("trample/node");

const GLOB_TEXT = {
	desc: `Description:\n${Chalk.blueBright("img-master")} 一个多功能无限制的图片处理工具\n文档详情请查看 ${Chalk.yellowBright("https://github.com/JowayYoung/img-master")}`,
	help: "使用信息",
	version: "版本编号"
};

const ACTION_TEXT = {
	compress: "压缩图片"
};

const COMPRESS_TEXT = {
	compressReqFailed: (path, msg) => `${Figures.cross} 压缩[${Chalk.yellowBright(path)}]请求失败：${Chalk.redBright(msg)}`,
	compressFailed: (path, msg) => `${Figures.cross} 压缩[${Chalk.yellowBright(path)}]失败：${Chalk.redBright(msg)}`,
	downloadReqFailed: (path, msg) => `${Figures.cross} 下载[${Chalk.yellowBright(path)}]请求失败：${Chalk.redBright(msg)}`,
	downloadSuccessed: (path, obj) => `${Figures.tick} 下载[${Chalk.yellowBright(path)}]成功：原始大小${Chalk.redBright(ByteSize(obj.input.size))}，压缩大小${Chalk.greenBright(ByteSize(obj.output.size))}，优化比例${Chalk.blueBright(RoundNum(obj.output.ratio, 2, true))}`
};

module.exports = {
	ACTION_TEXT,
	COMPRESS_TEXT,
	GLOB_TEXT
};