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
var streamify 	= require('gulp-streamify');
var uglify		= require("gulp-uglify")
var gutil 		= require('gulp-util');

var browserify  = require('browserify');
var watchify	= require('watchify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');

var __base_dir = './src/frontend/';
var __target_dir = './public/nativeAssets/';

gulp.task('build_html', build_html);
gulp.task('build_sass', build_sass);
gulp.task('build_assets', build_assets);
gulp.task('watch', onWatch);
gulp.task('build_react', build_react);
gulp.task('publish', build_publish);
gulp.task('default', ['build_react', 'build_html', 'build_sass', 'build_assets', 'watch']);

///////////////////////////////////////////////////////////////

function build_react(){
	compile_jsx(__dirname, base_dir('main/index.jsx'), target_dir('index.js'))
}

function build_html(){
	compile_files_concat(__dirname, base_dir('common/index.html'), target_dir('index.html'));
}

function build_sass(){
	compile_sass_concat(__dirname, [base_dir('**/*.scss')], target_dir('index.css'));
}

function build_assets(){
	copy_files(__dirname, base_dir('**/*.svg'), target_dir('/'));
	copy_files(__dirname, base_dir('**/*.jpg'), target_dir('/'));
}

function build_publish(){
	build_sass();
	compile_jsx(__dirname, base_dir('main/index.jsx'), target_dir('index.js'), {uglify: true, watch: false});
}

function onWatch(){
	gulp.watch([base_dir('**/*.html')], build_html);
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

console.log(path.resolve(__dirname, __base_dir))

//https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
//http://stackoverflow.com/questions/29625182/gulp-browserify-takes-longer-to-compile-on-each-save-change
function compile_jsx(root, src_files, dest_file, opt){
	opt = opt || {};
	const use_uglify = opt.uglify === true;
	const use_watch = opt.watch !== true;

	let build = browserify({
		entries: src_files,
		extensions: ['.jsx', 'js'],
		debug: true,
		paths: ['./node_modules', './src', './src/frontend']
	  })
	  .on("error", notify.onError({
		message: "Error: <%= error.message %>",
		title: "Error running something"
	  }))
	  .transform("babelify", {})
	  .on("error", notify.onError({
		message: "Error: <%= error.message %>",
		title: "Error running something"
	  }))

	let watch = watchify(build);
	if(use_watch){
		watch.on('update', bundle);
		watch.on('log', gutil.log)
	}
	bundle();

	function bundle(){
		var updateStart = Date.now();

		let bundle = watch.bundle()
		.on("error", notify.onError({
			message: "Error: <%= error.message %>",
			title: "Error running something"
		}))
		.pipe(source(path.basename(dest_file)))

		if(use_uglify){
			bundle = bundle.pipe(streamify(uglify()))
		}

		bundle = bundle
		.pipe(gulp.dest(path.dirname(dest_file)))
		.pipe(notify({
			"title": "Success",
			// "subtitle": "<%= file.relative %>",
			"message": ()=>`<%= file.relative %> (elapsed ${Date.now()-updateStart}ms)`,
			"sound": "Frog", // case sensitive
			"onLast": true,
			"wait": true
		}))
		.on("error", notify.onError({
			message: "Error: <%= error.message %>",
			title: "Error running something"
		}))

		return bundle;
	}
}

///////////////////////////////////////////////////////////////

function base_dir(src){
	return __base_dir + src;
}

function target_dir(src){
	return __target_dir + src;
}
