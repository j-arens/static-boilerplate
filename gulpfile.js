// general
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var browsersync = require('browser-sync').create();
var concat = require('gulp-concat');
var order = require('gulp-order');

// css
var postcss = require('gulp-postcss');
var autoprefixer = require('gulp-autoprefixer');
var lost = require('lost');
var precss = require('precss');
var cssnano = require('gulp-cssnano');
var pxToRem = require('postcss-pxtorem');
var sass = require('gulp-sass');
var svgFrag = require('postcss-svg-fragments');

// js
var uglify = require('gulp-uglify');

// images
var imageMin = require('gulp-imagemin');

// html tasks
gulp.task('index', function() {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('views', function() {
    return gulp.src('./src/views/*.html')
        .pipe(gulp.dest('./dist/views'));
});

// css tasks
gulp.task('styles', function() {
    var postProcessors = [
        precss(),
        lost(),
        pxToRem({
            propWhiteList: []
        }),
        svgFrag()
    ];
    return gulp.src('./src/styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss(postProcessors))
        .pipe(concat('main.min.css'))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browsersync.stream());
});

// js tasks
gulp.task('js', function() {
    return gulp.src('./src/js/*.js')
        .pipe(order(['src/js/anime.js', 'src/js/app.js'], {
            base: './'
        }))
        .pipe(concat('app.min.js'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest('./dist/js'))
});

// image tasks
gulp.task('images', function() {
    return gulp.src('./src/img/*')
        .pipe(imageMin())
        .pipe(gulp.dest('./dist/img'))
});

// reload server
gulp.task('reload', ['index', 'views', 'js'], function() {
    browsersync.reload();
    return;
});

// gulp tasks/watch/serve
gulp.task('serve', ['index', 'views', 'styles', 'js', 'images'], function() {
    browsersync.init({
        server: {
            baseDir: './dist'
        }
    });
    gulp.watch('./src/index.html', ['index']);
    gulp.watch('./src/views/*.html', ['views']);
    gulp.watch('./src/styles/**/*.scss', ['styles']);
    gulp.watch('./src/js/*.js', ['reload']);
    gulp.watch('./src/*.html', ['reload']);
    gulp.watch('./src/views/*.html', ['reload']);
    gulp.watch('./src/img/**/*', ['images']);
});

gulp.task('default', ['serve']);
