const log = require('signale');
const Path = require('path');
const fs = require('fs');
const BuildController = require('../controller');

class ExecGitCommands {
	constructor(options) {
		if(!options.filesToCommit || !options.filesToRemove || !options.version || options.devMode){
			return;
		}

		this.filesToCommit = options.filesToCommit.join(' ');
		this.filesToRemove = options.filesToRemove.join(' ');

		this.version = options.version;
		this.lastDistPath = this.version.lastDistPath.replace('./', '');
		this.currentDistPath = this.version.currentDistPath.replace('./', '');
	}

	apply(compiler) {
		if(!this.filesToCommit || !this.filesToRemove || !this.version || (this.lastDistPath === this.currentDistPath)){
			return;
		}

		compiler.hooks.environment.tap('Execute add current dist git command', (
		  stats /* stats is passed as an argument when done hook is tapped.  */
		) => {
			const execSync = require('child_process').execSync;
			log.info('run git command: git remove ' + this.lastDistPath);
			execSync('git rm -r -f ' + this.lastDistPath, { stdio:[0, 1, 2] });

			if(!this.devMode) {
				const gitCommit = 'git commit ' + this.lastDistPath + ' -m "remove version: ' + this.lastDistPath + '"';
				execSync( gitCommit, { stdio: [ 0, 1, 2 ] } );
			}
		});

		compiler.hooks.done.tap('Execute add current dist git command', (
		  stats /* stats is passed as an argument when done hook is tapped.  */
		) => {
			const execSync = require('child_process').execSync;
			log.info('run git command: git add ' + this.currentDistPath);
			execSync('git add ' + this.currentDistPath, { stdio:[0, 1, 2] });

			const gitCommit = 'git commit ' + this.filesToCommit + ' -m "update to version: ' + this.currentDistPath +'"';
			execSync( gitCommit, { stdio: [ 0, 1, 2 ] } );
		});
	}
}

module.exports = ExecGitCommands;
