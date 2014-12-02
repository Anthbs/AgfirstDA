var {{id}} = function(obj) {
	var deferred = window.$q.defer();

	if(obj["{{params.repeatParameter}}"] == null) { 
		obj["{{params.repeatParameter}}"] = 0; 
	}

	obj["{{params.repeatParameter}}"]++;

	if(obj["{{params.repeatParameter}}"] < obj["{{params.repeatTimesParameter}}"]) {
		deferred.resolve({ nextState: "{{params.repeatAction.id}}", params: obj });
	} else {
		deferred.resolve({ nextState: "{{params.nextAction.id}}", params: obj });
	}

	return { promise: deferred };
};