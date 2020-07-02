const Fs = require("fs");
const Ora = require("ora");
const Path = require("path");
const ImageSize = require("image-size");
const { CreateDir, RandomId, RemoveDir } = require("trample/node");

const { GROUP_TEXT } = require("../i18n");
const { GroupAnswer } = require("../pipe");
const { OUTPUT_DIR, SIZE_RANGE } = require("../util/getting");
const { FilterImg, ShowTitle } = require("../util/setting");

const rangDir = {
	big: Path.join(OUTPUT_DIR.group, "big"),
	middle: Path.join(OUTPUT_DIR.group, "middle"),
	small: Path.join(OUTPUT_DIR.group, "small")
};

const typeDir = {
	jpg: Path.join(OUTPUT_DIR.group, "jpg"),
	png: Path.join(OUTPUT_DIR.group, "png")
};

const fnMap = {
	range: GroupForRange,
	size: GroupForSize,
	type: GroupForType
};

function CopyFile(path, ddir) {
	const dpath = Path.join(ddir, Path.basename(path));
	!Fs.existsSync(ddir) && CreateDir(ddir);
	if (Fs.existsSync(dpath)) {
		const list = Path.basename(path).split(".");
		const ext = list.pop();
		const name = list.concat(RandomId(4), ext).join(".");
		const _dpath = dpath.replace(Path.basename(path), name);
		Fs.createReadStream(path).pipe(Fs.createWriteStream(_dpath));
	} else {
		Fs.createReadStream(path).pipe(Fs.createWriteStream(dpath));
	}
}

function GroupForRange(path) {
	const { size } = Fs.statSync(path);
	const range = size < SIZE_RANGE.small ? "small" : size >= SIZE_RANGE.big ? "big" : "middle";
	const ddir = rangDir[range];
	CopyFile(path, ddir);
}

function GroupForSize(path) {
	const { height, width } = ImageSize(path);
	const ddir = Path.join(OUTPUT_DIR.group, `${width}x${height}`);
	CopyFile(path, ddir);
}

function GroupForType(path) {
	const ext = Path.extname(path).replace(/(^\.|e)/ig, "").toLowerCase();
	const ddir = typeDir[ext];
	CopyFile(path, ddir);
}

module.exports = async function() {
	ShowTitle("group");
	RemoveDir(OUTPUT_DIR.group);
	CreateDir(OUTPUT_DIR.group);
	const { GROUP = "" } = await GroupAnswer();
	const group = GROUP.toLowerCase();
	const imgs = FilterImg();
	const spinner = Ora(GROUP_TEXT.loading).start();
	imgs.forEach(v => fnMap[group](v));
	spinner.stop();
	console.log(GROUP_TEXT[`${group}GroupSuccessed`]);
};