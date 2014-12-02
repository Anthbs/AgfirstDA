var {{id}} = function(obj) {
	{{#isNull params.objectParameter}}
		var tmp = obj;
	{{else}}
		var tmp = obj["{{params.objectParameter}}"];
	{{/isNull}}
	{{#each params.keys}}
		{{#if isParam}}
			if (tmp != null && tmp[obj["{{key}}"]] != null) {
				tmp = tmp[obj["{{key}}"]];
			} else {
				tmp = null;
			}
		{{else}}
			if (tmp != null && tmp["{{key}}"] != null) {
				tmp = tmp["{{key}}"];	
			} else {
				tmp = null;
			}
		{{/if}}
	{{/each}}

	{{#if params.returnBool}}
		{{#if params.returnTrue}}
		return { end: true, params: { success: true, value: tmp } };
		{{else}}
		return { end: true, params: { success: false, value: tmp } };
		{{/if}}
	{{else}}
	return { end: true, params: tmp };
	{{/if}}
}