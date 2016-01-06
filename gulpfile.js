'use strict';
//including gulp
var gulp = require('gulp');

//include plug-ins
var minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    ngannotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    del = require('del');

//jshintin all javascript files
gulp.task('jshint', function() {
   return gulp.src('app/scripts/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
});

// clean - delete all files in the dist folder
gulp.task('clean', function() {
   return del(['dist']);
});

gulp.task('usemin', ['jshint'], function() {
   return gulp.src('./app/index.html')
      .pipe(usemin({
         css: [minifycss(), rev()],
         js: [ngannotate(), uglify(), rev()]
      }))
      .pipe(gulp.dest('dist/'));
});

//images
gulp.task('imagemin', function() {
   return del(['dist/images']), gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// default task
gulp.task('default', ['clean'], function() {
   gulp.start('usemin', 'imagemin', 'copyfonts');
});
