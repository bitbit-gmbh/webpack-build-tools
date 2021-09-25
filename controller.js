const VersionHash = require( './factories/versionHash' );
const deleteFolderRecursive = require( './functions/deleteFolderRecrusive' );
const writeWordPressStylesVersion = require( './functions/writeWordPressPluginVersion' );
const writePackageVersion = require( './functions/writePackageVersion' );
const AssetsPlugin = require( 'assets-webpack-plugin' );
const fs = require('fs');
const Path = require('path');

/**
 * Provides some functional functions for the build
 * @namespace Controller
 */
const Controller = {

	/**
	 * Async greate a build version hash
	 * @param {Object} config
	 * @return {Object}
	 */
	versionHash: async (config) => {
		config = config || {};
		return VersionHash( {
			distPath: config.distPath ||  './assets/dist/',
			versionTag: config.versionTag,
			dotVersionFilename: config.dotVersionFilename,
		} );
	},

	/**
	 * Async webpack build prepare,
	 * @param {Object} version
	 * @return void
	 */
	prepare: async ( options ) => {
		options = options || {};

		_options = {
			version: options.version || null
		};

		if (!fs.existsSync(_options.version.distPath)) {
			fs.mkdirSync(Path.resolve(_options.version.distPath));
		}

		let distPath = _options.version.distPath + _options.version.last;

		await Controller.writeWordPressPluginVersion( _options.version.current );
		await writePackageVersion( _options.version.current );

		await Controller.deleteLastBuildFolder(_options.version.lastDistPath)
	},

	/**
	 * Async delete last build folder
	 * @return void|null
	 */
	deleteLastBuildFolder: async ( lastDistPath ) => {
		if ( !lastDistPath ) {
			return null;
		}

		deleteFolderRecursive( lastDistPath );
	},


	/**
	 * Creates a .version file at the dist folder
	 * @param version
	 * @return {String} current version
	 */
	writeVersionLogFile: ( version ) => {
		return new AssetsPlugin( {
			processOutput: function( assets ) {
				return version.current;
			},
			filename: version.dotVersionFilePath,
		} )
	},

	writeWordPressPluginVersion: async ( version ) => {
		if ( !version ) {
			return null;
		}

		writeWordPressStylesVersion( version, 'index.php' );
	},
}

module.exports = Controller;
