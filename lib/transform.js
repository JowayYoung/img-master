const Fs = require("fs");
const Path = require("path");
const Sharp = require("sharp");
const { CreateDir, RemoveDir } = require("trample/node");

const { TRANSFORM_TEXT } = require("../i18n");
const { OUTPUT_DIR, TRANSFORM_OPTS } = require("../util/getting");
const { FilterImg, FormatExt, ShowTitle } = require("../util/setting");

function FormatOpts(cmd = {}) {
	const cmds = {
		blur: { cmd: "blur", val: cmd.blur },
		extract: { cmd: "extract", val: cmd.extract },
		flip: { cmd: "flip", val: cmd.flip },
		flop: { cmd: "flop", val: cmd.flop },
		format: { cmd: "toFormat", val: cmd.format },
		grayscale: { cmd: "grayscale", val: cmd.grayscale },
		negate: { cmd: "negate", val: cmd.negate },
		normalise: { cmd: "normalise", val: cmd.normalise },
		resize: { cmd: "resize", val: cmd.resize },
		rotate: { cmd: "rotate", val: cmd.rotate },
		sharpen: { cmd: "sharpen", val: cmd.sharpen }
	};
	const args = [...new Set(cmd.parent.args.slice(1).filter(v => TRANSFORM_OPTS.includes(v)).map(v => v.replace(/^--/, "")))];
	const queue = args.reduce((t, v) => (cmds[v].val && t.push({ name: v, ...cmds[v] }), t), []);
	return queue;
}

function TransformImg(path = "", cmds = []) {
	const ddir = Path.join(OUTPUT_DIR.transform, path.replace(Path.basename(path), ""));
	const dpath = Path.join(OUTPUT_DIR.transform, FormatExt(path));
	!Fs.existsSync(ddir) && CreateDir(ddir);
	const sharp = cmds.reduce((t, v) => Array.isArray(v.val)
		? t[v.cmd](...v.val)
		: v.val === "true" ? t[v.cmd]() : t[v.cmd](v.val)
	, Sharp(path));
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