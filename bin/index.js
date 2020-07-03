#!/usr/bin/env node

const Chalk = require("chalk");
const Commander = require("commander");

const { version } = require("../package");
const { ACTION_TEXT, GLOB_TEXT } = require("../i18n");
const { TRANSFORM_REGEXP } = require("../util/getting");
const { AutoBin } = require("../util/setting");

// 版本和用法
Commander
	.usage(Chalk.yellowBright("<command> [option]"))
	.version(version, "-v, --version", Chalk.greenBright(GLOB_TEXT.version))
	.helpOption("-h, --help", Chalk.greenBright(GLOB_TEXT.help))
	.description(GLOB_TEXT.desc);
// 压缩图片
Commander
	.command("compress")
	.alias("c")
	.description(Chalk.blueBright(ACTION_TEXT.compress))
	.action(() => AutoBin("compress"));
// 分组图片
Commander
	.command("group")
	.alias("g")
	.description(Chalk.blueBright(ACTION_TEXT.group))
	.action(() => AutoBin("group"));
// 变换图片
Commander
	.command("transform")
	.alias("t")
	.option("--blur [param]", "模糊", TRANSFORM_REGEXP.blur, "")
	.option("--extract [param]", "裁剪", TRANSFORM_REGEXP.extract, "")
	.option("--flip [param]", "平翻", TRANSFORM_REGEXP.flip, "")
	.option("--flop [param]", "对翻", TRANSFORM_REGEXP.flop, "")
	.option("--format [param]", "格式", TRANSFORM_REGEXP.format, "")
	.option("--grayscale [param]", "灰度", TRANSFORM_REGEXP.grayscale, "")
	.option("--negate [param]", "负片", TRANSFORM_REGEXP.negate, "")
	.option("--resize [param]", "尺寸", TRANSFORM_REGEXP.resize, "")
	.option("--rotate [param]", "旋转", TRANSFORM_REGEXP.rotate, "")
	.option("--sharpen [param]", "锐化", TRANSFORM_REGEXP.sharpen, "")
	.description(Chalk.blueBright(ACTION_TEXT.transform))
	.action((cmd, env) => AutoBin("transform", cmd, env));
// 帮助
Commander.parse(process.argv);