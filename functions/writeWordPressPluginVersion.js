const fs = require('fs');
const path = require('path');
const log = require('signale');

const writeWordPressPluginVersion = (version, indexFile) => {
	const FILE_NAME= indexFile;
	const indexPath = path.resolve('./', FILE_NAME);

	if (fs.existsSync(indexPath)) {
		fs.readFile( indexPath, 'utf8', (err, data) => {
			if (err) throw err;
			data = new Uint8Array(Buffer.from(data.replace(/Version: (.*?)(-.*?)?\n/g, 'Version: ' + version + '\n')));
			fs.writeFile(indexPath, data, (err) => {
				if (err) throw err;
				log.info(FILE_NAME + ' version updated.' );
			});
		});
	}
}

module.exports = writeWordPressPluginVersion;
