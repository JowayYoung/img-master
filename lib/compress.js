const Fs = require("fs");
const Https = require("https");
const Path = require("path");
const Url = require("url");
const Ora = require("ora");
const { CreateDir, RemoveDir } = require("trample/node");

const { COMPRESS_TEXT } = require("../i18n");
const { MAX_SIZE, OUTPUT_DIR } = require("../util/getting");
const { FilterImg, FormatExt, RandomHeader, ShowTitle } = require("../util/setting");

async function CompressImg(path) {
	try {
		const obj = await UploadImg(path);
		const data = await DownloadImg(obj.output.url);
		const ddir = Path.join(OUTPUT_DIR.compress, path.replace(Path.basename(path), ""));
		const dpath = Path.join(OUTPUT_DIR.compress, FormatExt(path));
		CreateDir(ddir);
		Fs.writeFileSync(dpath, data, "binary");
		return Promise.resolve(COMPRESS_TEXT.completed(path, obj));
	} catch (err) {
		return Promise.resolve(COMPRESS_TEXT.failed(path, err));
	}
}

function DownloadImg(url) {
	const opts = new Url.URL(url);
	return new Promise((resolve, reject) => {
		const req = Https.request(opts, res => {
			let file = "";
			res.setEncoding("binary");
			res.on("data", chunk => file += chunk);
			res.on("end", () => resolve(file));
		});
		req.on("error", e => reject(e));
		req.end();
	});
}

function UploadImg(path) {
	if (Fs.statSync(path).size >= MAX_SIZE) {
		return console.log(COMPRESS_TEXT.limited(path));
	}
	const file = Fs.readFileSync(path, "binary");
	const opts = RandomHeader();
	return new Promise((resolve, reject) => {
		const req = Https.request(opts, res => res.on("data", data => {
			const obj = JSON.parse(data.toString());
			obj.error ? reject(obj.message) : resolve(obj);
		}));
		req.write(file, "binary");
		req.on("error", e => reject(e));
		req.end();
	});
}

module.exports = async function() {
	ShowTitle("compress");
	RemoveDir(OUTPUT_DIR.compress);
	CreateDir(OUTPUT_DIR.compress);
	const promises = FilterImg().map(v => CompressImg(v));
	const spinner = Ora(COMPRESS_TEXT.loading).start();
	Promise.all(promises).then(res => {
		spinner.stop();
		res.forEach(v => console.log(v));
	});
};