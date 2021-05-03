import gulp from 'gulp';
import connect from 'gulp-connect';
import cp from '../util/cp';
import { config } from '../../package.json';

const dest = `${config.dist}/js`;

// tasks.js
export function js() {
	return cp(`${config.src}/js/**/*.js`, dest).pipe(connect.reload());
}

// tasks.uikitJs
export function uikitJs() {
	return gulp.src('node_modules/uikit/dist/js/uikit.min.js').pipe(gulp.dest(dest));
}

// tasks.mmenuJs
export function mmenuJs() {
	return gulp.src('node_modules/mmenu-js/dist/mmenu.js').pipe(gulp.dest(dest));
}
