var app = angular.module("index",["ngCookies"]);

app.controller("MainCtrl", ["$scope", "$cookies", "$http", function($scope, $cookies, $http){
    $scope.notLoggedIn = false;
    if($cookies.get("username") == undefined && $cookies.get("username") != "" && $cookies.get("key") == undefined && $cookies.get("key") != "" )
     {
         $scope.notLoggedIn = true;
     }else{
        $http.get("/checkcreds").then(function(resp){
            if(resp.data["status"] == "success"){
                window.location="home.html";
            }else{
                $scope.notLoggedIn = true;
            }
        });
     }
}]);


app.controller("register",["$scope", "Service", function($scope,Service){
	Service.setCarsecure($scope); 
  	$scope.carsecure = {};	
	$scope.reguser = function(){
		var carsecure = angular.copy($scope.carsecure);
		console.log($scope.carsecure);
		Service.registeruser(carsecure).then(function(resp){
			var status = resp.status;
			console.log(status);
			window.location = "registervehicle.html";
		})
	}
	
}]);

app.service("Service",["$http", function($http){
	this.carsecure  = "";
	
	this.setCarsecure = function(scope){
        this.carsecure = scope;
    }

    this.getCarsecure = function(){
      return this.carsecure;
    }
	
	this.registeruser = function(data){
		debugger;
        return $http({
            method: 'POST',
            url: "http://carsecure.herokuapp.com/reguser",
            data: data
        });
    };
	
	
	
}]);