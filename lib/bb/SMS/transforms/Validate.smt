var {{id}} = function(obj) {
	var deferred = window.$q.defer();

	var p1 = obj["{{params.firstParameter}}"];
	{{#each params.keys}}
		{{#if isParam}}
			if (p1 != null && p1[obj["{{key}}"]] != null) {
				p1 = p1[obj["{{key}}"]];
			} else {
				p1[obj["{{key}}"]] = null;
			}
		{{else}}
			if (p1 != null && p1["{{key}}"] != null) {
				p1 = p1["{{key}}"];	
			} else {
				p1["{{key}}"] = null;
			}
		{{/if}}
	{{/each}}

	var p2 = obj["{{params.secondParameter}}"];
	{{#each params.storeKeys}}
		{{#if isParam}}
			if (p2 != null && p2[obj["{{key}}"]] != null) {
				p2 = p2[obj["{{key}}"]];
			} else {
				p2[obj["{{key}}"]] = null;
			}
		{{else}}
			if (p2 != null && p2["{{key}}"] != null) {
				p2 = p2["{{key}}"];	
			} else {
				p2["{{key}}"] = null;
			}
		{{/if}}
	{{/each}}

	{{#isEqual params.operation "REGEX"}}
		//REGEX
		var re = new RegExp(p2);
		if(re.test(p1)) {
			deferred.resolve({ nextState: "{{params.nextAction.id}}", params: obj });
		}
		else {
			deferred.resolve({ nextState: "{{params.cancelAction.id}}", params: obj });
		}
	{{else}}
		if(p1 {{{params.operation}}} p2) {
			deferred.resolve({ nextState: "{{params.nextAction.id}}", params: obj });
		}
		else {
			deferred.resolve({ nextState: "{{params.cancelAction.id}}", params: obj });
		}
	{{/isEqual}}

	
	
	return { promise: deferred };
};