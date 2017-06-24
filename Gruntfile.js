module.exports = function(grunt) {

    grunt.initConfig({
        ngdoc: {
            all: ['src/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-ngdoc');
}