const Fs = require("fs");
const Path = require("path");
const ImageSize = require("image-size");
const { CreateDir, RandomId, RemoveDir } = require("trample/node");

const { GROUP_TEXT } = require("../i18n");
const { GroupAnswer } = require("../pipe");
const { OUTPUT_DIR, SIZE_RANGE } = require("../util/getting");
const { FilterImg, ShowTitle } = require("../util/setting");

const TYPE_DIR = {
	jpg: Path.join(OUTPUT_DIR.group, "jpg"),
	png: Path.join(OUTPUT_DIR.group, "png")
};

const RANGE_DIR = {
	big: Path.join(OUTPUT_DIR.group, "big"),
	middle: Path.join(OUTPUT_DIR.group, "middle"),
	small: Path.join(OUTPUT_DIR.group, "small")
};

function CopyFile(path, ddir) {
	const dpath = Path.join(ddir, Path.basename(path));
	!Fs.existsSync(ddir) && CreateDir(ddir);
	if (Fs.existsSync(dpath)) {
		const basename = Path.basename(path).split(".");
		const ext = basename.pop();
		const name = basename.concat(RandomId(4), ext).join(".");
		const _dpath = dpath.replace(Path.basename(path), name);
		Fs.createReadStream(path).pipe(Fs.createWriteStream(_dpath));
	} else {
		Fs.createReadStream(path).pipe(Fs.createWriteStream(dpath));
	}
}

function GroupForRange(path) {
	const { size } = Fs.statSync(path);
	const range = size < SIZE_RANGE.small ? "small" : size >= SIZE_RANGE.big ? "big" : "middle";
	const ddir = RANGE_DIR[range];
	CopyFile(path, ddir);
}

function GroupForSize(path) {
	const { height, width } = ImageSize(path);
	const ddir = Path.join(OUTPUT_DIR.group, `${width}x${height}`);
	CopyFile(path, ddir);
}

function GroupForType(path) {
	const ext = Path.extname(path).replace(/(^\.|e)/ig, "").toLowerCase();
	const ddir = TYPE_DIR[ext];
	CopyFile(path, ddir);
}

module.exports = async function() {
	ShowTitle("group");
	RemoveDir(OUTPUT_DIR.group);
	CreateDir(OUTPUT_DIR.group);
	const { GROUP = "" } = await GroupAnswer();
	const group = GROUP.toLowerCase();
	const fn = {
		range: GroupForRange,
		size: GroupForSize,
		type: GroupForType
	}[group];
	FilterImg().forEach(v => {
		const stat = Fs.statSync(v);
		stat.isFile() && fn(v);
	});
	console.log(GROUP_TEXT[`${group}GroupSuccessed`]);
};