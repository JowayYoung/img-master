const Fs = require("fs");
const Https = require("https");
const Path = require("path");
const Url = require("url");
const Glob = require("glob");
const { CreateDir, RemoveDir } = require("trample/node");

const { COMPRESS_TEXT } = require("../i18n");
const { EXTS, MAX_SIZE, OUTPUT_DIR } = require("../util/getting");
const { RandomHeader, ShowTitle } = require("../util/setting");

function CompressImg(path) {
	const spath = Path.normalize(path);
	const file = Fs.readFileSync(spath, "binary");
	const opts = RandomHeader();
	const req = Https.request(opts, res => {
		res.on("data", data => {
			const obj = JSON.parse(data.toString());
			obj.error
				? console.log(COMPRESS_TEXT.compressFailed(path, obj.message))
				: DownloadImg(path, obj);
		});
	});
	req.write(file, "binary");
	req.on("error", e => console.log(COMPRESS_TEXT.compressReqFailed(path, e)));
	req.end();
}

function DownloadImg(path, obj) {
	const dpath = Path.normalize(Path.join(OUTPUT_DIR, path));
	const ddir = Path.normalize(dpath.replace(Path.basename(dpath), ""));
	const opts = new Url.URL(obj.output.url);
	const req = Https.request(opts, res => {
		let file = "";
		res.setEncoding("binary");
		res.on("data", chunk => file += chunk);
		res.on("end", () => {
			!Fs.existsSync(ddir) && CreateDir(ddir);
			Fs.writeFileSync(dpath, file, "binary");
			console.log(COMPRESS_TEXT.downloadSuccessed(path, obj));
		});
	});
	req.on("error", e => console.log(COMPRESS_TEXT.downloadReqFailed(path, e)));
	req.end();
}

module.exports = async function() {
	ShowTitle("compress");
	RemoveDir(OUTPUT_DIR);
	CreateDir(OUTPUT_DIR);
	Glob.sync(`**/*.{${EXTS.join(",")}}`).forEach(v => {
		const stat = Fs.statSync(v);
		stat.size <= MAX_SIZE && stat.isFile() && CompressImg(v);
	});
};