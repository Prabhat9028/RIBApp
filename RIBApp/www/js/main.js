
app.controller('ContainerCtrl', ['$scope', '$state', 'Service', '$cordovaSQLite','$timeout', function($scope, $state, Service, $cordovaSQLite, $timeout){
	$scope.check = [];
	document.addEventListener("deviceready", function(){
		console.log(device.uuid);
		db = $cordovaSQLite.openDB({name:'credentials.db', location:'default'});

		FCMPlugin.onTokenRefresh(function(token){
		  console.log(token);
		  localStorage.setItem("fcmID", token);
	    });


		FCMPlugin.getToken(function(token){
          console.log(token);
          localStorage.setItem("fcmID", token);
        });

         FCMPlugin.onNotification(function(data){
            if(data.wasTapped){
              //Notification was received on device tray and tapped by the user.
              console.log( JSON.stringify(data) );
            }else{
              //Notification was received in foreground. Maybe the user needs to be notified.
              console.log( JSON.stringify(data) );
            }
        });
		var query = "CREATE TABLE IF NOT EXISTS cred (username varchar(50), key varchar(100))";
		$cordovaSQLite.execute(db, query, []).then(function(resp){
			console.log('table created');
		},function(err){
			console.log('table not created');
		});
		
		var sql = "SELECT * FROM cred";
		$cordovaSQLite.execute(db, sql, []).then(function(resp){
			if(resp.rows.length != 0){
			$scope.check.push({
			username: resp.rows.item(0).username,
			key: resp.rows.item(0).key
			});
			}
			var check = $scope.check[0];
			Service.setCred($scope.check[0]);
			$timeout(function(){
				if($scope.check.length == 0){
				   $state.go('login');
				}
			else{
			Service.checkCreds(check).then(function(resp){
				if(resp.data.status == 'success'){
					$state.go('home')
				   }
				   else{
                     var query = "DROP TABLE cred";
                    $cordovaSQLite.execute(db, query, []).then(function(resp){
                        console.log('table droped');
                    },function(err){
                        console.log('table not droped');
                    });
                    $state.go('login');
				   }
			});}}, 5);
			},function(err){
			console.log(err);
		});
	});

	
		
}]);

