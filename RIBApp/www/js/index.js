var app = angular.module("RIBApp", []);

app.controller("loginCtrl", function($scope) {
    $scope.login = function(){
		if($scope.email == 'prabhatosingh80@gmail.com' && $scope.password == 'hello'){
		    location="home.html"
		   }
		else{
			alert("email or password incorrect");
		}
	}
	
});

app.controller("signupCtrl", function($scope){
	
	$scope.signup = function(){
		
		if($scope.enterPassword == $scope.reEnterPassword){
			
			location = "login.html"
			alert("Successfull Signup");
		}
		else{
			alert("Password does not match");
		}
	}
	
});