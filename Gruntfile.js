module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        ngdocs: {
            options: {
                dest: 'docs',
                html5Mode: true,
                startPage: '/public',
                title: "Documentación de Copernicus",
                scripts: [
                    'bower_components/angular/angular.js',
                    'bower_components/angular-animate/angular-animate.js'
                ]
            },
            public: {
                src: ['public/javascripts/**/*.js', 'public/modulo.js'],
                title: 'public'
            },
            api: {
                src: ['api/**/*.js'],
                title: 'api'
            },
            server: {
                src: ['server/**/*.js'],
                title: 'server'
            }
        }

    });

    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.registerTask('default', ['ngdocs']);
};