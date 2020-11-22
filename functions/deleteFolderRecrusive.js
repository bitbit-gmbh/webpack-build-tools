const fs = require('fs');
const Path = require('path');

const deleteFolderRecursive = (path) => {
	if (!path) return null;

	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach((file, index) => {
			const curPath = Path.join(path, file);
			if (fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
}

module.exports = deleteFolderRecursive;
