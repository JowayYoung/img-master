const EXTS = [
	"jpg",
	"jpeg",
	"png",
	"JPG",
	"JPEG",
	"PNG"
];

const MAX_SIZE = 1024 ** 2 * 5;

const OUTPUT_DIR = {
	compress: "#dist-compress#",
	group: "#dist-group#"
};

const SIZE_RANGE = {
	big: 1024 * 100,
	small: 1024 * 10
};

const TINYIMG = [
	"tinyjpg.com",
	"tinypng.com"
];

module.exports = {
	EXTS,
	MAX_SIZE,
	OUTPUT_DIR,
	SIZE_RANGE,
	TINYIMG
};