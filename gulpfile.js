var gulp = require('gulp');
var bump = require('gulp-bump');
var uglify = require('gulp-uglify');

var target = "./build/";
var glob = {
    "js": [
        './src/**/*.js'
    ]
};

// convert add appropriate headers and footers to html
gulp.task('scrunch',
    function () {
        return gulp.src(glob.js)
            .pipe(uglify())
            .pipe(gulp.dest(target));
    }
);

gulp.task('bump', function(){
  gulp.src('./package.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));
});

gulp.task('templates',
    function() {
        console.log("Reloading templates");
        template = {
            "md": {
                "h": fs.readFileSync('./src/layout/templates/header.md.html'),
                "f": fs.readFileSync('./src/layout/templates/footer.md.html')
            },
            "html": {
                "h": fs.readFileSync('./src/layout/templates/header.html'),
                "f": fs.readFileSync('./src/layout/templates/footer.html')
            }
        };
    }
);

// build task
gulp.task('default', ['scrunch']);
