const Chalk = require("chalk");
const Figures = require("figures");
const { ByteSize, RoundNum } = require("trample/node");

const GLOB_TEXT = {
	desc: `Description:\n${Chalk.blueBright("img-master")} 一个多功能无限制的图像批处理工具\n文档详情请查看 ${Chalk.yellowBright("https://github.com/JowayYoung/img-master")}`,
	help: "使用信息",
	version: "版本编号"
};

const ACTION_TEXT = {
	compress: "压缩图像",
	group: "分组图像",
	mark: "标记图像",
	transform: "变换图像",
	transformBlur: "模糊",
	transformExtract: "裁剪",
	transformFlip: "平翻",
	transformFlop: "对翻",
	transformFormat: "格式",
	transformGrayscale: "灰度",
	transformNegate: "负片",
	transformNormalise: "对比",
	transformResize: "调整",
	transformRotate: "旋转",
	transformSharpen: "锐化"
};

const QUESTION_TEXT = {
	group: "请选择图像分组依据",
	groupList: [
		{ name: "按照图像尺寸分组", value: "size" },
		{ name: "按照图像类型分组", value: "type" },
		{ name: `按照图像体积分组：${Chalk.blueBright("小于10k为小图，介于10k~100k为中图，大于100k为大图")}`, value: "volume" }
	],
	judgeMarkColor: "水印颜色只能是HEX、RGB、RGBA",
	judgeMarkLeft: "水印左偏移量只能是0或正整数",
	judgeMarkSize: "水印尺寸只能是正整数",
	judgeMarkText: "水印文本只能是1到50位数字、英文、中文、空格、下划线或中划线的字符",
	judgeMarkTop: "水印上偏移量只能是0或正整数",
	markBlend: "请选择水印混合模式",
	markBlendList: [
		{ name: "add", value: "add" },
		{ name: "atop", value: "atop" },
		{ name: "clear", value: "clear" },
		{ name: "color-burn", value: "color-burn" },
		{ name: "color-dodge", value: "color-dodge" },
		{ name: "colour-burn", value: "colour-burn" },
		{ name: "colour-dodge", value: "colour-dodge" },
		{ name: "darken", value: "darken" },
		{ name: "dest", value: "dest" },
		{ name: "dest-atop", value: "dest-atop" },
		{ name: "dest-in", value: "dest-in" },
		{ name: "dest-out", value: "dest-out" },
		{ name: "dest-over", value: "dest-over" },
		{ name: "difference", value: "difference" },
		{ name: "exclusion", value: "exclusion" },
		{ name: "hard-light", value: "hard-light" },
		{ name: "in", value: "in" },
		{ name: "lighten", value: "lighten" },
		{ name: "multiply", value: "multiply" },
		{ name: "out", value: "out" },
		{ name: "over", value: "over" },
		{ name: "overlay", value: "overlay" },
		{ name: "saturate", value: "saturate" },
		{ name: "screen", value: "screen" },
		{ name: "soft-light", value: "soft-light" },
		{ name: "source", value: "source" },
		{ name: "xor", value: "xor" }
	],
	markColor: "请输入水印颜色",
	markGravity: "请选择水印位置",
	markGravityList: [
		{ name: "无", value: "none" },
		{ name: "中", value: "center" },
		{ name: "左", value: "west" },
		{ name: "右", value: "east" },
		{ name: "上", value: "north" },
		{ name: "下", value: "south" },
		{ name: "左上", value: "northwest" },
		{ name: "左下", value: "southwest" },
		{ name: "右上", value: "northeast" },
		{ name: "右下", value: "southeast" }
	],
	markLeft: "请输入水印左偏移量",
	markSize: "请输入水印尺寸",
	markText: "请输入水印文本",
	markTop: "请输入水印上偏移量"
};

const COMPRESS_TEXT = {
	completed: (path, obj) => `${Figures.tick} 压缩[${Chalk.yellowBright(path)}]完成：原始体积${Chalk.redBright(ByteSize(obj.input.size))}，压缩体积${Chalk.greenBright(ByteSize(obj.output.size))}，优化比例${Chalk.blueBright(RoundNum(1 - obj.output.ratio, 2, true))}`,
	failed: (path, msg) => `${Figures.cross} 压缩[${Chalk.yellowBright(path)}]失败：${Chalk.redBright(msg)}`,
	limited: path => `${Figures.cross} 上传[${Chalk.yellowBright(path)}]失败：${Chalk.redBright("请确保图像体积在5M以下")}`,
	loading: `${Chalk.green("图像正在压缩......")}`
};

const GROUP_TEXT = {
	sizeCompleted: `${Figures.tick} 按照图像${Chalk.greenBright("尺寸")}分组完成`,
	typeCompleted: `${Figures.tick} 按照图像${Chalk.greenBright("类型")}分组完成`,
	volumeCompleted: `${Figures.tick} 按照图像${Chalk.greenBright("体积")}分组完成`
};

const MARK_TEXT = {
	completed: (path, text) => `${Figures.tick} 标记[${Chalk.yellowBright(path)}]完成：添加水印${Chalk.greenBright(text)}`,
	failed: (path, msg) => `${Figures.cross} 标记[${Chalk.yellowBright(path)}]失败：${Chalk.redBright(msg)}`,
	loading: `${Chalk.green("图像正在标记......")}`
};

const OPERATION_TEXT = {
	targetCount: n => `${Figures.pointer} 处理图像总数：${Chalk.blueBright(n)}张`
};

const TRANSFORM_TEXT = {
	completed: (path, obj) => `${Figures.tick} 变换[${Chalk.yellowBright(path)}]完成：变换尺寸${Chalk.greenBright(obj.width)}x${Chalk.greenBright(obj.height)}，变换体积${Chalk.greenBright(ByteSize(obj.size))}，变换类型${Chalk.greenBright(obj.format === "jpeg" ? "JPG" : obj.format.toUpperCase())}`,
	empty: `${Figures.cross} 变换图像失败：${Chalk.redBright("请检查配置是否未输入或输入错误")}`,
	failed: (path, msg) => `${Figures.cross} 变换[${Chalk.yellowBright(path)}]失败：${Chalk.redBright(msg)}`,
	loading: `${Chalk.green("图像正在变换......")}`
};

module.exports = {
	ACTION_TEXT,
	COMPRESS_TEXT,
	GLOB_TEXT,
	GROUP_TEXT,
	MARK_TEXT,
	OPERATION_TEXT,
	QUESTION_TEXT,
	TRANSFORM_TEXT
};