var app = angular.module("index",["ngCookies"]);

app.controller("MainCtrl", ["$scope","Service", "$cookies", "$http", function($scope, Service ,$cookies, $http){
//    $scope.notLoggedIn = false;
//    if($cookies.get("username") == undefined && $cookies.get("username") != "" && $cookies.get("key") == undefined && $cookies.get("key") != "" )
//     {
//         $scope.notLoggedIn = true;
//     }else{
//        $http.get("/checkcreds").then(function(resp){
//            if(resp.data["status"] == "success"){
//                window.location="home.html";
//            }else{
//                $scope.notLoggedIn = true;
//            }
//        });
//     }
	
	$scope.login = function(){
		var log = angular.copy($scope.carsecure.login);
		Service.login(log).then(function(resp){
			console.log(resp.status);
			console.log(resp.data);
			console.log($cookies.get("username"));
			console.log($cookies.get("key"));
			debugger;
			if(resp.status == 200){
			   window.location = "home.html"
			   }
			else{
				alert("wrong email or password");
			}
		})
	}
	
	
}]);


app.controller("registerUser",["$scope", "Service", function($scope, Service){
	Service.setCarsecure($scope); 
	$scope.carsecure = {};
	$scope.carsecure.login = {};
  	$scope.carsecure.user = {};
	$scope.carsecure.regvehicle = {};
	$scope.reguser = function(){
		var user = angular.copy($scope.carsecure.user);
		console.log($scope.carsecure);
		Service.registeruser(user).then(function(resp){
			console.log(resp.data.email);
			Service.setEmail(resp.data.email);
//			$rootScope.email = resp.data.email;
			debugger;
			console.log(status); 
			window.location = "registervehicle.html";
		});
	};
}]);

app.controller("registerVehicle", ["$scope", "Service", function($scope, Service){
	Service.getCarsecure();
	console.log($scope.carsecure);
	$scope.carsecure = {};
	$scope.carsecure.regvehicle = {};
	$scope.carsecure.regvehicle.email = "";
//	$scope.carsecure.regvehicle = {};
//	$scope.carsecure.regvehicle.email = Service.getEmail();
	$scope.carsecure.regvehicle.email = Service.getEmail();
	debugger;
	$scope.regvehicle = function(){
	var vehicle = angular.copy($scope.carsecure.regvehicle);
	Service.registervehicle(vehicle).then(function(resp){
	console.log("resp.status");
	console.log($scope.carsecure.regvehicle);
		window.location = "index.html";
	});
	};
}]);

app.service("Service",["$http", function($http){
	this.carsecure  = "";
	this.email = undefined;
	
	this.setEmail = function(email){
		this.email = email;
	}
	
	this.getEmail = function(){
		return this.email;
	}
	
	this.setCarsecure = function(scope){
        this.carsecure = scope;
    }

    this.getCarsecure = function(){
      return this.carsecure;
    }
	
	
	
	this.login = function(data){
        return $http({
            method: 'POST',
            url: "http://carsecure.herokuapp.com/api/login",
            data: data
        });
    };
	
	
	
	this.registeruser = function(data){
		debugger;
        return $http({
            method: 'POST',
            url: "http://carsecure.herokuapp.com/api/reguser",
            data: data
        });
    };
	
	this.registervehicle = function(data){
		debugger;
        return $http({
            method: 'POST',
            url: "http://carsecure.herokuapp.com/api/regvehicle",
            data: data
        });
    }	
	
}]);