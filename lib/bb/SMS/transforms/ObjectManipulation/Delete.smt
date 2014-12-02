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
					delete dst[obj["{{key}}"]];
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
					delete dst["{{key}}"];
				{{else}}
					dst = dst["{{key}}"];
				{{/if}}
			}
		{{/if}}
	{{else}}
		delete obj["{{params.objectParameter}}"];
	{{/each}}

	deferred.resolve({ nextState: "{{params.nextAction.id}}", params: obj });
	return { promise: deferred };
}