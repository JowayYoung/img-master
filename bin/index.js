#!/usr/bin/env node

const Chalk = require("chalk");
const Commander = require("commander");

const { version } = require("../package");
const { ACTION_TEXT, GLOB_TEXT } = require("../i18n");
const { TRANSFORM_TEST } = require("../util/getting");
const { AutoBin } = require("../util/setting");

// 版本和用法
Commander
	.usage(Chalk.yellowBright("<command> [option]"))
	.version(version, "-v, --version", Chalk.greenBright(GLOB_TEXT.version))
	.helpOption("-h, --help", Chalk.greenBright(GLOB_TEXT.help))
	.description(GLOB_TEXT.desc);
// 压缩图像
Commander
	.command("compress")
	.alias("c")
	.description(Chalk.blueBright(ACTION_TEXT.compress))
	.action(() => AutoBin("compress"));
// 分组图像
Commander
	.command("group")
	.alias("g")
	.description(Chalk.blueBright(ACTION_TEXT.group))
	.action(() => AutoBin("group"));
// 标记图像
Commander
	.command("mark")
	.alias("m")
	.description(Chalk.blueBright(ACTION_TEXT.mark))
	.action(() => AutoBin("mark"));
// 变换图像
Commander
	.command("transform")
	.alias("t")
	.option("--blur [param]", Chalk.blueBright(ACTION_TEXT.transformBlur), TRANSFORM_TEST.blur, "")
	.option("--extract [param]", Chalk.blueBright(ACTION_TEXT.transformExtract), TRANSFORM_TEST.extract, "")
	.option("--flip [param]", Chalk.blueBright(ACTION_TEXT.transformFlip), TRANSFORM_TEST.flip, "")
	.option("--flop [param]", Chalk.blueBright(ACTION_TEXT.transformFlop), TRANSFORM_TEST.flop, "")
	.option("--format [param]", Chalk.blueBright(ACTION_TEXT.transformFormat), TRANSFORM_TEST.format, "")
	.option("--grayscale [param]", Chalk.blueBright(ACTION_TEXT.transformGrayscale), TRANSFORM_TEST.grayscale, "")
	.option("--negate [param]", Chalk.blueBright(ACTION_TEXT.transformNegate), TRANSFORM_TEST.negate, "")
	.option("--normalise [param]", Chalk.blueBright(ACTION_TEXT.transformNormalise), TRANSFORM_TEST.normalise, "")
	.option("--resize [param]", Chalk.blueBright(ACTION_TEXT.transformResize), TRANSFORM_TEST.resize, "")
	.option("--rotate [param]", Chalk.blueBright(ACTION_TEXT.transformRotate), TRANSFORM_TEST.rotate, "")
	.option("--sharpen [param]", Chalk.blueBright(ACTION_TEXT.transformSharpen), TRANSFORM_TEST.sharpen, "")
	.description(Chalk.blueBright(ACTION_TEXT.transform))
	.action((cmd, env) => AutoBin("transform", cmd, env));
// 帮助
Commander.parse(process.argv);