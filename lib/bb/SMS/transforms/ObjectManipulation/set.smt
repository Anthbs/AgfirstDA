var {{id}} = function(obj) {

	var deferred = window.$q.defer();

	{{#if params.objValue.isParam}}
		var src = obj["{{params.objValue.value}}"];
	{{else}}
		{{#isNumber params.objValue.value}}
			var src =  {{params.objValue.value}};
		{{else}}
			var src =  "{{params.objValue.value}}";
		{{/isNumber}}
	{{/if}}

	
	{{#arrayHasItems params.storeKeys}}
	var dst = obj["{{params.storeObjectParameter}}"];
		{{#each params.storeKeys}}
			{{#if @last}} 
				{{#if isParam}}
					if (dst != null && dst[obj["{{key}}"]] != null) {
						dst[obj["{{key}}"]] = src;
					} else {
						dst[obj["{{key}}"]] = src;
					}
				{{else}}
					if (dst != null && dst["{{key}}"] != null) {
						dst["{{key}}"] = src;	
					} else {
						dst["{{key}}"] = src;
					}
				{{/if}}
			{{else}}
				{{#if isParam}}
					if (dst != null && dst[obj["{{key}}"]] != null) {
						dst = dst[obj["{{key}}"]];
					} else {
						dst[obj["{{key}}"]] = {};
						dst = dst[obj["{{key}}"]];
					}
				{{else}}
					if (dst != null && dst["{{key}}"] != null) {
						dst = dst["{{key}}"];	
					} else {
						dst["{{key}}"] = {};
						dst = dst["{{key}}"];
					}
				{{/if}}
			{{/if}}
		{{/each}}
	{{else}}
	obj["{{params.storeObjectParameter}}"] = src;
	{{/arrayHasItems}}

	deferred.resolve({ nextState: "{{params.nextAction.id}}", params: obj });
	return { promise: deferred };
}