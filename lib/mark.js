const Path = require("path");
const Sharp = require("sharp");
const TextToSvg = require("text-to-svg");
const Ora = require("ora");
const { CreateDir, RemoveDir } = require("trample/node");

const { MARK_TEXT } = require("../i18n");
const { MarkAnswer } = require("../pipe");
const { OUTPUT_DIR } = require("../util/getting");
const { FilterImg, FormatExt, ShowTitle } = require("../util/setting");

async function MarkImg(path, opts = {}) {
	const { markBlend, markColor, markGravity, markLeft, markSize, markText, markTop } = opts;
	const ddir = Path.join(OUTPUT_DIR.mark, path.replace(Path.basename(path), ""));
	const dpath = Path.join(OUTPUT_DIR.mark, FormatExt(path));
	CreateDir(ddir);
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
	try {
		await Sharp(path).composite([composeOpt]).toFile(dpath);
		return Promise.resolve(MARK_TEXT.completed(path, markText));
	} catch (err) {
		return Promise.resolve(MARK_TEXT.failed(path, err));
	}
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
	const promises = FilterImg().map(v => MarkImg(v, answer));
	const spinner = Ora(MARK_TEXT.loading).start();
	Promise.all(promises).then(res => {
		spinner.stop();
		res.forEach(v => console.log(v));
	});
};