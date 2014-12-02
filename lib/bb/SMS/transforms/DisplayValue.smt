var {{id}} = function(obj) {
	var deferred = window.$q.defer();
	var uiP = window.ModalService.ShowResult("{{params.text}}", obj["{{params.valueParam}}"]);
	uiP.then(function(result) {
		deferred.resolve({ nextState: '{{params.nextAction.id}}', params: obj });
	}, function(error) {
		deferred.resolve({ nextState: '{{params.cancelAction.id}}', params: obj });
	});
	return { promise: deferred };
}