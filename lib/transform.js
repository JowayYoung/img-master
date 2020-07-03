const Fs = require("fs");
const Path = require("path");
const Sharp = require("sharp");
const { CreateDir, IsArray, RemoveDir } = require("trample/node");

const { TRANSFORM_TEXT } = require("../i18n");
const { OUTPUT_DIR, TRANSFORM_OPTS } = require("../util/getting");
const { FilterImg, FormatExt, ShowTitle } = require("../util/setting");

function FormatExtract(param = "") {
	if (!param) return "";
	const [left, top, width, height] = param.split(",");
	return { height: +height, left: +left, top: +top, width: +width };
}

function FormatFormat(param = "") {
	if (!param) return "";
	return param === "jpg" ? "jpeg" : param;
}

function FormatOpts(cmd = {}) {
	const cmds = {
		extract: { cmd: "extract", val: FormatExtract(cmd.extract) },
		format: { cmd: "toFormat", val: FormatFormat(cmd.format) },
		resize: { cmd: "resize", val: FormatResize(cmd.resize) },
		rotate: { cmd: "rotate", val: FormatRotate(cmd.rotate) }
	};
	const args = [...new Set(cmd.parent.args.slice(1).filter(v => TRANSFORM_OPTS.includes(v)).map(v => v.replace(/^--/g, "")))];
	const queue = args.reduce((t, v) => (cmds[v].val && t.push({ name: v, ...cmds[v] }), t), []);
	console.log(args, JSON.stringify(queue, null, 2));
	return queue;
}

function FormatResize(param = "") {
	if (!param) return "";
	const [width, height, fit = "cover"] = param.split(",");
	return {
		fit,
		height: height === "0" ? null : +height,
		width: height === "0" ? null : +width
	};
}

function FormatRotate(param = "") {
	if (!param) return "";
	const [angle, bgcolor = "#fff"] = param.split(",");
	return [+angle, { background: bgcolor }];
}

function TransformImg(path = "", cmds = []) {
	const ddir = Path.join(OUTPUT_DIR.transform, path.replace(Path.basename(path), ""));
	const dpath = Path.join(OUTPUT_DIR.transform, FormatExt(path));
	!Fs.existsSync(ddir) && CreateDir(ddir);
	const sharp = cmds.reduce((t, v) => IsArray(v.val) ? t[v.cmd](...v.val) : t[v.cmd](v.val), Sharp(path));
	let result = null;
	const { val: type } = cmds.find(v => v.name === "format") || {};
	if (type) {
		const list = Path.basename(path).split(".");
		list.pop();
		const name = list.concat(type === "jpeg" ? "jpg" : type).join(".");
		const _dpath = dpath.replace(Path.basename(path), name);
		result = sharp.toFile(_dpath);
	} else {
		result = sharp.toFile(dpath);
	}
	result.then(obj => console.log(TRANSFORM_TEXT.transformCompleted(path, obj)))
		.catch(err => console.log(TRANSFORM_TEXT.transformFailed(path, err)));
}

module.exports = async function(cmd) {
	ShowTitle("transform");
	const cmds = FormatOpts(cmd);
	if (!cmds.length) {
		return console.log(TRANSFORM_TEXT.transformEmpty);
	}
	RemoveDir(OUTPUT_DIR.transform);
	CreateDir(OUTPUT_DIR.transform);
	FilterImg().forEach(v => TransformImg(v, cmds));
};