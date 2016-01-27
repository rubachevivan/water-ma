"use strict";

var gulp = require('gulp'),
   minifycss = require('gulp-minify-css'),
   autoprefixer = require('gulp-autoprefixer'),
   ngannotate = require('gulp-ng-annotate'),
   jshint = require('gulp-jshint'),
   stylish = require('jshint-stylish'),
   uglify = require('gulp-uglify'),
   usemin = require('gulp-usemin'),
   imagemin = require('gulp-imagemin'),
   rename = require('gulp-rename'),
   concat = require('gulp-concat'),
   notify = require('gulp-notify'),
   cache = require('gulp-cache'),
   changed = require('gulp-changed'),
   rename = require('gulp-rename'),
   browserSync = require('browser-sync'),
   del = require('del');


gulp.task('jshint', function() {
   return gulp.src('app/scripts/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function() {
   return del(['dist']);
});

gulp.task('clearcache', function() {
   cache.clearAll();
});

gulp.task('copy', function() {
   return gulp.src('./app/views/**/*.html')
      .pipe(gulp.dest('dist/views/'));
});

gulp.task('usemin', ['jshint', 'copy', 'imagemin'], function() {
   return gulp.src('./app/index.html')
      .pipe(usemin({
         css: [autoprefixer(), minifycss(), rename({suffix: '.min'})],
         js: [ngannotate(), uglify(), rename({suffix: '.min'})]
      }))
      .pipe(gulp.dest('dist/'));
});

// Images
gulp.task('imagemin', function() {
   return del(['dist/images']), gulp.src('app/images/**/*')
      .pipe(cache(imagemin({
         optimizationLevel: 7,
         progressive: true,
         interlaced: true
      })))
      .pipe(gulp.dest('dist/images'))
      .pipe(notify({
         message: 'Images task complete'
      }));
});

// Watch
gulp.task('watch', ['browser-sync'], function() {
   // Watch .js files
   gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}', ['usemin']);
   // Watch image files
   gulp.watch('app/images/**/*', ['imagemin']);

});

gulp.task('browser-sync', ['default'], function() {
   var files = [
      'app/**/*.html',
      'app/styles/**/*.css',
      'app/images/**/*.png',
      'app/scripts/**/*.js',
      'dist/**/*'
   ];

   browserSync.init(files, {
      server: {
         baseDir: "dist",
         index: "index.html"
      }
   });
   // Watch any files in dist/, reload on change
   gulp.watch(['dist/**']).on('change', browserSync.reload);
});

// Default task
gulp.task('default', ['clean'], function() {
   gulp.start('usemin', 'imagemin');
});
