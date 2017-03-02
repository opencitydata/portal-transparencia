app.controller('DataCtrl', function ($window, $scope, data, $routeParams) {
     
    var templateBase = "/assets/app/src/views/partials/";
	$scope.section = $routeParams.section;
	$scope.resource = $routeParams.resource;
	$scope.subresource = $routeParams.subresource;
	$scope.itemId = $routeParams.id;
	$scope.data = [];
	$scope.loaded = false;
	$scope.searchTerm = '';

	$scope.link = encodeURIComponent($window.location.href);

	$scope.$watch($routeParams, function(newValue, oldValue) {

       if ($routeParams.section) {
            
            $scope.title = data.getTitle($scope.section, $scope.resource, $scope.subresource);

			if ($scope.subresource) {
			   $scope.headerTemplate = getPartial("header", $scope.subresource);
			   $scope.itemTemplate = getPartial("item", $scope.subresource);
			   $scope.showTemplate = getPartial("show", $scope.subresource);
		       $scope.currentRoute = $scope.section + "/" + $scope.resource + "/" + $scope.subresource;
			} else {
			   $scope.headerTemplate = getPartial("header", $scope.resource);
			   $scope.itemTemplate = getPartial("item", $scope.resource);
			   $scope.showTemplate = getPartial("show", $scope.resource);
		       $scope.currentRoute = $scope.section + "/" + $scope.resource;
			}

			$scope.$parent.currentRoute = $scope.currentRoute;

			if ($scope.currentRoute!=data.getLastRouteVisited()) {
				$scope.page = 0;
				data.setLastPageVisited(0);
				data.setLastRouteVisited($scope.currentRoute);
				data.setLastSearchTerm($scope.searchTerm);
			} else {
			    $scope.page = data.getLastPageVisited() ? data.getLastPageVisited() : 0;
			    $scope.searchTerm = data.getLastSearchTerm();
			    $scope.newSearch = $scope.searchTerm;
		    }

	        $scope.lastPage = 0;
	
			data.loadData($scope.section, $scope.resource, $scope.subresource, $scope.itemId, $scope.page, $scope.searchTerm, $scope);

       }

	});

	var getPartial = function(type,name) {
		return templateBase + type + "/" + name + ".html";
	};

    $scope.htmlToPlaintext = function(text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };

    $scope.formalizeDate = function(date) {
    	return date ? date.substring(6, 8) + "/" + date.substring(4, 6) + "/" + date.substring(0, 4) : false;
    }

    $scope.goToPage = function(page) {

    	$scope.loaded = false;
    	$scope.page = page;
    	data.setLastPageVisited($scope.page);
        data.updatePagination($scope);
    	data.loadData($scope.section, $scope.resource, $scope.subresource, $scope.itemId, $scope.page, $scope.searchTerm, $scope);
    }

    $scope.search = function() {

    	$scope.loaded = false;
    	if ($scope.newSearch) {
	    	$scope.searchTerm = $scope.newSearch;
	    	$scope.page = 0;
			data.setLastPageVisited(0);
			data.setLastSearchTerm($scope.searchTerm);
	    	data.loadData($scope.section, $scope.resource, $scope.subresource, $scope.itemId, $scope.page, $scope.searchTerm, $scope);
        }
        //load data
    };

});