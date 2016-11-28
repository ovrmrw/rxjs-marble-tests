'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const jasmine = require('gulp-jasmine');


////////////////////////////////////////////////////////////////////////////////
// Rxjs5 Marble Test (jasmine)
const rxjsSpecJS = './.dest/webpack.bundle.spec.js';

gulp.task('jasmine', [], () => {
  gulp.src(rxjsSpecJS)
    // .pipe(plumber())
    .pipe(jasmine({
      verbose: true,
      errorOnFail: false,
      // includeStackTrace: true,
      // reporter: new reporters.TapReporter ()
    }));
});

gulp.task('jasmine:w', ['jasmine'], () => {
  gulp.watch([rxjsSpecJS], ['jasmine']);
});
