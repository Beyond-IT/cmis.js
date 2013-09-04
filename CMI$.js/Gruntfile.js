module.exports = function(grunt) {

  grunt.initConfig({
	  
    pkg: grunt.file.readJSON('package.json'),
    
    jasmine : {
    	backboneCmis : {
    		src : ['src/**/*.js'],
    		options : {
    			'--web-security' : false,
    		    '--local-to-remote-url-access' : true,
    		    '--ignore-ssl-errors' : true,
    			specs : 'spec/*Spec.js',
    			vendor : ['node_modules/jquery-browser/lib/jquery.js']
    		}
    	}
  
    }
  
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['jasmine']);

};