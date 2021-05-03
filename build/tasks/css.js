import gulp from 'gulp';
import connect from 'gulp-connect';
import consolidate from 'gulp-consolidate';
import cssnano from 'gulp-cssnano';
import csso from 'gulp-csso';
import gulpif from 'gulp-if';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import lint from 'gulp-sass-lint';
import cp from '../util/cp';
import { config } from '../../package.json';

const src = `${config.src}/scss`;
const dest = `${config.dist}/css`;
const release = process.argv[2] === 'release';

// Compile main.scss
function compileMain() {
	return gulp.src([`${src}/main.scss`])
		.pipe(gulpif(!release, sourcemaps.init()))
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(rename('main.min.css'))
		.pipe(gulpif(!release, sourcemaps.write('.')))
		.pipe(gulp.dest(dest))
		.pipe(connect.reload());
}

// Compile UIkit SCSS
function compileUIkit() {
	return gulp.src('build/tpl/uikit-theme-scss.txt')
		.pipe(consolidate('lodash', {
			src: src,
			uikit: '../../node_modules/uikit/src/scss'
		}))
		.pipe(gulpif(!release, sourcemaps.init()))
		.pipe(sass().on('error', sass.logError))
		.pipe(csso())
		.pipe(cssnano({zindex: false}))
		.pipe(rename('uikit-theme.min.css'))
		.pipe(gulpif(!release, sourcemaps.write('.')))
		.pipe(gulp.dest(dest))
		.pipe(connect.reload());
}

// Compile Mmenu SCSS
function compileMmenu() {
	return gulp.src('build/tpl/mmenu-theme-scss.txt')
		.pipe(consolidate('lodash', {
			src: src,
			mmenu: '../../node_modules/mmenu-js/src'
		}))
		.pipe(gulpif(!release, sourcemaps.init()))
		.pipe(sass().on('error', sass.logError))
		.pipe(csso())
		.pipe(cssnano({zindex: false}))
		.pipe(rename('mmenu-theme.min.css'))
		.pipe(gulpif(!release, sourcemaps.write('.')))
		.pipe(gulp.dest(dest))
		.pipe(connect.reload());
}

// Copy any CSS files
function cpCss() {
	return cp(`${config.src}/css/**/*.css`, dest);
}

// tasks.css
export const css = gulp.series(compileUIkit, compileMmenu, compileMain, cpCss);

// tasks.sasslint
export function sasslint() {
	return gulp.src([`${src}/**/*.scss`])
		.pipe(lint({
			build: '.sass-lint.yml'
		}))
		.pipe(lint.format())
		.pipe(lint.failOnError());
}
