module.exports = function(grunt) {

  grunt.initConfig({
	  
    pkg: grunt.file.readJSON('package.json'),
    
    jasmine : {
    	cmis : {
    		src : ['src/**/*.js'],
    		options : {
    			'--web-security' : false,
    		    '--local-to-remote-url-access' : true,
    		    '--ignore-ssl-errors' : true,
    			specs : 'spec/CMISSpec.js',
    			vendor : ['node_modules/jquery-browser/lib/jquery.js']
    		}
    	},
    	init : {
    		src : ['src/**/*.js'],
    		options : {
    			'--web-security' : false,
    		    '--local-to-remote-url-access' : true,
    		    '--ignore-ssl-errors' : true,
    			specs : 'spec/InitCMISSpec.js',
    			vendor : ['node_modules/jquery-browser/lib/jquery.js']
    		}
    	}
  
    }
  
  });

  // load the jasmine test task
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['jasmine']);

};