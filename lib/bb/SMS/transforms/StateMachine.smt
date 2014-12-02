var {{id}} = function(obj) {
	var deferred = window.$q.defer();

	window.LoadTestCode("{{params.machine}}").then(
		function(testCode) { 
			var res = eval(testCode);
			var item = {
				{{#each params.SMParams}}
						{{#if isParam}}
							{{#isNotNull key}}
							"{{name}}" : obj["{{key}}"],
							{{/isNotNull}}
						{{else}}
							{{#isNotNull value}}
								{{#isNumber value}}
									"{{name}}" : {{value}},
								{{else}}
									"{{name}}" : "{{value}}",
								{{/isNumber}}
							{{/isNotNull}}
						{{/if}}
				{{/each}}
			};

			var SM = new res(item);
			SM.FSM.go(item).then(function(res) {

				{{#isNotNull params.failedAction.id}}
					obj["{{params.resultParameter}}"] = res.value;
					if(res.success == true) {
						deferred.resolve({ nextState: "{{params.nextAction.id}}", params: obj });
					} else {
						deferred.resolve({ nextState: "{{params.failedAction.id}}", params: obj });
					}
				{{else}}
					obj["{{params.resultParameter}}"] = res;
					deferred.resolve({ nextState: "{{params.nextAction.id}}", params: obj });
				{{/isNotNull}}
			});
		}
	);

	return { promise: deferred };
}