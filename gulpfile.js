var gulp = require('gulp');
sass = require('gulp-sass');
server = require('gulp-server-livereload');
rename = require('gulp-rename');
concatCss = require('gulp-concat-css');
cleanCSS = require('gulp-clean-css');
autoprefixer = require('gulp-autoprefixer');
uncss  = require ( 'gulp-uncss' ) ; 
concat = require('gulp-concat');
uglyfly = require('gulp-uglyfly');
imagemin = require('gulp-imagemin');
del = require('del');
urlAdjuster = require('gulp-css-url-adjuster');




// Удаление папки с продакшн
gulp.task('clean', function(){
  return del('dist');
});

gulp.task('sass', function(){
	return gulp.src(['scss/**/main.scss'])
	.pipe(sass({outputStyle: 'expended'})).on('error', sass.logError)
	.pipe(gulp.dest('css'))
});

gulp.task('watch', function(){
	gulp.watch(['scss/**/*.scss'],['sass']);
});

gulp.task('webserver', function() {
  gulp.src('')
  .pipe(server({
    livereload: true,
    defaultFile: 'index.html',
    directoryListing: false,
    open: true
  }));
});

gulp.task('default', ['watch', 'webserver']);


// Создание временной папки для css
gulp.task('timeFold', function(){
  return gulp.src(['css/**/*.css', '!css/main.css'])
  .pipe(concatCss("bundle.css"))
  .pipe(uncss({
    html: ['index.html']
  }))
  .pipe(gulp.dest('timefile/'))
})

// основные дейсвтия для продакшн
gulp.task('prodaction', ['timeFold'], function(){

  var buildAllCss = gulp.src(['timefile/*.css', 'css/main.css'])
  .pipe(concatCss("css/newBundle.css"))
  .pipe(urlAdjuster({
    replace:  ['../../img/','../img/'],
  }))
  .pipe(autoprefixer({
    browsers: ['last 3 versions'],
    cascade: false
  }))
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(rename('bundle.min.css'))
  .pipe(gulp.dest('dist/'))


  var buildJs = gulp.src('js/*')
  .pipe(concat('all.js'))
  .pipe(uglyfly())
  .pipe(rename('all.min.js'))
  .pipe(gulp.dest('dist/'))

  var buildHtml = gulp.src('index.html')
  .pipe(gulp.dest('dist/'))

  var buildImg = gulp.src('img/**/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img'))

  var buildSlick = gulp.src('slick/**/*')
  .pipe(gulp.dest('dist/slick'))

  return 1;
});

// Удаление временной папки
gulp.task('cleanTime', ['makeDist'], function(){
  return del('timefile');
});

gulp.task('makeDist', ['timeFold', 'prodaction'])

//Сборка
gulp.task('build', ['makeDist', 'cleanTime']);

