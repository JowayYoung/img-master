const Fs = require("fs");
const Path = require("path");
const ImageSize = require("image-size");
const { CreateDir, RandomId, RemoveDir } = require("trample/node");

const { GROUP_TEXT } = require("../i18n");
const { GroupAnswer } = require("../pipe");
const { OUTPUT_DIR, VOLUME_RANGE } = require("../util/getting");
const { FilterImg, FormatExt, ShowTitle } = require("../util/setting");

const typeDir = {
	jpg: Path.join(OUTPUT_DIR.group, "jpg"),
	png: Path.join(OUTPUT_DIR.group, "png")
};

const volumeDir = {
	big: Path.join(OUTPUT_DIR.group, "big"),
	middle: Path.join(OUTPUT_DIR.group, "middle"),
	small: Path.join(OUTPUT_DIR.group, "small")
};

const groupMap = {
	size: GroupImgForSize,
	type: GroupImgForType,
	volume: GroupImgForVolume
};

function CopyFile(path, ddir) {
	const dpath = Path.join(ddir, FormatExt(Path.basename(path)));
	CreateDir(ddir);
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

function GroupImgForVolume(path) {
	const { size } = Fs.statSync(path);
	const volume = size < VOLUME_RANGE.small ? "small" : size >= VOLUME_RANGE.big ? "big" : "middle";
	const ddir = volumeDir[volume];
	CopyFile(path, ddir);
}

function GroupImgForSize(path) {
	const { height, width } = ImageSize(path);
	const ddir = Path.join(OUTPUT_DIR.group, `${width}x${height}`);
	CopyFile(path, ddir);
}

function GroupImgForType(path) {
	const ext = Path.extname(path).replace(/(^\.|e)/ig, "").toLowerCase();
	const ddir = typeDir[ext];
	CopyFile(path, ddir);
}

module.exports = async function() {
	ShowTitle("group");
	const { group = "" } = await GroupAnswer();
	RemoveDir(OUTPUT_DIR.group);
	CreateDir(OUTPUT_DIR.group);
	FilterImg().forEach(v => groupMap[group](v));
	console.log(GROUP_TEXT[`${group}Completed`]);
};