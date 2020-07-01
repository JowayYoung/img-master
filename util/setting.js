function AutoBin(fn, ...rest) {
	const lib = require(`../lib/${fn}`);
	lib(...rest);
}

function RandomHeader() {
	const ip = new Array(4).fill(0).map(() => parseInt(Math.random() * 255)).join(".");
	return {
		headers: {
			"Cache-Control": "no-cache",
			"Content-Type": "application/x-www-form-urlencoded",
			"Postman-Token": Date.now(),
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
			"X-Forwarded-For": ip
		},
		hostname: "tinypng.com",
		method: "POST",
		path: "/web/shrink",
		rejectUnauthorized: false
	};
}

module.exports = {
	AutoBin,
	RandomHeader
};