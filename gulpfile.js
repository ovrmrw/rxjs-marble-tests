'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const jasmine = require('gulp-jasmine');
const mocha = require('gulp-mocha');


////////////////////////////////////////////////////////////////////////////////
// Rxjs5 Marble Test (jasmine)
const rxjsSpecJS = './.dest/webpack.bundle.spec.js';

gulp.task('jasmine', [], () => {
  gulp.src('./.dest/**/*.js')
    // .pipe(plumber())
    .pipe(jasmine({
      verbose: true,
      errorOnFail: false,
      // includeStackTrace: true,
      // reporter: new reporters.TapReporter ()
    }));
});

gulp.task('jasmine:w', ['jasmine'], () => {
  gulp.watch(['./.dest/**/*.js'], ['jasmine']);
});




gulp.task('mocha', [], () => {
  gulp.src('./.dest/**/*.js', { read: false })
    .pipe(plumber())
    .pipe(mocha({
      colors: true,
      // verbose: true,
      // errorOnFail: false,
      // includeStackTrace: true,
      // reporter: new reporters.TapReporter ()
    }));
});

gulp.task('mocha:w', ['mocha'], () => {
  gulp.watch(['./.dest/**/*.js'], ['mocha']);
});
