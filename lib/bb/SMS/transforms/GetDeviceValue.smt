var {{id}} = function(obj) {
	var deferred = window.$q.defer();
	window.DeviceService.GetValue(obj["{{params.deviceType}}"]).then( 
		function(data) {
			if(data.success == true) {
				{{#isNotNull params.resultKey}}
				obj["{{params.deviceValueParameter}}"] = data.measure['{{params.resultKey}}'];
				{{else}}
				obj["{{params.deviceValueParameter}}"] = data.measure;
				{{/isNotNull}}
				deferred.resolve({ nextState: '{{params.nextAction.id}}', params: obj });
			} else {
				deferred.resolve({ nextState: "{{params.errorAction.id}}", params: obj });
			}
		}
	);
	return { promise: deferred };
}