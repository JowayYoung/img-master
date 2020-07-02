const Fs = require("fs");
const Path = require("path");
const Sharp = require("sharp");
const { CreateDir, RemoveDir } = require("trample/node");

const { TRANSFORM_TEXT } = require("../i18n");
const { OUTPUT_DIR, TRANSFORM_OPTS } = require("../util/getting");
const { FilterImg, ShowTitle } = require("../util/setting");

function FormatExtract(extract = "") {
	const params = extract.split(",").filter(Boolean);
	if (params.length < 4) return "";
	const [left, top, width, height] = extract.split(",");
	return { height: +height, left: +left, top: +top, width: +width };
}

function FormatOpts(args = [], opts = {}) {
	const tgtArgs = [...new Set(args.slice(1).filter(v => TRANSFORM_OPTS.includes(v)).map(v => v.match(/[a-z]{1}/)[0]))];
	const queue = tgtArgs.reduce((t, v) => (opts[v].val && t.push(Object.assign({ name: v, ...opts[v] })), t), []);
	return queue;
}

function FormatResize(size = "") {
	const params = size.split(",").filter(Boolean);
	if (params.length < 3) return "";
	const [width, height, fit] = size.split(",");
	return {
		fit,
		height: height === "0" ? null : +height,
		width: height === "0" ? null : +width
	};
}

function TransformImg(path = "", cmds = []) {
	const dpath = Path.join(OUTPUT_DIR.transform, path);
	const ddir = dpath.replace(Path.basename(path), "");
	!Fs.existsSync(ddir) && CreateDir(ddir);
	const sharp = cmds.reduce((t, v) => {
		if (v.name === "f" && v.val === "jpg") {
			return t[v.cmd]("jpeg");
		}
		return t[v.cmd](v.val);
	}, Sharp(path));
	let result = null;
	const formatOpt = cmds.find(v => v.name === "f");
	if (formatOpt) {
		const list = Path.basename(path).split(".");
		list.pop();
		const name = list.concat(formatOpt.val).join(".");
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
	const opts = {
		e: { cmd: "extract", val: FormatExtract(cmd.extract) },
		f: { cmd: "toFormat", val: cmd.format },
		r: { cmd: "resize", val: FormatResize(cmd.resize) }
	};
	const cmds = FormatOpts(cmd.parent.args, opts);
	if (!cmds.length) {
		return console.log(TRANSFORM_TEXT.transformEmpty);
	}
	RemoveDir(OUTPUT_DIR.transform);
	CreateDir(OUTPUT_DIR.transform);
	FilterImg().forEach(v => TransformImg(v, cmds));
};