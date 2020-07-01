#!/usr/bin/env node

const Chalk = require("chalk");
const Commander = require("commander");

const { version } = require("../package");
const { ACTION_TEXT, GLOB_TEXT } = require("../i18n");
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

// 帮助
Commander.parse(process.argv);