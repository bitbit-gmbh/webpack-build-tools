const fs = require('fs');
const createHash = require( 'object-hash' );
const path = require('path');

/**
 * Create an version object
 * @namespace VersionHashFactory
 */
class VersionHashFactory {
	constructor(){
    	this.config = {
    		distPath: __dirname,
    		dotVersionFilename: null,
    		dotVersionFilePath: __dirname
    	};

    	this.hash = {
    		current: null,
    		last: null
    	};
    }

	/**
	 * Getter for last version hash
	 * @return {Promise} lastHash
	 */
	async getLastHash() {
		let _self = this;
		return new Promise(function(resolve, reject) {
			fs.readFile( path.resolve(_self.distPath, _self.dotVersionFilename), 'utf8', (err, lastHash) => {
				resolve(lastHash);
			});
		});
	}

	/**
	 * Setter for last version hash
	 * @return {Promise} lastHash
	 */
	async setLastHash(){
		this.last = await this.getLastHash().then(lastHash => {
			return lastHash;
		});
	}

	/**
	 * Getter for current version hash
	 * @return {string} currentHash
	 */
	get current() {
		return this.hash.current;
	};

	/**
	 * Setter for current version hash
	 * @param {string} hash
	 */
	set current(hash) {
		this.hash.current = hash;
	};

	/**
	 * Getter for last version hash
	 * @return {string} currentHash
	 */
	get last() {
		return this.hash.last;
	};

	/**
	 * Setter for last version hash
	 * @param {string} hash
	 */
	set last(hash) {
		this.hash.last = hash
	};

	/**
	 * Getter for distPath
	 * @return {string} distPath
	 */
	get distPath() {
		return this.config.distPath;
	};

	/**
	 * Setter for distPath
	 * @param {string} distPath
	 */
	set distPath(distPath) {
		this.config.distPath = distPath;
	};

	/**
	 * Getter for versionTag
	 * @return {string} versionTag
	 */
	get versionTag() {
		return this.config.versionTag;
	};

	/**
	 * Setter for versionTag
	 * @param {string} versionTag
	 */
	set versionTag(versionTag) {
		this.config.versionTag = versionTag;
	};

	/**
	 * Getter for dotVersionFilename
	 * @return {string} dotVersionFilename
	 */
	get dotVersionFilename() {
		return this.config.dotVersionFilename;
	};

	/**
	 * Setter for dotVersionFilename
	 * @param {string} dotVersionFilename
	 */
	set dotVersionFilename(dotVersionFilename) {
		this.config.dotVersionFilename = '.' + dotVersionFilename;
	};

	/**
	 * Getter for dotVersionFilePath
	 * @return {string} dotVersionFilename
	 */
	get dotVersionFilePath() {
		return this.config.dotVersionFilePath;
	};

	/**
	 * Setter for dotVersionFilePath
	 * @param {string} dotVersionFilePath
	 */
	set dotVersionFilePath(dotVersionFilePath) {
		this.config.dotVersionFilePath = dotVersionFilePath;
	};
}

module.exports = async (config) => {
	config = config || {};

	const version = new VersionHashFactory();

	version.distPath = config.distPath ? config.distPath : __dirname;
	version.current = config.versionTag || createHash( Date.now() ).substring( 0, 12 );
	version.dotVersionFilename = config.dotVersionFilename ? config.dotVersionFilename : 'version';
	version.dotVersionFilePath = config.dotVersionFilePath ? config.dotVersionFilePath : config.distPath;

	await version.setLastHash();

	return {
		last: version.last,
		current: version.current,
		distPath: version.distPath,
		currentDistPath: version.distPath + version.current + '/',
		lastDistPath: version.distPath + version.last + '/',
		dotVersionFilePath: version.dotVersionFilePath + version.dotVersionFilename
	};
};
