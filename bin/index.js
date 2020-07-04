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
	.option("--blur [param]", Chalk.blueBright(ACTION_TEXT.tBlur), TRANSFORM_REGEXP.blur, "")
	.option("--extract [param]", Chalk.blueBright(ACTION_TEXT.tExtract), TRANSFORM_REGEXP.extract, "")
	.option("--flip [param]", Chalk.blueBright(ACTION_TEXT.tFlip), TRANSFORM_REGEXP.flip, "")
	.option("--flop [param]", Chalk.blueBright(ACTION_TEXT.tFlop), TRANSFORM_REGEXP.flop, "")
	.option("--format [param]", Chalk.blueBright(ACTION_TEXT.tFormat), TRANSFORM_REGEXP.format, "")
	.option("--grayscale [param]", Chalk.blueBright(ACTION_TEXT.tGrayscale), TRANSFORM_REGEXP.grayscale, "")
	.option("--negate [param]", Chalk.blueBright(ACTION_TEXT.tNegate), TRANSFORM_REGEXP.negate, "")
	.option("--normalise [param]", Chalk.blueBright(ACTION_TEXT.tNormalise), TRANSFORM_REGEXP.normalise, "")
	.option("--resize [param]", Chalk.blueBright(ACTION_TEXT.tResize), TRANSFORM_REGEXP.resize, "")
	.option("--rotate [param]", Chalk.blueBright(ACTION_TEXT.tRotate), TRANSFORM_REGEXP.rotate, "")
	.option("--sharpen [param]", Chalk.blueBright(ACTION_TEXT.tSharpen), TRANSFORM_REGEXP.sharpen, "")
	.description(Chalk.blueBright(ACTION_TEXT.transform))
	.action((cmd, env) => AutoBin("transform", cmd, env));
// 帮助
Commander.parse(process.argv);