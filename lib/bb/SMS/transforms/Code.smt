var {{id}} = function(obj) {
	var deferred = window.$q.defer();
	var deferredCode = window.$q.defer();
	{{#isNotNull params.code}}
	{{{params.code}}}
	{{else}}
	deferred.resolve({ nextState: '{{params.nextAction.id}}', params: obj });
	{{/isNotNull}}

	deferredCode.promise.then(function(res) {
		deferred.resolve({ nextState: '{{params.nextAction.id}}', params: obj });
	},
	function(res) {
		deferred.resolve({ nextState: '{{params.failedAction.id}}', params: obj });
	});

	return { promise: deferred };
}