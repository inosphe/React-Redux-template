'use strict';

var fs          = require('fs');
var path        = require('path');
var gulp        = require('gulp');
var concat      = require('gulp-concat');
var rename      = require('gulp-rename');
var watch       = require('gulp-watch');
var sass        = require('gulp-sass');
var template    = require('gulp-template');
var notify      = require("gulp-notify");

var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');

var __base_dir = './src/frontend/';
var __target_dir = './public/resources/nativeAssets/';

gulp.task('build_html', build_html);
gulp.task('build_sass', build_sass);
gulp.task('build_assets', build_assets);
gulp.task('watch', onWatch);
gulp.task('default', ['build_html', 'build_sass', 'build_assets', 'watch']);

///////////////////////////////////////////////////////////////

function build_html(){
	// copy_files(__dirname, base_dir('copy_src/*.html'), target_dir(''));
	compile_files_concat(__dirname, base_dir('common/*.html'), target_dir('index.html'));
	compile_jsx(__dirname, base_dir('main/index.jsx'), target_dir('index.js'))
}

function build_sass(){
	compile_sass_concat(__dirname, [base_dir('**/*.scss')], target_dir('index.css'));
}

function build_assets(){
	copy_files(__dirname, base_dir('**/*.svg'), target_dir('/'));
	copy_files(__dirname, base_dir('**/*.jpg'), target_dir('/'));
}

function onWatch(){
	gulp.watch([base_dir('**/*.html'), base_dir("**/*.jsx"), base_dir("**/*.js")], build_html);
	gulp.watch([base_dir('**/[^_]?*.scss')], build_sass);
	gulp.watch([base_dir('**/*')], build_assets);
}

///////////////////////////////////////////////////////////////

function compile_files_concat(root, src_files, dest_file){
	return gulp.src(src_files)
		.pipe(concat(path.basename(dest_file)))
		.pipe(gulp.dest(path.dirname(dest_file)))
}

function copy_files(root, src_files, dest_file){
	return gulp.src(src_files, { base: __base_dir })
	.pipe(rename(function (path) {
		path.dirname = path.dirname.split('/')[0];
	}))
	.pipe(gulp.dest(dest_file))
	.on('error', function(err){ console.log(err.message); })
}

function compile_sass_concat(root, src_files, dest_file){
	return gulp.src(src_files)
		.pipe(sass({includePaths: [__base_dir, base_dir('style')]}))
		.on("error", notify.onError({
	    	message: "Error: <%= error.message %>",
	    	title: "Error running something"
	    }))
		.pipe(concat(path.basename(dest_file)))
		.pipe(gulp.dest(path.dirname(dest_file)))
		.pipe(notify({
	        "title": "Success",
	        // "subtitle": "<%= file.relative %>",
	        "message": "<%= file.relative %>",
	        "sound": "Frog", // case sensitive
	        "onLast": true,
	        "wait": true
      }))
}

function compile_jsx(root, src_files, dest_file){
	browserify({
		entries: src_files,
		extensions: ['.jsx', 'js'],
		debug: true
	  })
	  .on("error", notify.onError({
        message: "Error: <%= error.message %>",
        title: "Error running something"
      }))
	  .transform(babelify)
	  .on("error", notify.onError({
        message: "Error: <%= error.message %>",
        title: "Error running something"
      }))
	  .bundle()
	  .on("error", notify.onError({
        message: "Error: <%= error.message %>",
        title: "Error running something"
      }))
	  .pipe(source(path.basename(dest_file)))
	  .pipe(gulp.dest(path.dirname(dest_file)))
	  .pipe(notify({
        "title": "Success",
        // "subtitle": "<%= file.relative %>",
        "message": "<%= file.relative %>",
        "sound": "Frog", // case sensitive
        "onLast": true,
        "wait": true
      }))
      .on("error", notify.onError({
        message: "Error: <%= error.message %>",
        title: "Error running something"
      }));
}

///////////////////////////////////////////////////////////////

function base_dir(src){
	return __base_dir + src;
}

function target_dir(src){
	return __target_dir + src;
}
