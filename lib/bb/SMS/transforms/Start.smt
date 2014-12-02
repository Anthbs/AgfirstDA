var {{id}} = function(obj) {
	//Setting up variables
	{{#each params.initial}}
		if(obj["{{name}}"] == null) {
			{{#isNotNull value}}
				{{#isNotArray value}}
					{{#isNumber value}}
						obj["{{name}}"] =  {{value}};
					{{else}}
						obj["{{name}}"] =  "{{value}}";
					{{/isNumber}}
				{{else}}
					obj["{{name}}"] = {};
				{{/isNotArray}}
			{{else}}
				obj["{{name}}"] = {};
			{{/isNotNull}}
		} 
	{{/each}}

	var deferred = window.$q.defer();
	deferred.resolve({ nextState: '{{params.nextAction.id}}', params: obj });
	return { promise: deferred };
}