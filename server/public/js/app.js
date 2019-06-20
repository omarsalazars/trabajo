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
        .when("/oferta/:id",{
        templateUrl: '../oferta.html',
        controller: 'ofertaController'
    })
        .when("/aplicacion/:id",{
        templateUrl: '../aplicacion.html',
        controller: "aplicacionController"
    });
});


//Vista al público de la oferta
app.controller("ofertaController", function($scope,$routeParams, $localStorage, $window, HttpService){
    $scope.getEnterprise = function(){
        HttpService.getEnterpriseById(
            $scope.offer.enterprise,
            function(result){
                $scope.enterprise = HttpService.enterprise;
            }
        );
    }

    $scope.getOffer = function(){
        HttpService.getOfferById(
            $routeParams.id,
            function(result){
                $scope.offer = HttpService.offer;
                console.log($scope.offer);
                $scope.getEnterprise();
            }
        );
    };

    $scope.proceedApplication = function(offer){
        HttpService.addApplication(
            $localStorage.currentUser.user,
            offer,
            $localStorage.currentUser.token,
            function(result){
                $window.location.href="/aplicacion/"+HttpService.application._id;
            }
        );
    }

    $scope.getOffer();

});

app.controller("offerController",function($scope,$routeParams,HttpService){

    $scope.getOffer = function(){
        HttpService.getOfferById(
            $routeParams.id,
            function(result){
                $scope.offer = HttpService.offer;
            }
        );
    };

    $scope.updateOffer = function(){
        HttpService.updateOfferInfo(
            $scope.offer,
            function(result){
                $scope.offer = HttpService.offer;
            }
        );
    }

    $scope.getOffer();

});

app.controller("publicEnterpriseController",function($scope,$routeParams, $window, $localStorage, HttpService){

    $scope.getEnterprise = function(){
        HttpService.getEnterpriseById(
            $routeParams.id,
            function(result){
                $scope.enterprise = HttpService.enterprise;
            }
        );
    }

    $scope.getOffers = function(){
        HttpService.getOffersByEnterpriseId(
            $routeParams.id,
            function(result){
                $scope.offers = HttpService.offers;
            }
        );
    }

    $scope.getEnterprise();
    $scope.getOffers();
});

app.controller('enterpriseController',function($localStorage,$scope,$routeParams,$window,HttpService){


    //GET ENTERPRISE INFO
    $scope.getEnterprise = function(){
        HttpService.getEnterpriseById(
            $routeParams.id,
            function(result){
                $scope.enterprise = HttpService.enterprise;
                $scope.admins = HttpService.enterprise.admins;
            }
        );
    };

    //PUT ENTERPRISE
    $scope.updateEnterprise = function(){
        HttpService.updateEnterpriseInfo(
            enterprise,
            $localStorage.currentUser.token,
            function(result){
                alert('Se actualizó correctamente');
            }
        );
    };

    //GET APPLICATIONS
    $scope.getApplications = function(){
        HttpService.getApplicationsByEnterpriseId(
            $routeParams.id,
            function(result){
                $scope.applications = HttpService.applications;
            }
        );
    };



    //GET OFFERS BY ENTERPRISE ID
    $scope.getOffers = function(){
        HttpService.getOffersByEnterpriseId(
            $routeParams.id,
            function(result){
                $scope.offers = HttpService.offers;
            }
        );
    }

    //POST OFFER
    $scope.addOffer = function(){
        $scope.newOffer.enterprise = $scope.enterprise;
        if(!$scope.newOffer.travel){
            $scope.newOffer.travel = false;
        }
        HttpService.addOffer(
            $scope.newOffer,
            function(result){
                $scope.getOffers();
            }
        );
    };

    //POST ADMIN
    $scope.addAdmin = function(){
        HttpService.addEnterpriseAdmin(
            $routeParams.id,
            $scope.newAdmin.email,
            $localStorage.currentUser.token,
            function(result){
                $scope.getEnterprise();
            }
        );
    };

    $scope.deleteAdmin = function(adminId){
        HttpService.deleteEnterpriseAdmin(
            $routeParams.id,
            adminId,
            $localStorage.currentUser.token,
            function(result){
                $scope.getEnterprise();
            }
        );
    }

    $scope.getEnterprise();
    $scope.getApplications();
    $scope.getOffers();

    //Get offers by enterprise id
    //Get Applications by enterprise id
    //createOffer

});






app.controller('accountController',function($scope,$localStorage,HttpService){

    $scope.enterprises = []; 

    $scope.getUser = function(){
        HttpService.getUserById(
            $localStorage.currentUser.user._id,
            function(result){
                $scope.user = HttpService.user;
            }
        );

    };

    $scope.getApplications = function(){
        HttpService.getApplicationsByUserId(
            $localStorage.currentUser.user,
            function(result){
                $scope.applications = HttpService.applications;
            }
        );
    };
    
    $scope.getEnterprises = function(){
        angular.forEach($localStorage.currentUser.user.managed_enterprises, function(value, key){
            HttpService.getEnterpriseById(value,function(result){
                $scope.enterprises.push(HttpService.enterprise);
            });
        });

    };

    $scope.updateUserImage = function(){
        var formData = new FormData();
        var file = $("#imagen").prop('files')[0];
        formData.append('file',file);

        HttpService.updateUserImage(
            $scope.user._id,
            $localStorage.currentUser.token,
            formData,
            function(result){
                var image = document.querySelector('#profile').src;
                document.querySelector('#profile').src='';
                document.querySelector('#profile').src=image;
                console.log("cambio la imagen");
            }
        );
    };

    $scope.updateUserInfo = function(){
        HttpService.updateUserInfo(
            $scope.user,
            $localStorage.currentUser.token,
            function(result){

            }
        );
    };

    $scope.updateUserCurriculum = function(){
        var formData = new FormData();
        var file = $("#curriculum").prop('files')[0];
        formData.append('file',file);

        console.log(file);

        HttpService.updateUserCurriculum(
            $scope.user._id,
            $localStorage.currentUser.token,
            formData,
            function(result){

            }
        );
    };

    $scope.update = function(){
        $scope.updateUserInfo();
        $scope.updateUserImage();
        $scope.updateUserCurriculum();
    };

    $scope.deleteApplication = function(applicationId){
        HttpService.deleteApplication(
            applicationId,
            function(result){
                $scope.getApplications();
            }
        );
    };
    
    $scope.getUser();
    $scope.getEnterprises();
    $scope.getApplications();
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

app.controller('enterprisesController', function($scope,HttpService){


    $scope.split_enterprises=[];
    $scope.getEnterprises = function(){
        HttpService.getEnterprises(function(result){
            $scope.enterprises = HttpService.enterprises;
            for(var i=0;i<$scope.enterprises.length;i+=2){
                $scope.split_enterprises.push($scope.enterprises.slice(i,i+2));
            }
            console.log($scope.enterprises);
        });
    }

    $scope.getEnterprises();
});

app.controller('searchController',function($scope,HttpService){

    $scope.getOffers = function(){
        HttpService.getOffers(function(result){
            $scope.offers = HttpService.offers;
        });
    };

    $scope.getOffers();

});

function getUrl(){
    var url = window.location.href;
    var arr = url.split("/");
    var result = arr[0] + "//" + arr[2];
    return result;
}

angular.module('myApp').run(function($rootScope, $location, $http, $localStorage, $templateCache){
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
