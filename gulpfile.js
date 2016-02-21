var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');

gulp.task('scripts', function() {
  return gulp.src(['assets/scripts/**/*.js'])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('views', function() {
  return gulp.src(['assets/views/**/*.html'])
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('build', ['clean', 'scripts', 'views']);
