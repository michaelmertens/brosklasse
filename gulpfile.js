const gulp = require('gulp');
const ts = require('gulp-typescript');
const spawn = require('child_process').spawn;

gulp.task('default', ['backend-typescript'], function () {});

gulp.task('backend-typescript', [], function () {
  const tsProject = ts.createProject('tsconfig.json');
  return gulp.src(['./index.ts', './server/**/*.ts'], { base: "." })
    .pipe(tsProject())
    .on('error', function () {
      process.exit(1)
    })
    .pipe(gulp.dest('.'));
});

gulp.task("tslint", function () {
  const tslint = require("gulp-tslint");
  const sourceFiles = ['./server/**/*.ts', './public/src/**/*.ts', './test/**/*.ts'];

  return gulp.src(sourceFiles)
    .pipe(tslint({ formatter: "verbose" }))
    .pipe(tslint.report())
    .on('error', function() { process.exit(1) });
});

gulp.task('build-ui', function (cb) {
  const child = spawn('yarn run build-ui', { shell: true });
  child.stderr.on('data', function (data) { console.log(data.toString()); });
  child.stdout.on('data', function (data) { console.log(data.toString()); });
  child.on('exit', function (exitCode) {
    console.log("UI build exited with code: " + exitCode);
    cb(exitCode);
  });
});

gulp.task('test-ui', function (cb) {
  const child = spawn('yarn run test-ui', { shell: true });
  child.stderr.on('data', function (data) { console.log(data.toString()); });
  child.stdout.on('data', function (data) { console.log(data.toString()); });
  child.on('exit', function (exitCode) {
    console.log("UI tests exited with code: " + exitCode);
    cb(exitCode);
  });
});
