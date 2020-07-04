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
	blur: /^(0|(\d+))(\.\d+)?$/,
	extract: /^[\d]{1,},[\d]{1,},[\d]{1,},[\d]{1,}$/,
	flip: /^true$/,
	flop: /^true$/,
	format: /^(jpg|png)$/,
	grayscale: /^true$/,
	negate: /^true$/,
	normalise: /^true$/,
	resize: /^[\d]{1,},[\d]{1,}(,(cover|contain|fill|inside|outside))?$/,
	rotate: /^-?[\d]{1,}(,(transparent|#[0-9a-f]{3}|#[0-9a-f]{6}|rgba\([\d]{1,3},[\d]{1,3},[\d]{1,3}(,(0\.[\d]{1,2}|1))?\)))?$/,
	sharpen: /^true$|^((0|(\d+))(\.\d+)?)(,(0|(\d+))(\.\d+)?)?(,(0|(\d+))(\.\d+)?)?$/
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
	"--blur",
	"--extract",
	"--flip",
	"--flop",
	"--format",
	"--grayscale",
	"--negate",
	"--normalise",
	"--resize",
	"--rotate",
	"--sharpen"
];

const TRANSFORM_REGEXP = {
	blur(val = "") {
		return REGEXP.blur.test(val) && +val >= 0.3 && +val <= 1000 ? +val : "";
	},
	extract(val = "") {
		if (!REGEXP.extract.test(val)) return "";
		const [left, top, width, height] = val.split(",").map(v => +v);
		return { height, left, top, width };
	},
	flip(val) {
		return REGEXP.flip.test(val) ? true : "";
	},
	flop(val) {
		return REGEXP.flop.test(val) ? true : "";
	},
	format(val = "") {
		return REGEXP.format.test(val) ? val : "";
	},
	grayscale(val = "") {
		return REGEXP.grayscale.test(val) ? true : "";
	},
	negate(val = "") {
		return REGEXP.negate.test(val) ? true : "";
	},
	normalise(val = "") {
		return REGEXP.normalise.test(val) ? true : "";
	},
	resize(val = "") {
		if (!REGEXP.resize.test(val)) return "";
		const [width, height, fit = "cover"] = val.split(",").map(v => +v);
		return {
			fit,
			height: height === 0 ? null : +height,
			width: width === 0 ? null : +width
		};
	},
	rotate(val = "") {
		if (!REGEXP.rotate.test(val)) return "";
		const [angle, bgcolor = "#fff"] = val.split(",");
		return [+angle, { background: bgcolor }];
	},
	sharpen(val = "") {
		if (!REGEXP.sharpen.test(val)) return "";
		if (val === "true") return "true";
		const [sigama, flat = 1, jagged = 2] = val.split(",").map(v => +v);
		if (sigama < 0.3 || sigama > 1000 || !flat || !jagged) return "";
		return [sigama, flat, jagged];
	}
};

module.exports = {
	EXTS,
	MAX_SIZE,
	OUTPUT_DIR,
	REGEXP,
	SIZE_RANGE,
	TINYIMG,
	TRANSFORM_OPTS,
	TRANSFORM_REGEXP
};