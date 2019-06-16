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
    })
        .when("/cuenta",{
        templateUrl: '../account.html',
        controller: 'accountController'
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
            $location.path('/');
        }
    });
});

app.controller('accountController',function($scope,$localStorage,$http){
    var url = 'http://localhost:3000/api/users/'+$localStorage.currentUser.user._id;
    $http({
        method: 'GET',
        url: url,
    }).then(
        function success(response){
            console.log(response);
            $scope.user = response.data.user;
        },
        function error(response){
            console.log(response);
        }
    );

    $scope.enterprises = []; angular.forEach($localStorage.currentUser.user.managed_enterprises, function(value, key){
        url = 'http://localhost:3000/api/enterprises/'+value;
        $http({
            method: 'GET',
            url: url,
        }).then(
            function success(response){
                console.log(response);
                $scope.enterprises.push(response.data.enterprise);
            },
            function error(response){
                console.log(response);
            }
        );
    });

    $scope.update = function(){
        var form = document.querySelector("#form");
        var formData = new FormData();
        var file = $("#imagen").prop('files')[0];
        formData.append('file',file);

        var url = 'http://localhost:3000/api/users/upload/images/';
        var data = formData;
        console.log(data);
        $http({
            url: url,
            method: 'POST',
            headers: {
                token: $localStorage.currentUser.token,
                'Content-Type' : undefined
            },
            data: data
        }).then(
            function success(response){
                console.log(response);
            },
            function error(response){
                console.log(response);
            }
        );
    }
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