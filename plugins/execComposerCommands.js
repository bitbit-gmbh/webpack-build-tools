const log = require('signale');

class ExecComposerCommands {
	constructor(options) {
		if(options.devMode){
			return;
		}
	}

	apply(compiler) {
		compiler.hooks.environment.tap('Execute composer dumpautoload command', (
		  stats
		) => {
			if(!this.devMode) {
				const execSync = require('child_process').execSync;
				log.info('run composer dumpautoload');
				execSync( 'composer dumpautoload --no-dev', { stdio: [ 0, 1, 2 ] } );
			}
		});
	}
}

module.exports = ExecComposerCommands;
