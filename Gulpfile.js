var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	livereload = require('gulp-livereload');

gulp.task('watch', function(){
	gulp.watch('*.js,*.html', function(event){
		console.log(event.path)
	});
	livereload.listen({interval: 500});
});

gulp.task('nodemon', function(){
	nodemon({
		script: 'index.js'
	});
});
gulp.task('default', ['nodemon','watch']);