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
    })
        .when("/application/:id",{
        templateUrl: '../application.html',
        controller: "applicationController"
    })
        .when("/signin",{
        templateUrl: '../signin.html',
        controller: 'signinController'
    });
});

app.controller("signinController",function($scope, HttpService, $window){
    $scope.addUser = function(){
        HttpService.addUser(
            $scope.user,
            function(result){
                if(result){
                    $window.location.href="#!login";
                }
            }
        );
    }
});

app.controller("applicationController",function($scope, $routeParams, HttpService){

    $scope.getApplication = function(){
        HttpService.getApplicationById(
            $routeParams.id,
            function(result){
                $scope.application = HttpService.application;
                $scope.getEnterprise();
                console.log($scope.application)
            }
        );
    };

    $scope.getEnterprise = function(){
        HttpService.getEnterpriseById(
            $scope.application.offer.enterprise,
            function(result){
                $scope.application.offer.enterprise = HttpService.enterprise;
            }
        );
    }

    $scope.proceedApplication = function(){
        HttpService.proceedApplication(
            $scope.application._id,
            function(result){
                $scope.getApplication();
            }
        );
    }

    $scope.getApplication();
});

//Vista de usuario de la aplicacion
app.controller("aplicacionController",function($scope, $routeParams, HttpService){

    $scope.getApplication = function(){
        HttpService.getApplicationById(
            $routeParams.id,
            function(result){
                $scope.application = HttpService.application;
                $scope.getEnterprise();
                console.log($scope.application)
            }
        );
    };

    $scope.getEnterprise = function(){
        HttpService.getEnterpriseById(
            $scope.application.offer.enterprise,
            function(result){
                $scope.application.offer.enterprise = HttpService.enterprise;
            }
        );
    };

    $scope.uploadAnswers = function(){

        var formData = new FormData();
        var file = $("#answers").prop('files')[0];
        formData.append('file',file);

        HttpService.uploadAnswers(
            $scope.application,
            formData,
            function(result){
                $scope.proceedApplication();
            }
        );
    };

    $scope.proceedApplication = function(){
        HttpService.proceedApplication(
            $scope.application._id,
            function(result){
                $scope.getApplication();
            }
        );
    }

    $scope.getApplication();

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
                $window.location.href="#!aplicacion/"+HttpService.application._id;
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
    $scope.updateEnterpriseInfo = function(){
        HttpService.updateEnterpriseInfo(
            $scope.enterprise,
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
                console.log($scope.applications);
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

    $scope.updateEnterpriseImage = function(){
        var formData = new FormData();
        var file = $("#imagen").prop('files')[0];
        formData.append('file',file);

        HttpService.updateEnterpriseImage(
            $scope.enterprise._id,
            formData,
            function(result){
                var image = document.querySelector('#profile').src;
                document.querySelector('#profile').src='';
                document.querySelector('#profile').src=image;
                console.log("cambio la imagen");
            }
        );
    };

    $scope.updateEnterprise = function(){
        $scope.updateEnterpriseInfo();
        $scope.updateEnterpriseImage();
    }

    $scope.deleteOffer = function(offerId){
        HttpService.deleteOffer(
            offerId,
            function(result){
                $scope.getOffers();
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






app.controller('accountController',function($window,$scope,$localStorage,HttpService){

    $scope.getUser = function(){
        HttpService.getUserById(
            $localStorage.currentUser.user._id,
            function(result){
                $scope.enterprises = [];
                $scope.user = HttpService.user;
                console.log($scope.user);
                $scope.getEnterprises();
            }
        );

    };

    $scope.getApplications = function(){
        HttpService.getApplicationsByUserId(
            $localStorage.currentUser.user,
            function(result){
                $scope.applications = HttpService.applications;
                //get Applications enterprises
                angular.forEach($scope.applications,function(application,key){
                    HttpService.getEnterpriseById(
                        application.offer.enterprise,
                        function(result){
                            application.offer.enterprise=HttpService.enterprise;
                        }
                    );
                });
            }
        );
    };

    $scope.getEnterprises = function(){
        //angular.forEach($localStorage.currentUser.user.managed_enterprises,
       $scope.enterprises = []; angular.forEach($scope.user.managed_enterprises,function(value, key){
            HttpService.getEnterpriseById(value._id,function(result){
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
                $window.location.href="#!login";
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

    $scope.deleteAccount = function(){
        HttpService.deleteUser(
            $localStorage.currentUser.user._id,
            function(result){

            }
        );
    }

    $scope.addEnterprise = function(){
        HttpService.addEnterprise(
            $scope.newEnterprise,
            $localStorage.currentUser.user._id,
            $localStorage.currentUser.token,
            function(result){
                $scope.getUser();
            }
        );
    }

    $scope.deleteEnterprise = function(enterprise){
        HttpService.deleteEnterprise(
            enterprise,
            function(result){
                $scope.getUser();
            }
        );
    };
    
    $scope.getUser();
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

    $scope.max = 50000;
    $scope.min = 3000;
    $( function() {
        $( "#slider-range" ).slider({
            range: true,
            min: 3000,
            max: 50000,
            values: [ 3000, 50000 ],
            slide: function( event, ui ) {
                $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );

                $scope.max=ui.values[1];
                $scope.min=ui.values[0];
                console.log($scope.min+' '+$scope.max);
            }
        });
        $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
                           " - $" + $( "#slider-range" ).slider( "values", 1 ) );
        $( "#min" ).val( $( "#slider-range" ).slider( "values",0));
    } );




    $scope.priceFilterMore = function(prop,val){
        return function(item){
            console.log(prop);
            console.log(item[prop]);
            return item[prop] >= val;
        };
    };

    $scope.priceFilterLess = function(prop,val){
        return function(item){
            return item[prop] <= val;
        };
    };

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
