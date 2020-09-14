const config = require('./gulp.config')()


const   gulp = require('gulp')

const log = require('fancy-log')

const plugins = {
    bs: require('browser-sync').create(),
    //del: require('del'),
    concat: require('gulp-concat'),
    replace: require('gulp-replace'),
    sourcemaps: require('gulp-sourcemaps'),
    // plumber: require('gulp-plumber'),
    // rename: require('gulp-rename'),
    // CSS
    sass: require('gulp-sass')(require('sass')),
    // minify: require('gulp-clean-css'),
    // autoprefixer: require('gulp-autoprefixer'),
    // JS
    // babel: require('gulp-babel'),
    // uglify: require('gulp-uglify'),

    ftp: require( 'vinyl-ftp')
};

function sass() {
    return gulp.src(config.allsass)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('./'))
        .pipe(plugins.bs.stream({match: '**/*.css'}))
}

function js() {
    return gulp.src([config.alljs])
        .pipe(plugins.concat('main.js'))
        // .pipe(uglify())
        // .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./js'));
}


function deploy_css() {
    let conn = plugins.ftp.create( {...config.ftp.credentials, parallel: 10} )

    return gulp.src('./style.css')
        .pipe(plugins.replace('/assets/images/', '/wp-content/uploads/2021/10/'))
        .pipe(conn.dest(config.ftp.root))
}
function deploy_php() {
    let conn = plugins.ftp.create( {...config.ftp.credentials, parallel: 10} )
    return gulp.src('./*.php')
        .pipe(plugins.replace('/assets/images/', '/wp-content/uploads/2021/10/'))
        .pipe(conn.dest(config.ftp.root))

}

function deploy_js() {
    let conn = plugins.ftp.create( {...config.ftp.credentials, parallel: 10} )

    return gulp.src('./js/*.js')
        .pipe(plugins.replace('/assets/images/', '/wp-content/uploads/2021/10/'))
        .pipe(conn.newer(config.ftp.root))
        .pipe(conn.dest(config.ftp.root))

}

function build(done) {
    gulp.series(sass,js,deploy_css,deploy_js,deploy_php)
    done()
}

function watch() {
    plugins.bs.init({
        proxy: config.proxy,
        root: [__dirname],
        // open: false,
        host: config.localhost,
        injectChanges: true,
        serveStatic: ['./'],
        rewriteRules: [
            {
                match: new RegExp('/wp-content/themes/_s/style.css'), //?ver=1.0.0
                fn: function() {
                    return './style.css';
                }
            },
            {
                match: new RegExp('/wp-content/themes/_s/js/main.js'), //?ver=1.0.0
                fn: function () {
                    return './js/main.js';
                }
            }
        ]
    })
    gulp.watch(config.allsass,gulp.series(sass,deploy_css))
    gulp.watch('./*.php',gulp.series(deploy_php,function (done) {
        plugins.bs.reload()
        done()
    }))
    gulp.watch('./assets/js/*.js',gulp.series(js,deploy_js,function (done) {
        plugins.bs.reload()
        done()
    }))
    gulp.watch('gulpfile.js').on('change', () => {
        process.exit(0)
    })
}


exports.default = watch
exports.build = build
exports.watch = watch

