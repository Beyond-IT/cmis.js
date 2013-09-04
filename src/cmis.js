/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var CMIS = (function () {
	
	var VERSION = '0.1.0';
	
	// global object
	var root = this;
	var $ = root.jQuery || root.Zepto || root.ender || root.$;
	
	var config = {
		url : '',
		basicauth : '',
		repositoryId : '',
		repositoryUrl : '',
		rootFolderUrl : ''
	};	
	
	var defaultOptions = {
		data : {
			'succinct' : 'true'
		}	
	};
		
	return {
		
		// helpers
		
		transformProperties : function (properties) {			
			var params = {} , i = 0;
			$.each(properties, function(key,value) {
				if (key.indexOf(':') > 0) {
					params['propertyId['+i+']'] = key;
					params['propertyValue['+i+']'] = value;
					++i;
				} else {
					params[key] = value;
				}
			});
			return params;
		},
		
		asFormData : function (properties) {
			var formData = new FormData();
			
			$.each(properties, function (key,value) {
				formData.append(key,value);
			});
			
			return formData;
		},		
		
		setDefaultOptions : function (options) {
			defaultOptions = options;
		},
		
		// init
		
		init : function (parameters) {
			
			config.url = parameters['url'];
			config.basicauth = btoa(parameters['username'] + ':' + parameters['password']);
			config.repositoryId = parameters['repositoryId'];
			
			// TODO: these parameters should be obtained directly from the repository (getRepositories)
			config.repositoryUrl = config.url + "/" + config.repositoryId;
			config.rootFolderUrl = config.repositoryUrl + '/root'; // TODO: here it is assumed that root is the name of the root folder, which is not always true
			
			$.ajaxSetup({
				beforeSend : function (xhr) { 
					xhr.setRequestHeader('Authorization', "Basic " + config.basicauth); 
				},
			});
			
		},
		
		// ajax Handling
		
		ajaxCall : function (params) {
			params = $.extend(true,{},defaultOptions,params);
			
			if (params.data.path) {
				params.url += path.data.path;
				delete params.data.path;
			}
			
			params.data = this.transformProperties(params.data);
						
			// exceptions :(
			if (params.data['cmisaction'] === 'createDocument') {
				params.data = this.asFormData(params.data);
				
				params.processData = false; // prevent jQuery from processing the data to a string
				params.contentType = false; // contentType will be set from browser
				params.cache = false;	
			}
			
			/* 
			// just for debugging purposes
			$.each(params.data, function(key,value) {
				console.info(key + " - " + value);
			});
			*/
			
			return $.ajax(params);
		},
		
		repositoryService : function (inputs, options) {
			options || (options = {});			
			options.data = inputs;
			options.url = config.repositoryUrl;
			
			return this.ajaxCall(options);
		},
		
		objectService : function (inputs, options) {
			options || (options = {});			
			options.data = inputs;
			options.url = config.rootFolderUrl;
			
			return this.ajaxCall(options);
		},
		
		// object Services
						
		createFolder : function (inputs, options) {			
			options || (options = {});
			options.type = 'POST';
			
			var data = {
				'cmisaction' : 'createFolder',
				'cmis:objectTypeId' : 'cmis:folder'	
			};
					
			return this.objectService($.extend(data,inputs),options);
		},
		
		createDocument : function(inputs,options) {
			options || (options = {});
			options.type = 'POST';
			
			var data = {
				'cmisaction' : 'createDocument',
				'cmis:objectTypeId' : 'cmis:document'
			};
					
			return this.objectService($.extend(data,inputs),options);
		},
		
		deleteObject : function(inputs, options) {
			options || (options = {});
			options.type = 'POST';
			
			var data = {
				'cmisaction' : 'delete',
				'allVersions' : 'true'
			};
					
			return this.objectService($.extend(data,inputs),options);
		},		
		
		deleteTree : function(inputs, options) {
			options || (options = {});
			options.type = 'POST';
			
			var data = {
				'cmisaction' : 'deleteTree',
				'allVersions' : 'true'
			};
					
			return this.objectService($.extend(data,inputs),options);
		},
		
		children : function(inputs, options) {
			var data = {
				'cmisselector' : 'children'
			};
						
			return this.objectService($.extend(data,inputs),options);
		},
		
		update : function(inputs,options) {
			options || (options = {});
			options.type = 'POST';
			
			var data = {
				'cmisaction' : 'update',
				'allVersions' : 'true'
			};
					
			return this.objectService($.extend(data,inputs),options);			
		},
		
		object : function(inputs,options) {
			var data = {
				'cmisselector' : 'object'
			};
						
			return this.objectService($.extend(data,inputs),options);			
		},
		
		move : function(inputs,options) {
			options || (options = {});
			options.type = 'POST';
			
			var data = {
				'cmisaction' : 'move'
			};
					
			return this.objectService($.extend(data,inputs),options);
		},
		
		// repository Services
		
		query : function(inputs,options) {			
			var data = {
				'cmisselector' : 'query'
			};
						
			return this.repositoryService($.extend(data,inputs),options);
			
		},
				
	};
	
})();