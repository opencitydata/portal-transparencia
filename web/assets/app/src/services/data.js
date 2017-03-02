app.service('data', function($interval, $log, $http) {
  
    var taxonomy =  { "sector-publico" : 
						{ "factura" : "Facturas" , 
						  "presupuesto" : { 
								"ingreso-corriente" : "Presupuestos Ingresos", 
								"gasto-corriente" : "Presupuestos Gastos" }, 
						  "anuncio-municipal" : "Anuncios Municipales", 
						  "normativa-municipal" : "Normativa Municipal" }, 
						  "gobierno-abierto" : { "propuesta" : "Propuestas Ciudadanas"},
					  "medio-ambiente" : {"animal-en-adopcion": "Adopcion Animales"}
					};
    //public methods 
    var maxItemsPerPage = 50;
    var lastPageVisited = 0;
    var lastRouteVisited = null;
    var lastSearchTerm = null;

    this.generateMenu = function() {
        var menu = [];
        for(var section in taxonomy) {
          for(var resource in taxonomy[section]) {
           if (typeof taxonomy[section][resource] == "string") {
              menu.push({"label" : taxonomy[section][resource], "route" : section + "/" + resource })
           } else {
              for (var subresource in taxonomy[section][resource]) {
                  menu.push({"label" : taxonomy[section][resource][subresource], "route" : section + "/" + resource + "/" + subresource })
              }
           }
          }
    	}
    	return menu;
    };

    this.loadData = function(section, resource, subresource, id, page, searchTerm, scope) {

      var suffix = resource == "propuesta" ? "/aportacion" : "";
      var start = page * maxItemsPerPage;
      var component = null;
      //we need to serialize the query to FIQL
      if (searchTerm) {
        if (subresource=='ingreso-corriente') {
           fieldName = 'aplicacion';
        } else if (subresource=='gasto-corriente') {
           fieldName = 'partida';
        } else {
           fieldName = 'title';
        }

        searchTerm = fieldName+"=="+searchTerm+"*";
        console.log(searchTerm);
        component = encodeURIComponent("?start=" + start + "&q=" + searchTerm);
      } else {
        component = encodeURIComponent("?start=" + start);        
      }

      //hack!
     
      var url = id ? generateRequestUrl(section, resource, subresource) + encodeURIComponent("/" + id + suffix) : generateRequestUrl(section, resource, subresource)  + "&params=" + component;
      $http({
        method: 'GET',
        url: url
      }).then(function successCallback(response) {

          scope.data=response.data;
          scope.lastPage = Math.ceil(scope.data.totalCount/parseFloat(maxItemsPerPage)) - 1;
          updatePagination(scope);
          console.log(scope.data);
          scope.loaded=true;

          if (resource == "propuesta" && id) {
             loadPropuesta(section, resource, subresource, id, scope);
          }

        }, function errorCallback(response) {
          alert("Something wrong happened!");
        });

    };


    this.getTitle = function(section,resource,subresource) {
        
        if (subresource) {
             return taxonomy[section][resource][subresource];
        } else {
             return taxonomy[section][resource];
        }

    };

    this.updatePagination = function(scope) {
       updatePagination(scope);
    }

    this.getLastPageVisited = function() {
       return lastPageVisited;
    }

    this.setLastPageVisited = function(lastPageVisitedLocal) {
       lastPageVisited = lastPageVisitedLocal;
    }

    this.getLastRouteVisited = function() {
        return lastRouteVisited;
    }

    this.setLastRouteVisited = function(lastRouteVisitedLocal) {
        lastRouteVisited = lastRouteVisitedLocal;
    }

    this.getLastSearchTerm = function() {
        return lastSearchTerm;
    }

    this.setLastSearchTerm = function(lastSearchTermLocal) {
        lastSearchTerm = lastSearchTermLocal;
    }
    

    //private methods

    var updatePagination = function(scope) {
       
      var paginationEnd = ((scope.page+5)>scope.lastPage) ? scope.lastPage : scope.page+5;
      var paginationStart = ((scope.page-5)<0) ? 0 : scope.page-5;
      scope.pagination = [];

      for (var i = paginationStart; i <= paginationEnd; i++) {
          scope.pagination.push(i);
      }

    }

    var loadPropuesta = function(section, resource, subresource, id, scope) {
        
      var component = encodeURIComponent("?q=id" + "==" + id);
      var url = generateRequestUrl(section, resource, subresource) + "&params=" + component;
      $http({
        method: 'GET',
        url: url
      }).then(function successCallback(response) {
          //merging data 
          angular.extend(scope.data, response.data.result[0]);
          console.log(scope.data);
        }, function errorCallback(response) {
          alert("Something wrong happened!");
        });

    };

    var generateRequestUrl = function(section,resource,subresource) {

        if (subresource) {
             return "/proxy?resource=" + encodeURIComponent(section + "/" + resource + "/" + subresource);
        } else {
             return "/proxy?resource=" + encodeURIComponent(section + "/" + resource);
        }

    };

});
