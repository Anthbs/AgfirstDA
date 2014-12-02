var {{id}} = function(obj) {

	var deferred = window.$q.defer();
	var dst = obj["{{params.objectParameter}}"];

	{{#each params.keys}}
		{{#if isParam}}
			if (dst != null && dst[obj["{{key}}"]] != null) {
				dst = dst[obj["{{key}}"]];
			} else {
				dst[obj["{{key}}"]] = {};
				{{#if @last}} 
					dst[obj["{{key}}"]] = null;
				{{else}}
					dst = dst[obj["{{key}}"]];
				{{/if}}
			}
		{{else}}
			if (dst != null && dst["{{key}}"] != null) {
				dst = dst["{{key}}"];	
			} else {
				dst["{{key}}"] = {};
				{{#if @last}} 
					dst["{{key}}"] = null;
				{{else}}
					dst = dst["{{key}}"];
				{{/if}}
			}
		{{/if}}
	{{else}}
		obj["{{params.objectParameter}}"] = null;
	{{/each}}

	deferred.resolve({ nextState: "{{params.nextAction.id}}", params: obj });
	return { promise: deferred };
}