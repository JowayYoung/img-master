const Fs = require("fs");
const Path = require("path");
const Sharp = require("sharp");
const TextToSvg = require("text-to-svg");
const { CreateDir, RemoveDir } = require("trample/node");

const { MARK_TEXT } = require("../i18n");
const { MarkAnswer } = require("../pipe");
const { OUTPUT_DIR } = require("../util/getting");
const { FilterImg, FormatExt, ShowTitle } = require("../util/setting");

function MarkImg(path = "", opts = {}) {
	const { markBlend, markColor, markGravity, markLeft, markSize, markText, markTop } = opts;
	const ddir = Path.join(OUTPUT_DIR.mark, path.replace(Path.basename(path), ""));
	const dpath = Path.join(OUTPUT_DIR.mark, FormatExt(path));
	!Fs.existsSync(ddir) && CreateDir(ddir);
	const composeOpt = Object.assign({
		blend: markBlend,
		input: ParseText({
			color: markColor,
			size: markSize,
			text: markText
		})
	}, markGravity === "none" ? {
		left: +markLeft,
		top: +markTop
	} : { gravity: markGravity });
	Sharp(path).composite([composeOpt]).toFile(dpath)
		.then(obj => console.log(MARK_TEXT.markCompleted(path, markText)))
		.catch(err => console.log(MARK_TEXT.markFailed(path, err)));
}

function ParseText({ color, size, text }) {
	const t2s = TextToSvg.loadSync();
	const opts = {
		anchor: "top",
		attributes: { fill: color },
		fontSize: +size
	};
	const svg = t2s.getSVG(text, opts);
	return Buffer.from(svg);
}

module.exports = async function() {
	ShowTitle("mark");
	const answer = await MarkAnswer();
	RemoveDir(OUTPUT_DIR.mark);
	CreateDir(OUTPUT_DIR.mark);
	FilterImg().forEach(v => MarkImg(v, answer));
};