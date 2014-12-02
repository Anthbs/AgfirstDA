var {{id}} = function(obj) {
	var deferred = window.$q.defer();

	var listener = window.$rootScope.$on("{{params.listenerEvent}}", function(event, data) {
		listener();
		$.extend(true, obj, data);
		deferred.resolve({ nextState: '{{params.nextAction.id}}', params: obj });
	});

	return { promise: deferred };
}