(function() {
    angular.module("app.controllers").controller("DisplayCtrl", function ($scope, $log, Tests) {

    	var grid = new PF.Grid(3000/25, 3000/25);

    	var pf = new PF.IDAStarFinder({
          	timeLimit: 10,
          	trackRecursion: false,
          	allowDiagonal: false,
          	dontCrossCorners: false,
          	heuristic: PF.Heuristic["manhattan"],
          	weight: 1
        });



    	var FindSides = function(from, to) {
    		var side = { name: 'bottom', x: 0, y: 0 }; //default side
    		var side1 = { name: 'bottom', x: 0, y: 0 }; //default side
			
			if(from.middle.x > to.x && from.middle.x < to.x + to.width && from.middle.y >= to.middle.y) {
				side.name = "direct up";
				side.x = Math.round(from.middle.x / 25);
				side.y = Math.round(from.y / 25);

				side1.name = "down";
				side1.x = Math.round(from.middle.x / 25);
				side1.y = Math.round((to.y + to.height) / 25);
			}

			if(from.middle.x > to.x && from.middle.x < to.x + to.width && from.middle.y < to.middle.y) {
				side.name = "direct down";
				side.x = Math.round(from.middle.x / 25);
				side.y = Math.round((from.y + from.height) / 25);

				side1.name = "top";
				side1.x = Math.round(from.middle.x / 25);
				side1.y = Math.round(to.y / 25);
			}

			if(from.middle.x < to.x && from.middle.y < to.y) {
				side.name = "right";
				side.x = Math.round((from.x + from.width) / 25);
				side.y = Math.round(from.middle.y / 25);

				side1.name = "top";
				side1.x = Math.round(to.middle.x / 25);
				side1.y = Math.round(to.y / 25);
			}

			if(from.middle.x > (to.x + to.width) && from.middle.y < to.y) {
				side.name = "bottom";
				side.x = Math.round(from.middle.x / 25);
				side.y = Math.round((from.y + from.height) / 25);

				side1.name = "right";
				side1.x = Math.round((to.x + to.width) / 25);
				side1.y = Math.round(to.middle.y / 25);
			}

			if(from.middle.x > (to.x + to.width) && from.middle.y >= to.y && from.middle.y <= (to.y + to.height)) {
				side.name = "left";
				side.x = Math.round(from.x / 25);
				side.y = Math.round(from.middle.y / 25);

				side1.name = "right";
				side1.x = Math.round((to.x + to.width) / 25);
				side1.y = Math.round(from.middle.y / 25);
			}

			if(from.middle.x < to.x && from.middle.y >= to.y && from.middle.y <= (to.y + to.height)) {
				side.name = "right";
				side.x = Math.round((from.x + from.width) / 25);
				side.y = Math.round(from.middle.y / 25);

				side1.name = "left";
				side1.x = Math.round(to.x / 25);
				side1.y = Math.round(from.middle.y / 25);
			}

			if(from.middle.x > (to.x + to.width) && from.middle.y > (to.y + to.height)) {
				side.name = "top";
				side.x = Math.round(from.middle.x / 25);
				side.y = Math.round(from.y / 25);

				side1.name = "right";
				side1.x = Math.round((to.x + to.width) / 25);
				side1.y = Math.round(to.middle.y / 25);
			}

			if(from.middle.x < to.x && from.middle.y > (to.y + to.height)) {
				side.name = "top";
				side.x = Math.round(from.middle.x / 25);
				side.y = Math.round(from.y / 25);

				side1.name = "left";
				side1.x = Math.round(to.x / 25);
				side1.y = Math.round(to.middle.y / 25);
			}
			
    		return [side,side1];
    	}

    	var CreatePath = function(from, to) {
    		var sides = FindSides(from, to);
    		var path = pf.findPath(sides[0].x + 25, sides[0].y  + 25, sides[1].x  + 25, sides[1].y  + 25, grid.clone());
    		return path;
		}

    	var CreateConnector = function(actionFrom,  actionTo, color)
    	{
    		var from = {
    			x: actionFrom.x,
    			y: actionFrom.y,
    			width: actionFrom.width,
    			height: actionFrom.height,
    			middle: {
    				x: actionFrom.x + (actionFrom.width / 2), 
    				y: actionFrom.y + (actionFrom.height / 2)
    			}
    		};
    		var to = {
    			x: actionTo.x,
    			y: actionTo.y,
    			width: actionTo.width,
    			height: actionTo.height,
    			middle: {
    				x: actionTo.x + (actionTo.width / 2), 
    				y: actionTo.y + (actionTo.height / 2)
    			}
    		};
    		if(isNaN(from.x) || isNaN(from.y) || isNaN(to.x) || isNaN(to.y), isNaN(from.width) || isNaN(from.height), isNaN(to.width) || isNaN(to.height))
    		{
    			return;
    		}

    		var path = CreatePath(from, to);
    		var pathStr = "M{1},{2} ".assign((path[0][0] - 25) * 25, (path[0][1] - 25) * 25);
    		for(var x = 1; x < path.length; x++) {
 	        	pathStr += "L{1},{2}".assign((path[x][0] - 25) * 25, (path[x][1] - 25) * 25);	
        	}

        	return pathStr;
    	}

    	var UpdateActionLine = function(action)
    	{
    		var paths = [];
    		
    		var params = [
    			{ name: 'nextAction', color: 'green' },
    			{ name: 'repeatAction', color: '#325d88' },
    			{ name: 'cancelAction', color: 'red' },
    			{ name: 'errorAction', color: 'red' },
    			{ name: 'failedAction', color: 'red' }
		 	];

		 	params.forEach(function(param) {
		 		if(action.params[param.name] != null && action.params[param.name] != "") {
		 			var path = CreateConnector(action, Tests.Selected.Test.actions.find(function(a) {
    					return a.id == action.params[param.name].id;
    				}));
    				paths.push({ path: path, color: param.color });
		 		}
		 	});

			return paths;
    	}

    	var UpdateLines = function() {
			var actionConnectors = Tests.Selected.Test.actions.map(function(action) {
    			return UpdateActionLine(action);
    		});

    		Display.Connectors = actionConnectors.flatten();
    	}

    	var DownloadSVG = function(test) {
    		var svg = $('#FlowChartSVG')[0].innerHTML;
			var blob = new Blob([svg], {type : "application/svg+xml"});
			saveAs(blob, test.id + ".svg");
    	}

	    var Display = {
    		Connectors: [],
	    	Functions: {
	    		UpdateLines: UpdateLines,
	    		DownloadSVG: DownloadSVG
	    	}
    	};

    	return Display;
    });
}());