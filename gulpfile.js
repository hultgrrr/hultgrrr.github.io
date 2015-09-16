var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var copy = require('gulp-copy');
var cssmin = require('gulp-minify-css');
var runSequence = require('run-sequence');



gulp.task('styles', function() {
    gulp.src('src/styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css'));
});

gulp.task('watch', function() {
    gulp.watch('src/styles/main.scss', ['styles']);
});

gulp.task('clean', function() {
    return gulp.src('dist', {
            read: false
        })
        .pipe(clean());
});

gulp.task('copySounds', function () {
    return gulp.src('src/assets/sounds/**/*')
        .pipe(gulp.dest('dist/assets/sounds'));
});

gulp.task('copyQuestions', function () {
    return gulp.src('src/assets/sounds/**/*')
        .pipe(gulp.dest('dist/assets/sounds'));
});

gulp.task('copyQuestions', function () {
    return gulp.src('src/questions.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('compressJs', function() {
    return gulp.src(['src/assets/jquery/dist/jquery.min.js', 'src/assets/bootstrap/dist/js/bootstrap.min.js', 'src/assets/SoundJS/lib/soundjs-0.6.1.min.js', 'src/assets/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js', 'src/scripts/*.js'])
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('compressCss', function () {
    return gulp.src(['src/assets/bootstrap/dist/css/bootstrap.min.css', 'src/css/main.css'])
        .pipe(concat('styles.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('htmlreplace', function() {
    gulp.src('src/index.html')
        .pipe(htmlreplace({
            'css': 'assets/css/styles.min.css',
            'js': 'assets/js/bundle.min.js'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['styles', 'watch']);
gulp.task('build', function (callback) {
    runSequence('clean', ['copySounds', 'copyQuestions', 'compressCss', 'compressJs', 'htmlreplace'], callback);
});