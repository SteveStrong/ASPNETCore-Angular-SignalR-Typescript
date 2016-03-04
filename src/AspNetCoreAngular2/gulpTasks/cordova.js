var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var taskListing = require('gulp-task-listing');
var concat = require('gulp-concat');
var path = require('path');
var sh = require('shelljs');

var buildConfig = require('../gulp.config');

gulp.task('build:apps', function (done) {
    runSeq(
        'cordova-clean-temp',
        'cordova-copy-config-to-temp',
        'common-copy-vendor-js-to-wwwroot',
        'cordova-copy-files-to-temp-www',
        'cordova-copy-fonts-to-temp-www',
        'cordova-build-windows',
        'cordova-build-android',
        'cordova-copy-to-dist',
        done);
});

gulp.task('cordova-clean-temp', function (done) {
    return del(buildConfig.config.temp.cordova, done);
});

gulp.task('cordova-copy-files-to-temp-www', function (done) {
    var targetPath = path.join(buildConfig.config.temp.cordova, "www");

    return gulp.src([
        buildConfig.config.app.allJsFiles,
        buildConfig.config.app.allCssFiles,
        buildConfig.config.app.allHtmlFiles,
        buildConfig.config.app.indexHtmlFile,
        buildConfig.config.app.systemConfigJsFile
    ])
        .pipe(gulp.dest(targetPath));
});

gulp.task('cordova-copy-fonts-to-temp-www', function (done) {
    
    var targetPath = path.join(buildConfig.config.temp.cordova, "www", "fonts");
    return gulp.src([
        buildConfig.config.allRootFontsFiles
    ]).pipe(gulp.dest(targetPath));
});

gulp.task('cordova-build-windows', function (done) {
    sh.cd(buildConfig.config.temp.cordova);
    sh.exec('cordova platform add windows');
    sh.exec('cordova build windows');
    sh.cd('..');
    done();
});

gulp.task('cordova-build-android', function (done) {
    sh.cd(buildConfig.config.temp.cordova);
    sh.exec('cordova platform add android');
    sh.exec('cordova build android');
    sh.cd('..');
    done();
});

gulp.task('cordova-copy-config-to-temp', function () {
    var sourceFolder = path.join(buildConfig.config.assets.cordova, "config.xml");

    return gulp.src([
        sourceFolder
    ])
        .pipe(gulp.dest(buildConfig.config.temp.cordova));
});

gulp.task('cordova-copy-to-dist', function () {
    var sourceFolder = path.join(buildConfig.config.temp.cordova, 'platforms', "**/*");

    return gulp.src([
        sourceFolder
    ])
        .pipe(gulp.dest(buildConfig.config.dist.folder));
});