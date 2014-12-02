var {{id}} = function(obj) {
	var deferred = window.$q.defer();

	if($.isArray(obj["{{params.saveObjectParam}}"]) == false) {
		obj["{{params.saveObjectParam}}"] = [];
	}

	if($.isArray(obj["{{params.saveObjectParam}}"][obj["{{params.saveObjectIDParam}}"]]) == false) {
		console.log("Clearing Array", obj["{{params.saveObjectParam}}"][obj["{{params.saveObjectIDParam}}"]]);
		obj["{{params.saveObjectParam}}"][obj["{{params.saveObjectIDParam}}"]] = [];
	}

	obj["{{params.saveObjectParam}}"][obj["{{params.saveObjectIDParam}}"]].push({ id: obj["{{params.saveObjectIDParam}"], value: obj["{{params.saveObjectValueParam}}"] });

	deferred.resolve({ nextState: '{{params.nextAction.id}}', params: obj });
	return { promise: deferred };
}