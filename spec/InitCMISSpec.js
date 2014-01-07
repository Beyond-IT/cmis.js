describe("CMIS Sync", function() {
	
	var url = "http://cmis.alfresco.com/cmisbrowser";
	// var url = "http://localhost:8080/cmis-inmemory/browser";
	var repoId = "bb212ecb-122d-47ea-b5c1-128affb9cd8f";
	
	$.ajaxSetup({	
		error : function(xhr, v1, v2) {
			console.error(v1 + " " + v2);
		}
	});
			
	it ("init cmis repository connection", function() {
				
		var resp = undefined;
		
		runs(function() {	
						
			CMIS.addUnauthorizedListener(function() {
				console.info("unauthorized");
			});
			
			resp = CMIS.init({
				'url' : url,
				'username' : 'admin',
				'password' : 'admin',
				'repositoryId' : repoId
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