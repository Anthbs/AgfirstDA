var {{id}} = function(obj) {

	var deferred = window.$q.defer();
	var src = obj["{{params.objectParameter}}"];

	{{#each params.keys}}
		{{#if isParam}}
			if (src != null && src[obj["{{key}}"]] != null) {
				src = src[obj["{{key}}"]];
			} else {
				src[obj["{{key}}"]] = null;
			}
		{{else}}
			if (src != null && src["{{key}}"] != null) {
				src = src["{{key}}"];	
			} else {
				src["{{key}}"] = null;
			}
		{{/if}}
	{{/each}}


	{{#arrayHasItems params.storeKeys}}
	var dst = obj["{{params.storeObjectParameter}}"];
		{{#each params.storeKeys}}
			{{#if isParam}}
				if (dst != null && dst[obj["{{key}}"]] != null) {
					dst = dst[obj["{{key}}"]];
				} else {
					dst[obj["{{key}}"]] = {};
					{{#if @last}} 
						dst[obj["{{key}}"]] = angular.copy(src);
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
						dst["{{key}}"] = angular.copy(src);
					{{else}}
						dst = dst["{{key}}"];
					{{/if}}
				}
			{{/if}}
		{{/each}}
	{{else}}
	obj["{{params.storeObjectParameter}}"] = src;
	{{/arrayHasItems}}

	deferred.resolve({ nextState: "{{params.nextAction.id}}", params: obj });
	return { promise: deferred };
}