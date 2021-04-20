const log = require('signale');

class ExecComposerCommands {
	constructor(options) {
		if(options.devMode === 'development'){
			return;
		}

		this.devMode = options.devMode;
	}

	apply(compiler) {
		compiler.hooks.environment.tap('Execute composer dumpautoload command', (
		  stats
		) => {
			let mode = '';

			if(!this.devMode) {
				mode = ' --no-dev';
			}

			const execSync = require('child_process').execSync;
			log.info('run composer dumpautoload'  + mode);
			execSync( 'composer dumpautoload' + mode, { stdio: [ 0, 1, 2 ] } );
		});
	}
}

module.exports = ExecComposerCommands;
