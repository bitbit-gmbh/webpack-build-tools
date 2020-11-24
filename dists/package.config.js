const glob = require("glob");
const log = require('signale');
const path = require('path');

module.exports = (version, mode, packageName) => {
	const tmpFolder = path.resolve('./', 'package', packageName);
	const archiveFolder = path.resolve('./', 'package');
	const moduleFiles = glob.sync('./src/**/*.php');

	let moduleFilesToCopy = [
		{ source: './dist', destination: tmpFolder + '/dist' },
		{ source: './index.php', destination: tmpFolder + '/index.php' }
	];

	if(moduleFiles.length > 0) {
		moduleFiles.map( ( file, index ) => {
			moduleFilesToCopy.push( {
				source     : file,
				destination: tmpFolder + '/' + file
			} );
		} );
	}

	let deleteObjects = [
		'./package/' + version.last,
		'./package/build-' + version.last + '.tar.gz'
	];

	if(mode === 'development'){
		deleteObjects.push('./package');
	}

	return {
		events: {
			onStart: {
				delete: [archiveFolder]
			},
			onEnd: {
				copy   : moduleFilesToCopy,
				mkdir  : [
					'./package'
				],
				archive: [
					{
						source     : archiveFolder,
						destination: './package/build-' + version.current + '.tar.gz',
						format     : 'tar',
						options    : {
							gzip       : true,
							gzipOptions: {
								level: 1
							},
							globOptions: {
								nomount: true
							}
						}
					}
				],
				delete : deleteObjects
			}
		}
	}
}
