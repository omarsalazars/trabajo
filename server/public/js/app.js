var app = angular.module('myApp',['ngRoute', 'ngStorage']);

app.config(function($routeProvider){
    $routeProvider
        .when("/",{
        templateUrl: '../landing.html',
        controller: 'indexController'
    })
        .when("/buscar",{
        templateUrl: '../search.html',
        controller: 'searchController'
    })
        .when("/empresas",{
        templateUrl: '../enterprises.html',
        controller: 'enterprisesController'
    })
        .when("/login",{
        templateUrl:'../login.html',
        controller: 'loginController'
    });
});

angular.module('myApp').run(function($rootScope, $http, $location, $localStorage, $templateCache){
    // keep user logged in after page refresh
    if ($localStorage.currentUser) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
    }

    // redirect to login page if not logged in and trying to access a restricted page
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var publicPages = ['/login','/','/buscar','/signin'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !$localStorage.currentUser) {
            $rootScope.hide=false;
            $location.path('/login');
        }
    });
});

app.controller('navController',function($scope, $localStorage, $rootScope){
    
    checkLogin();
    
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        checkLogin();
    });
    
    function checkLogin(){
        if($localStorage.currentUser){
            $rootScope.hide = true;
            $scope.email = $localStorage.currentUser.email;
        }
        else{
            $rootScope.hide = false;
        }
    }
    
});

app.controller('indexController',function($scope){

});

app.controller('loginController',function($scope, $location, AuthenticationService){
    $scope.login = function(){
        $scope.loading = true;
        AuthenticationService.Login($scope.user.email,$scope.user.password, function(result){
            if (result === true) {
                $location.path('/');
            } else {
                $scope.error = 'Username or password is incorrect';
                $scope.loading = false;
            } 
        });
    }

    initController();

    function initController() {
        // reset login status
        AuthenticationService.Logout();
    }
});

/*
app.controller('loginController',function($scope, $http, $httpParamSerializer, $localStorage){


    $scope.login = function(){
        $http({
            method: 'POST',
            url: 'http://localhost:3000/api/users/login',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: $httpParamSerializer,
            data:{
                email: $scope.user.email,
                password: $scope.user.password
            }
        }).then(function(response){
            alert('animo se hizo la machaca');
            console.log(response);
            $localStorage.currentUser = {email:$scope.user.email, token: response.data.token};
            // add jwt token to auth header for all requests made by the $http service
            $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
            callback(true);
        }, function(response){
            alert('Usuario o contraseña incorrectos :(');
            callback(false);
        });
    };
});
*/

app.controller('enterprisesController', function($scope){
    $scope.split_enterprises=[
        [
            {
                image:'img/glazzol.png',
                name:'Glazzol',
                description: 'Esta empresa está bien chidori la neta brou',
                website: 'glazzol.com',
                phone:'4492773290',
                email: 'hola@glazzol.com'
            },
            {
                image:'img/glazzol.png',
                name:'Glazzol',
                description: 'Esta empresa está bien chidori la neta brou',
                website: 'glazzol.com',
                phone:'4492773290',
                email: 'hola@glazzol.com'
            }
        ],
        [
            {
                image:'img/glazzol.png',
                name:'Glazzol',
                description: 'Esta empresa está bien chidori la neta brou',
                website: 'glazzol.com',
                phone:'4492773290',
                email: 'hola@glazzol.com'
            },
            {
                image:'img/glazzol.png',
                name:'Glazzol',
                description: 'Esta empresa está bien chidori la neta brou',
                website: 'glazzol.com',
                phone:'4492773290',
                email: 'hola@glazzol.com'
            }
        ]
    ];
});

app.controller('searchController',function($scope,$http){
    $http.get('api/offers').then(function(response){
        $scope.offers = response.data.offers;
    });
});