app.controller("loginCtrl", ["$scope", '$state', "Service", "$cookies", "$http", '$cordovaSQLite', function($scope, $state, Service ,$cookies, $http, $cordovaSQLite){
	Service.setCarsecure($scope);
	$scope.cred = {};
	$scope.carsecure = {};
	$scope.carsecure.login = {};
	var interval = Service.getInterval();
	clearInterval(interval);
	var ID = localStorage.getItem("fcmID");
   	console.log(ID);
   	$scope.carsecure.login.tokenID = ID;


	$scope.login = function(){
		var log = angular.copy($scope.carsecure.login);
		Service.login(log).then(function(resp){
			console.log(resp.status);
			console.log(resp.data);
			$scope.cred.username = resp.data.username;
			$scope.cred.key = resp.data.key;
			$scope.cred.name = resp.data.displayname;
			Service.setCred($scope.cred);
			if(resp.data.status == "success"){
				
				document.addEventListener("deviceready", function(){
		
					db = $cordovaSQLite.openDB({name:'credentials.db', location:'default'});
		
					var query = "INSERT INTO cred (username, key) values (?,?)";
					
					$cordovaSQLite.execute(db, query, [resp.data.username, resp.data.key]).then(function(resp){
						console.log('value inserted');
						},function(err){
							console.log('value not inserted');
						});			
					});
			   $state.go('home');
			   }
			else{
				alert("wrong email or password");
			}
		})
	}

	document.addEventListener("backbutton",function(){
            navigator.app.exitApp();
	})

	$scope.signup = function(){
		$state.go('signup');
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
		if($scope.carsecure.user.password1 == $scope.carsecure.user.password2){
		Service.registeruser(user).then(function(resp){
			var email = resp.data.email;
			Service.setEmail(email);
			$state.go('registervehicle');
		});
		}
		else{
		    alert("Password not match");
		}
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
	$scope.regvehicle = function(){
		var vehicle = angular.copy($scope.carsecure.regvehicle);
		Service.registervehicle(vehicle).then(function(resp){
		console.log(resp.status);
		console.log($scope.carsecure.regvehicle);
			$state.go('login');
		});
	};
}]);


app.controller("homeCtrl", ["$scope", '$state', "Service", 'toastr','$timeout', '$cordovaSQLite', function($scope, $state, Service, toastr, $timeout, $cordovaSQLite){
	
	$scope.credential = {};
	$scope.credential = Service.getCred();
	var cred = $scope.credential;
	console.log(cred);

	Service.getNotifications(cred).then(function(resp){
		console.log(resp.data);
		$scope.notificationData = resp.data.data;
	});

	Service.getvehicle(cred).then(function(resp){
    		console.log(resp.data);
    		$scope.carName = resp.data.name;
    		$scope.carDesp = resp.data.description;

    	});
	
	var setInter = setInterval(function(){Service.getNotifications(cred).then(function(resp){
		console.log(resp.data);
		$scope.notificationData = resp.data.data;
	});},2000);
	
	Service.setInterval(setInter);
	
	$scope.slideIn = function() {
        document.getElementById('info-sidebar').style.width = '0vw';
        document.getElementById('info-sidebar').style.left = '-80vw';
    }
	
	$scope.logout = function(){
		debugger;
		Service.logout(cred).then(function(resp){
		document.addEventListener("deviceready", function(){
		
		db = $cordovaSQLite.openDB({name:'credentials.db', location:'default'});

		var query = "DELETE FROM cred WHERE username = ?";

		$cordovaSQLite.execute(db, query, [cred.username]).then(function(resp){
			console.log('value deleted');
			},function(err){
				console.log('value deleted');
			});			
		});	
		$state.go("login");
		});
	}
	
	$scope.userAction = function(option, id){
		$scope.credential.useraction = option;
		$scope.credential.notificationId = id;
		var data = $scope.credential;
		debugger;
		Service.userAction(data).then(function(resp){
			console.log(resp.data);
			if(resp.data.status == 'success'){
			   $timeout(function(){
				   Service.getNotifications(cred).then(function(resp){
					$scope.notificationData = resp.data.data;
				});}, 4500);
				toastr.success(option.toLowerCase() + ' successfully');
			   }
		})
	}

	document.addEventListener("backbutton",function(){
                navigator.app.exitApp();
    	})
}]);

app.service("Service",["$http", 'serverUrl', function($http, serverUrl){
	this.carsecure  = "";
	this.respEmail = "";
	this.cred = "";
	this.setInter = '';
	
	this.setInterval = function(interval){
		this.setInter = interval;
	}
	
	this.getInterval = function(){
		return this.setInter;
	}
	
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
            url: serverUrl + "/api/logout",
            data: data
        });
	}
	
	this.login = function(data){
        return $http({
            method: 'POST',
            url: serverUrl + "/api/login",
            data: data
        });
    };
	
	this.registeruser = function(data){
        return $http({
            method: 'POST',
            url: serverUrl + "/api/reguser",
            data: data
        });
    };
	
	this.registervehicle = function(data){
        return $http({
            method: 'POST',
            url: serverUrl + "/api/regvehicle",
            data: data
        });
    }
	
	this.getvehicle = function(credential){
        return $http({
            method: "POST",
            url: serverUrl + "/api/getvehicle",
			data: credential
        });
    };
	
	this.getNotifications = function(credential){
		 return $http({
            method: "POST",
            url: serverUrl + "/api/getallnotifications",
			data: credential,
			ignoreLoadingBar: true
        });
	}
	
	this.userAction = function(credential){
		 return $http({
            method: "POST",
            url: serverUrl + "/api/useraction",
			data: credential
        });
	}
	
	this.checkCreds = function(cred){
		return $http({
            method: "POST",
            url: serverUrl + "/api/checkcreds",
			data: cred
        });	
	}
}]);