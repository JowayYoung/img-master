const Path = require("path");
const Sharp = require("sharp");
const Ora = require("ora");
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

async function TransformImg(path, opts = []) {
	const ddir = Path.join(OUTPUT_DIR.transform, path.replace(Path.basename(path), ""));
	const dpath = Path.join(OUTPUT_DIR.transform, FormatExt(path));
	CreateDir(ddir);
	const sharp = opts.reduce((t, v) => Array.isArray(v.val)
		? t[v.cmd](...v.val)
		: v.val === "true" ? t[v.cmd]() : t[v.cmd](v.val)
	, Sharp(path).withMetadata());
	const { val: type } = opts.find(v => v.name === "format") || {};
	try {
		let obj = null;
		if (type) {
			const list = Path.basename(path).split(".");
			list.pop();
			const name = list.concat(type === "jpeg" ? "jpg" : type).join(".");
			const _dpath = dpath.replace(Path.basename(path), name);
			obj = await sharp.toFile(_dpath);
		} else {
			obj = await sharp.toFile(dpath);
		}
		return Promise.resolve(TRANSFORM_TEXT.completed(path, obj));
	} catch (err) {
		return Promise.resolve(TRANSFORM_TEXT.failed(path, err));
	}
}

module.exports = async function(cmd) {
	ShowTitle("transform");
	const opts = FormatOpts(cmd);
	if (!opts.length) {
		return console.log(TRANSFORM_TEXT.empty);
	}
	RemoveDir(OUTPUT_DIR.transform);
	CreateDir(OUTPUT_DIR.transform);
	const promises = FilterImg().map(v => TransformImg(v, opts));
	const spinner = Ora(TRANSFORM_TEXT.loading).start();
	Promise.all(promises).then(res => {
		spinner.stop();
		res.forEach(v => console.log(v));
	});
};