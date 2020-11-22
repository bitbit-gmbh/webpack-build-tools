const fs = require('fs');
const path = require('path');
const log = require('signale');

const writePackageVersion = (version) => {
	const FILE_NAME= 'package.json';
	const packagePath = path.resolve('./', FILE_NAME);

	if (fs.existsSync(packagePath)) {
		fs.readFile( packagePath, 'utf8', (err, data) => {
			if (err) throw err;
			data = new Uint8Array(Buffer.from(data.replace(/"version": "(.*?)",\n/g, '"version": "' + version + '",\n')));
			fs.writeFile(packagePath, data, (err) => {
				if (err) throw err;
				log.info(FILE_NAME + ' version updated.' );
			});
		});
	}
}

module.exports = writePackageVersion;
