describe("CMIS Sync", function() {
	
	var folderId = '', documentId = '', rootFolderId = '100'; // TODO: root foler id must be dynamic, otherwise test can only run against apache in memory repo
	
	$.ajaxSetup({	
		error : function(xhr, v1, v2) {
			console.error(v1 + " " + v2);
		}
	});
	
	// configure the CMIS session
	CMIS.init({
		'url' : 'http://localhost:8080/cmis-inmemory/browser',
		'repositoryId' : 'A1',
		'username' : 'admin',
		'password' : 'admin'
	});
		
	it ("transform properties into valid HTTP params", function() {
		
		var properties = {
			"cmis:name" : "some name",
			"cmis:description" : "some description",
			"succinct" : true
		};
		
		var transformedProperties = CMIS.transformProperties(properties);
		
		expect(transformedProperties['propertyId[0]']).toEqual('cmis:name');
		expect(transformedProperties['propertyId[1]']).toEqual('cmis:description');
		expect(transformedProperties['propertyValue[0]']).toEqual('some name');
		expect(transformedProperties['propertyValue[1]']).toEqual('some description');
		expect(transformedProperties['succinct']).toBe(true);
		
	});
	
	
	it ("create a folder", function() {
			
		var resp = undefined;
		
		runs(function() {			
			resp = CMIS.createFolder({
				'cmis:name' : 'A Folder'
			});		
						
			resp.done(function(data) {				
				var id = data.succinctProperties['cmis:objectId'];							
				expect(id).toBeDefined();
				folderId = id;
			});
		});
				
		waitsFor(function() {
			return resp.state() !== 'pending';			
		});
		
		runs(function() {
			expect(resp.state()).toBe('resolved');
		});
		
	});
	
	it ('create document', function() {
		
		var builder = new WebKitBlobBuilder();
		var file = ['<html><head><title>Sample Document</title></head><body><h1>Hello World</h1></body></html>'];
		builder.append(file[0]);
		var sampleFile = builder.getBlob("text/html"); 
		
		runs(function() {			
			resp = CMIS.createDocument({
				'cmis:name' : 'Some Sample Document',
				'folderId' : folderId,
				'content' : sampleFile
			});		
			
			resp.done(function(data) {								
				var id = data.succinctProperties['cmis:objectId'];							
				expect(id).toBeDefined();
				documentId = id;				
			});
		});
		
		waitsFor(function() {
			return resp.state() !== 'pending';
		});
		
		runs(function() {			
			expect(resp.state()).toBe('resolved');
		});
		
	});
	
	it ("update document name", function() {		
		var resp = undefined;		
		
		runs(function() {				
			resp = CMIS.update({
				'objectId' : documentId,
				'cmis:name' : 'Different Sample Document Name'
			});				
		});
		
		waitsFor(function() {
			return resp.state() !== 'pending';
		});
		
		runs(function() {			
			expect(resp.state()).toBe('resolved');
		});		
	});
	
	it ("move document to sample folder", function() {
		var resp = undefined;		
	
		runs(function() {				
			resp = CMIS.move({
				'objectId' : documentId,
				'targetFolderId' : folderId,
				'sourceFolderId' : rootFolderId
			});		
		});
		
		waitsFor(function() {
			return resp.state() !== 'pending';
		});
		
		runs(function() {			
			expect(resp.state()).toBe('resolved');
		});
	});
	
	it ("retrieve document via object selector", function() {
		var resp = undefined;		
		
		runs(function() {				
			resp = CMIS.object({
				'objectId' : documentId
			});		
		});
		
		waitsFor(function() {
			return resp.state() !== 'pending';
		});
		
		runs(function() {			
			expect(resp.state()).toBe('resolved');
		});
	});	
	
	it ("list children", function() {
		var resp = undefined;		

		runs(function() {			
			resp = CMIS.children({
				'path' : '/A Folder'
			});		
		});
		
		waitsFor(function() {
			return resp.state() !== 'pending';
		});
		
		runs(function() {			
			expect(resp.state()).toBe('resolved');
		});
	});
	
	it ("query cmis:documents from repository", function() {
		
		var resp = undefined;		

		runs(function() {			
			
			resp = CMIS.query({
				'q' : 'select * from cmis:document'				
			});					
			
			resp.done(function(data) {						
				expect(data.numItems).toBeGreaterThan(0);	
				expect(data.hasMoreItems).toBe(false);
			});
			
		});
		
		waitsFor(function() {
			return resp.state() !== 'pending';
		});
		
		runs(function() {
			expect(resp.state()).toBe('resolved');
		});
		
	});
	
	it ("delete a folder and sub elements", function() {
		
		var resp = undefined;		

		runs(function() {			
			resp = CMIS.deleteTree({
				'objectId' : folderId
			});					
		});
		
		waitsFor(function() {
			return resp.state() !== 'pending';
		});
		
		runs(function() {
			expect(resp.state()).toBe('resolved');
		});
		
	});
	
		
});