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
	compress: "#compressed-dist#",
	group: "#grouped-dist#",
	transform: "#transformed-dist#"
};

const REGEXP = {
	extract: /^[\d]{1,},[\d]{1,},[\d]{1,},[\d]{1,}$/g,
	format: /^(jpg|png)$/ig,
	resize: /^[\d]{1,},[\d]{1,},(cover|contain|fill|inside|outside)$/g
};

const SIZE_RANGE = {
	big: 1024 * 100,
	small: 1024 * 10
};

const TINYIMG = [
	"tinyjpg.com",
	"tinypng.com"
];

const TRANSFORM_OPTS = [
	"-e",
	"--extract",
	"-f",
	"--format",
	"-r",
	"--resize"
];

module.exports = {
	EXTS,
	MAX_SIZE,
	OUTPUT_DIR,
	REGEXP,
	SIZE_RANGE,
	TINYIMG,
	TRANSFORM_OPTS
};