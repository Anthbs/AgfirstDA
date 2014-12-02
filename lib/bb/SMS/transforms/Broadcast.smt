var {{id}} = function(obj) {
	var deferred = window.$q.defer();

	window.$rootScope.$broadcast("{{params.broadcastEvent}}", obj["{{params.broadcastParam}}"])
	deferred.resolve({ nextState: '{{params.nextAction.id}}', params: obj });

	return { promise: deferred };
}