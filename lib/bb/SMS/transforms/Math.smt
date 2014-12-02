var {{id}} = function(obj) {
	var deferred = window.$q.defer();

	obj["{{params.saveParam}}"] = obj["{{params.firstParam}}"] {{{params.operation}}} obj["{{params.secondParam}}"];
	deferred.resolve({ nextState: '{{params.nextAction.id}}', params: obj });
	
	return { promise: deferred };
}