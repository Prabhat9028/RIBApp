
app.controller('ContainerCtrl', ['$scope', '$state', 'Service', '$cordovaSQLite','$timeout', function($scope, $state, Service, $cordovaSQLite, $timeout){
	$scope.check = [];
	document.addEventListener("deviceready", function(){
		
		db = $cordovaSQLite.openDB({name:'credentials.db', location:'default'});
		debugger;
//		var query = "DROP TABLE cred";
//		$cordovaSQLite.execute(db, query, []).then(function(resp){
//			console.log('table droped');
//		},function(err){
//			console.log('table not droped');
//		});
		
//		FCMPlugin.onTokenRefresh(function(token){
////    alert( token );
//		debugger;
//		console.log(token);
//	});
//		
//		
//		
//		FCMPlugin.getToken(function(token){
////    alert(token);
//			debugger;
//			console.log(token);
//	});
		
//			setTimeout(getTheToken, 1000);
//
//				function getTheToken() {
//					FCMPlugin.getToken(
//						function (token) {
//							if (token == "") {
//								console.log("null token");
//								setTimeout(getTheToken, 1000);
//							} else {
//								alert(token);
//								console.log("I got the token: " + token);
//							}
//						},
//						function (err) {
//							console.log('error retrieving token: ' + err);
//						}
//					);
//				}		
		

//		
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
				debugger;
			Service.checkCreds(check).then(function(resp){
				if(resp.data.status == 'success'){
					$state.go('home')
				   }
			});}}, 10);
			},function(err){
			console.log(err);
		});
		
		
		var pushtoken;

				initFCM();
				getToken();
			


			function initFCM() {
				 FCMPlugin.onTokenRefresh(function(token){
					pushtoken = token;
					console.log('onTokenRefresh:', +token);
				 }, function(err){
					console.log('error retrieving token: ' + err);
				 });
				 FCMPlugin.onNotification(function(data){
					if(data.wasTapped){
						console.log(JSON.stringify(data));
					}else{
						console.log(JSON.stringify(data));
					}
				 }, function(msg){
					console.log('onNotification callback successfully registered: ' + msg);
				 }, function(err){
					console.log('Error registering onNotification callback: ' + err);
				 });
			}
			function getToken() {
				 FCMPlugin.getToken(function(token){
					 debugger;
					pushtoken = token;
					console.log('getToken:', +token);
					if (token == ""){
						console.log("token not receive");
					setTimeout(getToken, 2000);
					}
				 }, function(err){
					console.log('error retrieving token: ' + err);
				 });
			}
		
	});

	
		
}]);

app.controller("loginCtrl", ["$scope", '$state', "Service", "$cookies", "$http", '$cordovaSQLite', function($scope, $state, Service ,$cookies, $http, $cordovaSQLite){
	Service.setCarsecure($scope);
	$scope.cred = {};
	var interval = Service.getInterval();
	clearInterval(interval);
	
	
	
	
	
//	var pushNotification;
//	$scope.registerPush = function(){
//	debugger;
//          try {
//            pushNotification = window.plugins.pushNotification;
//            console.log(pushNotification);
//            pushNotification.register(successHandler, errorHandler, {"senderID":"501436039618","ecb":"onNotification"});
//          }
//          catch(err) {
//            txt="There was an error on this page.\n\n";
//            txt+="Error description: " + err.message + "\n\n";
//            console.log(txt);
//          }
//        }
//
//       function successHandler (result) {
//          console.log('result = ' + result);
//        }
//        
//        function errorHandler (error) {
//          console.log('error = ' + error);
//        }
//
//       function onNotification(e) {
//		   debugger;
//          switch( e.event ) {
//            case 'registered':
//                  if ( e.regid.length > 0 ){
//                    // Your GCM push server needs to know the regID before it can push to this device
//                    // here is where you might want to send it the regID for later use.
//                    console.log("regID = " + e.regid);
//                    localStorage.setItem("gcmId", e.regid);
//                  }
//                   break;                    
//            case 'message':
//                  // if this flag is set, this notification happened while we were in the foreground.
//                  // you might want to play a sound to get the user's attention, throw up a dialog, etc.
//                  if (e.foreground) {                      
//                      console.log("received message in forground");
//                  }
//                  else  {
//                  // otherwise we were launched because the user touched a notification in the notification tray.
//                      if (e.coldstart)
//                        console.log('--COLDSTART NOTIFICATION--');
//                      else
//                        console.log('--BACKGROUND NOTIFICATION--');
//                  }
////                  console.log('MESSAGE -> MSG: ' + e.payload.message);
////                  console.log('MESSAGE -> MSGCNT: ' + e.payload.msgcnt);
//                  break;
//            case 'error':
//                  console.log('ERROR -> MSG:' + e.msg);
//                  break;
//            default:
//                  console.log('EVENT -> Unknown, an event was received and we do not know what it is');
//                  break;
//          }
//        }
	
//	const messaging = firebase.messaging();
//	
	$scope.notificationID = function(){
//	messaging.getToken()
//	  .then(function(currentToken) {
//		if (currentToken) {
//	//      sendTokenToServer(currentToken);
//	//      updateUIForPushEnabled(currentToken);
//			console.log(currentToken);
//		} else {
//		  // Show permission request.
//		  console.log('No Instance ID token available. Request permission to generate one.');
//		  // Show permission UI.
//		  updateUIForPushPermissionRequired();
//		  setTokenSentToServer(false);
//		}
//	  })
//	  .catch(function(err) {
//		console.log('An error occurred while retrieving token. ', err);
//		showToken('Error retrieving Instance ID token. ', err);
//		setTokenSentToServer(false);
//	  });
		
		
		
		
	}
	
	
	
	$scope.login = function(){
		var log = angular.copy($scope.carsecure.login);
		Service.login(log).then(function(resp){
			console.log(resp.status);
			console.log(resp.data);
			$scope.cred.username = resp.data.username;
			$scope.cred.key = resp.data.key;
			$scope.cred.name = resp.data.displayname
			Service.setCred($scope.cred);
			if(resp.data.status == "success"){
//				$scope.registerPush();
				 $scope.notificationID();
				
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
	
//	var gcmId = localStorage.getItem("gcmId");
//      console.log(gcmId);
//      if (vm.userInfo.notificationId != gcmId ) {
//        console.log("User changed device");
//        vm.userInfo.notificationId = gcmId;
//        vm.userInfo.notificationType = "gcm";
//        console.log("Sending notificationType and notificationId");
//        PaymentInfoService.registerNotificationId(vm.userInfo.notificationId, vm.userInfo.notificationType);
//      }
	  
	
	
	Service.getvehicle(cred).then(function(resp){
		console.log(resp.data);
		$scope.carName = resp.data.name;
		$scope.carDesp = resp.data.description;
		
	});
	
	Service.getNotifications(cred).then(function(resp){
		console.log(resp.data);
		$scope.notificationData = resp.data.data;
	});
	
	var setInter = setInterval(function(){Service.getNotifications(cred).then(function(resp){
		console.log(resp.data);
		$scope.notificationData = resp.data.data;
	});},5000);
	
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
			data: credential
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
	
	this
	
	
}]);