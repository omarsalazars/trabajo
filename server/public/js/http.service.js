angular.module('myApp').factory('HttpService',HttpService);

function HttpService($http,$localStorage){
    var httpService = {};

    httpService.offers = [];
    httpService.offer = {};
    httpService.users = [];
    httpService.user = {};
    httpService.enterprises = [];
    httpService.enterprise = {};
    httpService.applications = [];
    httpService.application = {};


    //Offers
    httpService.getOffers = getOffers;
    httpService.getOfferById = getOfferById;
    httpService.getOffersByEnterpriseId = getOffersByEnterpriseId;
    httpService.addOffer = addOffer;
    httpService.updateOfferInfo = updateOfferInfo;
    httpService.updateOfferFile = updateOfferFile;

    //Users
    httpService.getUsers = getUsers;
    httpService.getUserById = getUserById;
    httpService.addUser = addUser;
    httpService.updateUserInfo = updateUserInfo;
    httpService.updateUserImage = updateUserImage;

    //Enterprises
    httpService.getEnterprises = getEnterprises;
    httpService.getEnterpriseById = getEnterpriseById;
    httpService.addEnterprise = addEnterprise;
    httpService.updateEnterpriseInfo = updateEnterpriseInfo;
    httpService.updateEnterpriseImage = updateEnterpriseImage;
    httpService.addEnterpriseAdmin = addEnterpriseAdmin;
    httpService.deleteEnterpriseAdmin = deleteEnterpriseAdmin;

    //Applications
    httpService.getApplications = getApplications;
    httpService.getApplicationById = getApplicationById;
    httpService.getApplicationsByEnterpriseId = getApplicationsByEnterpriseId;
    httpService.addApplication = addApplication;
    httpService.proceedApplication = proceedApplication;

    return httpService;


    //Inicio Offers
    function getOffers(callback){
        var url = getUrl() + '/api/offers/';
        $http({
            method:'GET',
            url: url
        }).then(
            function success(response){
                httpService.offers = response.data.offers;
                callback(true);
            },
            function error(response){
                console.log("No hay applications");
                callback(true);
            }
        );
    }

    function getOfferById(id,callback){
        var url = getUrl() + '/api/offers/' + id;
        $http({
            method: 'GET',
            url: url
        }).then(
            function success(response){
                httpService.offer = response.data.offer;
            },
            function error(response){
                console.log("No existe la oferta");
            }
        );
    }

    function getOffersByEnterpriseId(id,callback){
        var url = getUrl() + '/api/offers/enterprise/'+id;
        $http({
            method:'GET',
            url: url
        }).then(
            function success(response){
                httpService.offers = response.data.offers;
                callback(true);
            },
            function error(response){
                console.log("No hay applications");
                callback(false);
            }
        );
    }

    function addOffer(offer,callback){
        var url = getUrl() + '/api/offers';
        $http({
            method: 'POST',
            url: url,
            data: {
                enterprise: offer.enterprise,
                position: offer.position,
                description: offer.description,
                salary: offer.salary,
                travel: offer.travel
            }
        }).then(
            function success(response){
                alert('Oferta registrada');
                callback(true);
            },
            function error(response){
                alert('Ocurrio un error registrando la oferta, intentelo más tarde');
                console.log(response);
                callback(false);
            }
        );
    }

    function updateOfferInfo(offer,callback){
        var url = getUrl() + '/api/offers/' + $routeParams.id;
        $http({
            method: 'PUT',
            url: url,
            data: {
                enterprise: $scope.offer.enterprise,
                position: $scope.offer.position,
                description: $scope.offer.description,
                salary: $scope.offer.salary,
                travel: $scope.offer.travel
            }
        }).then(
            function success(response){
                alert('Oferta actualizada correctamente')
            },
            function error(response){
                alert('Error actualizando la oferta');
            }
        );
    }

    function updateOfferFile(id,token,file,callback){

    }
    //Fin Offers

    //Inicio users

    function getUsers(callback){
        $http({
            method: 'GET',
            url: getUrl() + '/api/users'
        }).then(
            function success(response){
                httpService.users = response.data.users;
                callback(true);
            },
            function error(response){
                callback(false);
            }
        );
    }

    function getUserById(id,callback){
        var url = getUrl() + '/api/users/'+id;
        $http({
            method: 'GET',
            url: url,
        }).then(
            function success(response){
                console.log(response);
                httpService.user = response.data.user;
                console.log(httpService.user);
                callback(true);
            },
            function error(response){
                console.log(response);
                callback(false);
            }
        );
    }

    function addUser(user,callback){
        $http({
            method: 'POST',
            url: getUrl + '/api/users',
            data: {
                first_name : user.first_name,
                last_name : user.last_name,
                email : user.email,
                password: user.password,
                country: user.country,
                phone: user.phone
            }
        }).then(
            function success(response){
                alert('Usuario creado exitosamente, revise su correo electrónico para confirmar su cuenta');
                callback(true);
            },
            function error(response){
                alert('Error creando usuario');
                callback(false);
            }
        );
    }

    function updateUserInfo(user,token,callback){
        var url = getUrl() + '/api/users/' +user._id;
        $http({
            method:'PUT',
            url: url,
            data: {
                first_name: user.first_name,
                last_name: user.last_name,
                country: user.country,
                phone: user.phone
            }
        }).then(
            function success(response){
                alert('Usuario actualizado exitosamente');
                callback(true);
            },
            function error(response){
                alert('Ocurrio un error inesperado');
                callback(false);
            }
        );
    }

    function updateUserImage(id,token,formData,callback){
        var url = getUrl() + '/api/users/upload/images/';
        $http({
            url: url,
            method: 'POST',
            headers: {
                token: token,
                'Content-Type' : undefined
            },
            data: formData
        }).then(
            function success(response){
                callback(true);
            },
            function error(response){
                callback(false);
            }
        );
    }
    //Fin users

    //Inicio Enterprises

    function getEnterprises(callback){
        $http({
            method:'GET',
            url: getUrl() + '/api/enterprises'
        }).then(
            function success(response){
                httpService.enterprises = response.data.enterprises;
                callback(true);
            },
            function error(response){
                alert("No hay empresas registradas :(");
                callback(false);
            }
        );
    }

    function getEnterpriseById(id,callback){
        url = getUrl() + '/api/enterprises/'+id;
        $http({
            method: 'GET',
            url: url,
        }).then(
            function success(response){
                console.log(response);
                httpService.enterprise = response.data.enterprise;
                callback(true);
            },
            function error(response){
                console.log(response);
                callback(false);
            }
        );
    }

    function addEnterprise(enterprise, userId, token, callback){
        $http({
            method:'POST',
            url: getUrl() + '/api/enterprises',
            headers: {
                token: token
            },
            data: {
                name: enterprise.name,
                email: enterprise.email,
                website: enterprise.website,
                phone: enterprise.phone,
                admins: userId
            }
        }).then(
            function success(response){
                alert('Empresa creada exitosamente');
                callback(true);
            },
            function error(response){
                alert('Fallo al crear la empresa');
                callback(false);
            }
        );
    }

    function addEnterpriseAdmin(enterpriseId,email,token,callback){
        var url = getUrl() + '/api/enterprises/'+ enterpriseId + '/addAdmin';
        $http({
            method: 'POST',
            url: url,
            headers: {
                token: token
            },
            data: {
                email: email
            }
        }).then(
            function success(response){
                alert('Administrador añadido correctamente');
                callback(true);
            },
            function error(response){
                alert('No se pudo añadir al administrador');
                callback(false);
            }
        );
    }

    function updateEnterpriseInfo(enterprise,token,callback){
        var url = getUrl() + '/api/enterprises/' + enterprise._id;
        $http({
            method: 'PUT',
            url: url,
            data: {
                //FALTA DATA
            }
        }).then(
            function success(response){
                callback(true);
            },
            function error(response){
                alert('Error actualizando empresa');
                callback(false);
            }
        );

    }

    function updateEnterpriseImage(id,image,token,callback){

    }

    function deleteEnterpriseAdmin(enterpriseId, adminId, token, callback){
        var url = getUrl() + '/api/enterprises/'+ enterpriseId + '/deleteAdmin/'+adminId;

        $http({
            method: 'DELETE',
            url: url,
            headers: {
                token: token
            },
            data: {
                _id: adminId
            }
        }).then(
            function success(response){
                alert('Administrador borrado correctamente');
                callback(true);
            },
            function error(response){
                alert('No se pudo borrar al administrador');
                callback(false);
            }
        );
    }

    //Fin Enterprises


    //Inicio Applications

    function getApplications(callback){
        $http({
            method: 'GET',
            url: getUrl() + '/api/applications'
        }).then(
            function success(response){
                httpService.applications = response.data.applications;
                callback(true);
            },
            function error(response){
                callback(false);
            }
        );
    }

    function getApplicationById(id,callback){
        $http({
            method: 'GET',
            url: getUrl() + '/api/applications/'+id
        }).then(
            function success(response){
                httpService.application = response.data.application;
                callback(true);
            },
            function error(response){
                callback(false);
            }
        );
    }

    function getApplicationsByEnterpriseId(id,callback){
        var url = getUrl() + '/api/applications/enterprise/'+id;
        $http({
            method:'GET',
            url: url
        }).then(
            function success(response){
                HttpService.applications = response.data.applications;
                callback(true);
            },
            function error(response){
                console.log("No hay applications");
                callback(false);
            }
        );
    }

    function addApplication(user,offer,token,callback){
        $http({
            method: 'POST',
            url: getUrl() + '/api/applications',
            headers: {
                token: token
            },
            data: {
                user: user._id,
                offer: offer
            }
        }).then(
            function success(response){
                alert('Se está procesando tu solicitud, te notificaremos cuando la empresa conteste tu solicitud.')
                callback(true);
            },
            function error(response){
                alert('Ocurrio un error inesperado');
                callback(false);
            }
        );
    }

    function proceedApplication(offerId, callback){
        console.log('Proceed application');
        $http({
            method: 'PUT',
            url: getUrl() + '/api/offers/'+offerId+'/proceed'
        }).then(
            function success(response){
                console.log(response.data);
                callback(true);
            },
            function error(response){
                callback(false);
            }
        );
    }
    //Fin applications
}