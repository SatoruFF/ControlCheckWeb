const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const minify = require('gulp-minify');
const imagemin = require('gulp-imagemin');
const sync = require('browser-sync').create()

function html() {
    return src('src/**.html')
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('dist'))
}

function scss() {
    return src('style/scss/**.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false
    }))
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(dest('dist'))
}

function clear() {
    return del('dist')
}

function scripts() {
    return src('script/**.js')
    .pipe(concat('all.js'))
      .pipe(minify({
          noSource:true
      }))
      .pipe(dest('dist'))
  };

function image() {
    return src('img/*')
    .pipe(imagemin())
    .pipe(dest('dist/images'))
}

function serve() {
    sync.init({
      server: './dist'
    })
  
    watch('src/parts/**.html', series(html)).on('change', sync.reload)
    watch('style/scss/**.scss', series(scss)).on('change', sync.reload)
    watch('script/**.js', series(scripts)).on('change', sync.reload)
  }

exports.build = series(clear, scss, html, scripts, image)
exports.serve = series(clear,scss,html,scripts, image, serve)