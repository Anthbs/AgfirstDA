(function() {
    angular.module("app.controllers").controller("ActionsCtrl", function ($scope, $log, Action) {
	    var LoadAllActions = function() {
	    	return Action.query().$promise.then(function(actions) {
	    		$log.debug("LoadAllActions - Loaded {action_count} Actions".assign({ action_count: actions.length }));
	    		Actions.AvailableActions = actions.map(function(action) {
	    			action.params = JSON.parse(action.params);
	    			return action;
	    		});
	    	});
	    }

	    var LoadAction = function(action_id) {

	    	return Test.get({ id: action_id }).$promise.then(function(action) {
	    		if(action != null && action.id != null) {
		    		$log.debug("LoadAction - Loaded {action_id}".assign({ action_id: action.id }));
		    	} else {
		    		$log.debug("LoadAction - Couldn't Load {action_id}".assign({ action_id: action.id }));
		    	}
	    	});
	    }

	    var Actions = {
    		AvailableActions: [],
	    	Functions: {
	    		LoadAllActions: LoadAllActions,
	    		LoadAction: LoadAction
	    	}
    	};

    	return Actions;
    });
}());