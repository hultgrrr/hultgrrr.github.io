var gulp = require('gulp');
var sass = require('gulp-sass');



gulp.task('styles', function() {
    gulp.src('src/styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css'));
});

gulp.task('watch', function() {
    gulp.watch('src/styles/main.scss',['styles']);
});

gulp.task('default', ['styles', 'watch']);

