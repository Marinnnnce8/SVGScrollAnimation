import fs from 'fs';
import gulp from 'gulp';
import consolidate from 'gulp-consolidate';
import rename from 'gulp-rename';
import getTitle from '../util/getTitle';
import rm from '../util/rm';
import rp from '../util/rp';
import { util as uk } from 'uikit';
import { name as pkgName, version as pkgVersion, config } from '../../package.json';

const scssFolder = `${config.src}/scss`;
const scssFile = 'main.scss';

// Get passed arguments
function getArgs() {
	const argv = process.argv;
	return argv.length <= 4 ? [] : [
		argv[3].replace(/-/g, '').toLowerCase(),
		argv[4].toLowerCase()
	];
}

// Get the destination of the file
function getDest(type, ext) {
	let dest = '';
	switch (type + ext) {
		case 'chbs':
		case 'mhbs':
			dest += 'html/partials/components';
			break;
		case 'cscss':
		case 'mscss':
			dest += 'scss/components';
			break;
		case 'tjson':
			dest += 'html/data';
			break;
		default:
			dest += 'html';
			break;
	}
	return `${config.src}/${dest}`;
}

// Get the name of the file
function getName(name, type, ext) {
	if (isComponent(type) && ext === 'hbs') name = uk.camelize(name);
	return (ext === 'scss' ? '_' : '') + `${name}.${ext}`;
}

// Get the scss import string
function getScssImport(name) {
	return `@import 'components/${name}';\n`;
}

// Is a component being created?
function isComponent(type) {
	return type === 'c' || type === 'm';
}

// Create File(s)
export function cf(cb) {

	const args = getArgs();
	if (!args.length) cb();

	const type = args[0];
	const name = args[1];

	// Create a file
	const create = (ext) => {
		return gulp.src(`build/tpl/${isComponent(type) ? 'partial' : 'template'}-${ext}.txt`)
			.pipe(consolidate('lodash', {
				name: name,
				title: getTitle(name),
			}))
			.pipe(rename(getName(name, type, ext)))
			.pipe(gulp.dest(getDest(type, ext)));
	};

	create('hbs');
	if (isComponent(type)) {
		create('scss');
		// Add scss import to main.scss
		const anchor = '// +++';
		return rp(scssFolder, scssFile, anchor, getScssImport(name) + anchor);
	} else {
		create('json');
	}

	cb();
}

// Remove file(s)
export function rf(cb) {

	const args = getArgs();
	if (!args.length) cb();

	const type = args[0];
	const name = args[1];

	// Remove a file
	const remove = (ext) => rm(`${getDest(type, ext)}/${getName(name, type, ext)}`);

	remove('hbs');
	if (isComponent(type)) {
		remove('scss');
		// Remove scss import from main.scss
		return rp(scssFolder, scssFile, getScssImport(name));
	} else {
		remove('json');
	}

	cb();
}

// HTML file index
export function htmlIndex() {
	return gulp.src(`build/tpl/index-html.txt`)
		.pipe(consolidate('lodash', {
			files: fs.readdirSync(`${config.pw}/html`),
			title: getTitle(pkgName),
			version: pkgVersion,
			year: (new Date()).getFullYear(),
		}))
		.pipe(rename('index.html'))
		.pipe(gulp.dest(config.dist));
}
