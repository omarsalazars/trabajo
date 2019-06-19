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
    })
        .when("/empresa/:id",{
        templateUrl: '../enterprise.html',
        controller: 'enterpriseController'
    })
        .when("/enterprise/:id",{
        templateUrl: '../publicEnterprise.html',
        controller:"publicEnterpriseController"
    })
        .when("/usuario/:id",{
        templateUrl: '../user.html',
        controller:'userController'
    });
});

angular.module('myApp').run(function($rootScope, $http, $location, $localStorage, $templateCache){
    // keep user logged in after page refresh
    if ($localStorage.currentUser) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        $rootScope.email=$localStorage.currentUser.user.email;
        $rootScope.logged=true;
        console.log($localStorage.currentUser.user.email);
    }

    // redirect to login page if not logged in and trying to access a restricted page
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var publicPages = ['/login','/','/buscar','/signin'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !$localStorage.currentUser) {
            $location.path('/');
        }
    });
});

app.controller("publicEnterpriseController",function($scope,$http,$routeParams){
    var url = 'http://localhost:3000/api/enterprises/'+$routeParams.id;
    console.log(url);
    $http({
        method:'GET',
        url: url
    }).then(
        function success(response){
            $scope.enterprise=response.data.enterprise;
        },
        function error(response){
            alert("No tenemos información de esa empresa")
        }
    );

});

app.controller('enterpriseController',function($http,$localStorage,$scope,$routeParams){
    var url = 'http://localhost:3000/api/enterprises/'+$routeParams.id;
    console.log(url);
    $http({
        method: 'GET',
        url: url
    }).then(
        function success(response){
            console.log(response);
            $scope.enterprise = response.data.enterprise;
            $scope.admins = $scope.enterprise.admins;
        },
        function error(response){
            console.log(response);
        }
    );

    //Get offers by enterprise id
    //Get Applications by enterprise id
    //createOffer

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

        //falta actualizar usuario por PUT

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
                var image = document.querySelector('#profile').src;
                document.querySelector('#profile').src='';
                document.querySelector('#profile').src=image;
            },
            function error(response){
                console.log(response);
            }
        );
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

app.controller('enterprisesController', function($scope,
                                                  $http){
    $scope.split_enterprises=[];
    $http({
        method:'GET',
        url:'http://localhost:3000/api/enterprises'
    }).then(
        function success(response){
            $scope.enterprises = response.data.enterprises;
            for(var i=0;i<$scope.enterprises.length;i+=2){
                $scope.split_enterprises.push($scope.enterprises.slice(i,i+2));
            }
            console.log($scope.split_enterprises);
        },
        function error(response){
            alert("No hay empresas registradas :(");
        }
    );
});

app.controller('searchController',function($scope,$http){
    $http.get('api/offers').then(function(response){
        $scope.offers = response.data.offers;
    });
});