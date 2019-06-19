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
    })
        .when("/offer/:id",{
        templateUrl: '../offer.html',
        controller: 'offerController'
    })
    ;
});



app.controller("offerController",function($scope,$http,$routeParams){
    
    function getOffer = function(){
        var url = getUrl() + '/api/offers';
    };
    
    
    
});








app.controller("publicEnterpriseController",function($scope,$http,$routeParams){

    var url = getUrl() + '/api/enterprises/'+$routeParams.id;
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








app.controller('enterpriseController',function($http,$localStorage,$scope,$routeParams,$window){

    $scope.getEnterprise = function(){
        //GET ENTERPRISE INFO
        var url = getUrl() + '/api/enterprises/'+$routeParams.id;
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
    };


    //GET APPLICATIONS
    $scope.getApplications = function(){
        var url = getUrl() + '/api/applications/enterprise/' +$routeParams.id;
        $http({
            method:'GET',
            url: url
        }).then(
            function success(response){
                $scope.applications = response.data.applications;
            },
            function error(response){
                console.log("No hay applications");
            }
        );
    };



    //GET OFFERS
    $scope.getOffers = function(){
        var url = getUrl() + '/api/offers/enterprise/'+$routeParams.id;
        $http({
            method:'GET',
            url: url
        }).then(
            function success(response){
                $scope.offers = response.data.offers;
            },
            function error(response){
                console.log("No hay applications");
            }
        );
    }

    //POST OFFER
    $scope.addOffer = function(){
        var url = getUrl() + '/api/offers';
        $http({
            method: 'POST',
            url: url,
            data: {
                enterprise: $scope.enterprise,
                position: $scope.newOffer.position,
                description: $scope.newOffer.description,
                salary: $scope.newOffer.salary,
                travel: $scope.newOffer.travel
            }
        }).then(
            function success(response){
                alert('Oferta registrada');
                $scope.getOffers();
            },
            function error(response){
                alert('Ocurrio un error registrando la oferta, intentelo más tarde');
                console.log(response);
            }
        );
    };


    //POST ADMIN
    $scope.addAdmin = function(){
        console.log('ADD ADMIN');
        var url = getUrl() + '/api/enterprises/'+ $routeParams.id + '/addAdmin';
        console.log($scope.newAdmin.email);
        console.log(url);

        $http({
            method: 'POST',
            url: url,
            headers: {
                token: $localStorage.currentUser.token
            },
            data: {
                email: $scope.newAdmin.email
            }
        }).then(
            function success(response){
                alert('Administrador añadido correctamente');
                console.log('aaa');
                console.log(response);
                $scope.getEnterprise();
            },
            function error(response){
                alert('No se pudo añadir al administrador');
            }
        );
    };

    $scope.getEnterprise();
    $scope.getApplications();
    $scope.getOffers();

    //Get offers by enterprise id
    //Get Applications by enterprise id
    //createOffer

});






app.controller('accountController',function($scope,$localStorage,$http){
    var url = getUrl() + '/api/users/'+$localStorage.currentUser.user._id;
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
        url = getUrl() + '/api/enterprises/'+value;
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

        var url = getUrl() + '/api/users/upload/images/';
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
        url: getUrl() + '/api/enterprises'
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

function getUrl(){
    var url = window.location.href;
    var arr = url.split("/");
    var result = arr[0] + "//" + arr[2];
    return result;
}

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
