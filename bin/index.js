#!/usr/bin/env node

const Chalk = require("chalk");
const Commander = require("commander");

const { version } = require("../package");
const { ACTION_TEXT, GLOB_TEXT } = require("../i18n");
const { REGEXP } = require("../util/getting");
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
	.option("--extract [param]", "裁剪尺寸", REGEXP.extract, "")
	.option("--format [param]", "输出格式", REGEXP.format, "")
	.option("--resize [param]", "重置尺寸", REGEXP.resize, "")
	.option("--rotate [param]", "重置尺寸", REGEXP.rotate, "")
	.description(Chalk.blueBright(ACTION_TEXT.transform))
	.action((cmd, env) => AutoBin("transform", cmd, env));

// 帮助
Commander.parse(process.argv);