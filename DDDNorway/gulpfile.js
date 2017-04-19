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
    del = require("del"),
    bundleconfig = require("./bundleconfig.json");

var regex = {
    css: /\.css$/,
    html: /\.(html|htm)$/,
    js: /\.js$/
};

gulp.task("min", ["min:js", "min:css", "min:html"]);

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

//gulp.task("min:js", function () {
//    var tasks = getBundles(regex.js).map(function (bundle) {
//        return gulp.src(bundle.inputFiles, { base: "." })
//            .pipe(concat(bundle.outputFileName))
//            .pipe(uglify())
//            .pipe(gulp.dest("."));
//    });
//    return merge(tasks);
//});

//gulp.task("min:css",["less"], function () {
//    var tasks = getBundles(regex.css).map(function (bundle) {
//        return gulp.src(bundle.inputFiles, { base: "." })
//            .pipe(concat(bundle.outputFileName))
//            .pipe(cssmin())
//            .pipe(gulp.dest("."));
//    });
//    return merge(tasks);
//});

gulp.task("min:html", function () {
    var tasks = getBundles(regex.html).map(function (bundle) {
        return gulp.src(bundle.inputFiles, { base: "." })
            .pipe(concat(bundle.outputFileName))
            .pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true }))
            .pipe(gulp.dest("."));
    });
    return merge(tasks);
});

gulp.task("clean", function () {
    var files = bundleconfig.map(function (bundle) {
        return bundle.outputFileName;
    });

    return del(files);
});

gulp.task("watch", function () {
    getBundles(regex.js).forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, ["min:js"]);
    });

    getBundles(regex.css).forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, ["min:css"]);
    });

    getBundles(regex.html).forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, ["min:html"]);
    });
});

function getBundles(regexPattern) {
    return bundleconfig.filter(function (bundle) {
        return regexPattern.test(bundle.outputFileName);
    });
}

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
