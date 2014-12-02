var {{id}} = function(obj) {
	var deferred = window.$q.defer();

	var uiP = window.ModalService.ShowUserInput("{{params.question}}");
	uiP.then(function(result) {
		obj["{{params.userInputParameter}}"] = result;
		deferred.resolve({ nextState: "{{params.nextAction.id}}", params: obj });
	}, function(error) {
		obj["{{params.userInputParameter}}"] = error;
		deferred.resolve({ nextState: "{{params.cancelAction.id}}", params: obj });
	});
	
	return { promise: deferred };
};