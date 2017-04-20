/// <binding BeforeBuild='min' />
"use strict";

var gulp = require("gulp"),
    less = require('gulp-less'),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    htmlmin = require("gulp-htmlmin"),
    uglify = require("gulp-uglify"),
    merge = require("merge-stream"),
    del = require("del")
    ;
var regex = {
    css: /\.css$/,
    html: /\.(html|htm)$/,
    js: /\.js$/
};

gulp.task("min", ["min:js", "min:css"]);

// Compile LESS files from /less into /css
gulp.task('less', function () {
    return gulp.src('less/site.less')
        .pipe(less())
        .pipe(gulp.dest('wwwroot/css'))
});

// Minify compiled CSS
gulp.task('min:css', ['less'], function () {
    return gulp.src('wwwroot/css/site.css')
        .pipe(cleanCSS({ compatibility: '*' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('wwwroot/css'))
});


// Minify JS
gulp.task('min:js', function () {
    return gulp.src('wwwroot/js/site.js')
        .pipe(uglify())
        //.pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('wwwroot/js'))
        //.pipe(browserSync.reload({
        //    stream: true
        //}))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function () {
    gulp.src(['node_modules/magnific-popup/dist/*'])
        .pipe(gulp.dest('wwwroot/lib/magnific-popup'))

    gulp.src(['node_modules/scrollreveal/dist/*.js'])
        .pipe(gulp.dest('wwwroot/lib/scrollreveal'))

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('wwwroot/lib/font-awesome'))
})


// Run everything
gulp.task('default', ['min', 'copy']);
