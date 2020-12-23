const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const ExtraWatchWebpackPlugin  = require( 'extra-watch-webpack-plugin' );
const BuildController = require('./vendor/web-dev-media/webpack-build-tools/controller');
const ExecGitCommands = require('./vendor/web-dev-media/webpack-build-tools/plugins/execGitCommands');
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const FileManagerPlugin = require('filemanager-webpack-plugin');
const packageBuildConfig = require('./package.config');
const log = require('signale');
const path = require('path');
const argv = require('yargs').argv;

const asyncWebpackConfig = async () => {
	const DEV_MODE = argv.mode !== 'production';
	const PLUGIN_NAME = path.basename(path.resolve('./'));

	const version = await BuildController.versionHash( {
		versionTag: argv.tag || null,
		distPath: "./assets/dist/"
	} );

	log.info( 'Plugin build started - version: ' + version.current );

	await BuildController.prepare({
		version: version
	});

	const WP_CONTENT_DIR = '/wp-content/plugins/';
	const CURRENT_DIST_PATH = version.currentDistPath;
	const CURRENT_PUBLIC_PATH = WP_CONTENT_DIR + path.basename(__dirname) + version.currentDistPath.replace('./', '/');

	return {
		mode: 'development',
		entry: {
			'allergieausweis-api-request': [ './assets/webpack.import.js']
		},
		output: {
			path: path.resolve(__dirname, CURRENT_DIST_PATH),
			filename: '[name].bundle.js',
			chunkFilename: '[name].chunk.js',
			publicPath: CURRENT_PUBLIC_PATH
		},
		devtool: "eval-cheap-module-source-map",
		optimization: {
			minimize: true,
			minimizer: [new TerserPlugin({
				terserOptions: {
					parse: {
						ecma: 8
					},
					compress: {
						ecma       : 5,
						warnings   : false,
						comparisons: false,
						inline     : 2
					},
					mangle: {
						safari10: true
					},
					output: {
						ecma      : 5,
						comments  : false,
						ascii_only: true
					}
				},
				cache: true,
				parallel: true,
				sourceMap: true,
			}),
				new CssMinimizerPlugin()
			]
		},
		module: {rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react']
					}
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/,
					use: [
						{
							loader: "url-loader",
							options: {
								name: "[name].[ext]",
								outputPath: "fonts/"
							}
						}
					]
				},
				{
					test: /\.(png|jpg|jpeg|gif|webp|svg)$/,
					use: [
						{
							loader: "url-loader",
							options: {
								name: "[name].[ext]",
								outputPath: "/img"
							}
						}
					]
				},
				{
					test: /\.(sa|sc|c)ss$/,
					use: [
						MiniCssExtractPlugin.loader,
						"css-loader",
						"postcss-loader",
						"sass-loader?sourceMap"
					]
				}
			]},
		plugins: [
			BuildController.writeVersionLogFile(version),
			new MiniCssExtractPlugin({
				filename: DEV_MODE ? '[name].css' : '[name].css',
				chunkFilename: DEV_MODE ? '[name].css' : '[name].css'
			}),
			new DependencyExtractionWebpackPlugin( {
				injectPolyfill: true,
				version: version.current
			}),
			new ExecGitCommands({
				version: version,
				devMode: DEV_MODE,
				filesToCommit: [
					'package.json',
					'index.php',
					'assets/dist/.version',
					version.currentDistPath.replace('./', '')
				],
				filesToRemove: [
					version.currentDistPath
				]
			}),
			new FileManagerPlugin(packageBuildConfig(version, DEV_MODE, PLUGIN_NAME)),
			new ExtraWatchWebpackPlugin({
				files: [ 'inc/**/*.php', 'inc/**/*.json' ],
			}),
		]
	}
}

module.exports = asyncWebpackConfig;
