
app.controller('ContainerCtrl', ['$scope', '$state', 'Service', function($scope, $state, Service){
	$state.go('login');
}]);

app.controller("loginCtrl", ["$scope", '$state', "Service", "$cookies", "$http", function($scope, $state, Service ,$cookies, $http){
	Service.setCarsecure($scope);
	$scope.cred = {};
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
	$scope.signup = function(){
		$state.go('signup');
	}
	$scope.login = function(){
		var log = angular.copy($scope.carsecure.login);
		Service.login(log).then(function(resp){
			console.log(resp.status);
			console.log(resp.data);
			$scope.cred.username = resp.data.username;
			$scope.cred.key = resp.data.key;
			Service.setCred($scope.cred);
			console.log($cookies.get("username"));
			console.log($cookies.get("key"));
			debugger;
			if(resp.data.status == "success"){
//			   $state.go('home');
			   }
			else{
				alert("wrong email or password");
			}
		})
	}	
}]);


app.controller("registerUser",["$scope", '$state', "Service", function($scope, $state, Service){
	Service.setCarsecure($scope); 
	var email = "";
	$scope.carsecure = {};
	$scope.carsecure.login = {};
  	$scope.carsecure.user = {};
	$scope.carsecure.regvehicle = {};
	$scope.reguser = function(){
		var user = angular.copy($scope.carsecure.user);
		console.log($scope.carsecure);
		Service.registeruser(user).then(function(resp){
			var email = resp.data.email;
			Service.setEmail(email);
			debugger;
			$state.go('registervehicle');
		});
	};
	$scope.login = function(){
		$state.go('login');
	}
}]);

app.controller("registerVehicle", ["$scope", '$state', "Service", function($scope, $state, Service){
	Service.getCarsecure();
	$scope.carsecure = {};
	$scope.carsecure.regvehicle = {};
	$scope.carsecure.regvehicle.email = Service.getEmail();
	debugger;
	$scope.regvehicle = function(){
		var vehicle = angular.copy($scope.carsecure.regvehicle);
		debugger;
		Service.registervehicle(vehicle).then(function(resp){
		console.log(resp.status);
		console.log($scope.carsecure.regvehicle);
			$state.go('login');
		});
	};
}]);


app.controller("homeCtrl", ["$scope", '$state', "Service", function($scope, $state, Service){

	var credential = Service.getCred();
	console.log(credential);
	debugger;
	Service.getvehicle(credential).then(function(resp){
		console.log(resp.data);
	});
	
	$scope.slideIn = function() {
        document.getElementById('info-sidebar').style.width = '0vw';
        document.getElementById('info-sidebar').style.left = '-20vw';
    }
	
	$scope.logout = function(){
		Service.logout(credential).then(function(resp){
		$state.go("login");
		});
	}
	
}]);

app.service("Service",["$http", function($http){
	this.carsecure  = "";
	this.respEmail = "";
	this.cred = "";
	
	this.setCred = function(credential){
		this.cred = credential;
	}
	
	this.getCred = function(){
		return this.cred;
	}
	
	
	this.setEmail = function(email){
		this.respEmail = email;	
		debugger;
	}
	
	this.getEmail = function(){
		return this.respEmail;
		debugger;
	}
	
	this.setCarsecure = function(scope){
        this.carsecure = scope;
    }

    this.getCarsecure = function(){
      return this.carsecure;
    }
	
	this.logout  = function(data){
		return $http({
            method: 'POST',
            url: "http://carsecure.herokuapp.com/api/logout",
            data: data
        });
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
	
	this.getvehicle = function(credential){
        return $http({
            method: "POST",
            url: "http://carsecure.herokuapp.com/api/getvehicle",
			data: credential
        });
    };
	
}]);