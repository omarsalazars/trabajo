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
    httpService.deleteOffer = deleteOffer;

    //Users
    httpService.getUsers = getUsers;
    httpService.getUserById = getUserById;
    httpService.addUser = addUser;
    httpService.updateUserInfo = updateUserInfo;
    httpService.updateUserImage = updateUserImage;
    httpService.updateUserCurriculum = updateUserCurriculum;
    httpService.deleteUser = deleteUser;

    //Enterprises
    httpService.getEnterprises = getEnterprises;
    httpService.getEnterpriseById = getEnterpriseById;
    httpService.addEnterprise = addEnterprise;
    httpService.updateEnterpriseInfo = updateEnterpriseInfo;
    httpService.updateEnterpriseImage = updateEnterpriseImage;
    httpService.addEnterpriseAdmin = addEnterpriseAdmin;
    httpService.deleteEnterpriseAdmin = deleteEnterpriseAdmin;
    httpService.deleteEnterprise = deleteEnterprise;

    //Applications
    httpService.getApplications = getApplications;
    httpService.getApplicationById = getApplicationById;
    httpService.getApplicationsByEnterpriseId = getApplicationsByEnterpriseId;
    httpService.getApplicationsByUserId = getApplicationsByUserId;
    httpService.addApplication = addApplication;
    httpService.proceedApplication = proceedApplication;
    httpService.deleteApplication = deleteApplication;
    httpService.uploadAnswers = uploadAnswers;

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
                callback(true);
            },
            function error(response){
                console.log("No existe la oferta");
                callback(false);
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
                console.log(httpService.offers);
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
        var url = getUrl() + '/api/offers/' + offer.id;
        $http({
            method: 'PUT',
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
                alert('Oferta actualizada correctamente');
                callback(true);
            },
            function error(response){
                alert('Error actualizando la oferta');
                callback(false);
            }
        );
    }

    function updateOfferFile(id,token,file,callback){

    }
    
    function deleteOffer(id,callback){
        $http({
            method: 'DELETE',
            url: getUrl() + '/api/offers/'+id
        }).then(
            function success(response){
                console.log(response);
                callback(true);
            },
            function error(response){
                console.log(response);
                callback(false);
            }
        );
    }
    //Fin Offers

    //Inicio users

    function deleteUser(id,callback){
        $http({
            method: 'DELETE',
            url: getUrl() + '/api/users/'+id
        }).then(
            function success(response){
                alert('Usuario eliminado');
                callback(true);
            },
            function error(response){
                callback(false);
            }
        );
    }
    
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
            url: getUrl() + '/api/users',
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
                alert('Error creando usuario'+ response.data.err._message);
                console.log(response.data);
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
                console.log(response);
                callback(false);
            }
        );
    }

    function updateUserCurriculum(id, token, formData, callback){
        var url = getUrl() + '/api/users/upload/curriculum/';
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
                console.log(response);
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
                console.log(response);
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
                name: enterprise.name,
                email: enterprise.email,
                website: enterprise.website,
                phone: enterprise.phone
            }
        }).then(
            function success(response){
                console.log(response);
                callback(true);
            },
            function error(response){
                alert('Error actualizando empresa');
                callback(false);
            }
        );

    }

    function updateEnterpriseImage(id,formData,callback){
        $http({
            method: 'PUT',
            url: getUrl() + '/api/enterprises/'+id+'/upload/image',
            headers:{
                'Content-Type': undefined
            },
            data: formData
        }).then(
            function success(response){
                console.log();
                console.log(response);
                callback(true);
            },
            function error(response){
                callback(false);
            }
        );
    }

    function deleteEnterprise(enterprise, callback){
        $http({
            method: 'DELETE',
            url: getUrl() + '/api/enterprises/'+ enterprise._id
        }).then(
            function success(response){
                alert('Empresa borrada');
                callback(true);
            },
            function error(response){
                alert('Error borrando empresa');
                callback(false);
            }
        );
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
                httpService.applications = response.data.applications;
                console.log(response.data.applications);
                callback(true);
            },
            function error(response){
                console.log("No hay applications");
                callback(false);
            }
        );
    }

    function getApplicationsByUserId(user,callback){
        $http({
            method: 'GET',
            url : getUrl() + '/api/applications/user/'+user._id,
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
                if(response.data.err){
                    alert(response.data.err.message);
                }
                else{
                    alert('Se está procesando tu solicitud, te notificaremos cuando la empresa conteste tu solicitud.');
                    console.log(response);
                    httpService.application = response.data.application;
                    callback(true);
                }
            },
            function error(response){
                alert('Ocurrio un error inesperado');
                callback(false);
            }
        );
    }

    function proceedApplication(applicationId, callback){
        console.log('Proceed application');
        $http({
            method: 'PUT',
            url: getUrl() + '/api/applications/'+applicationId+'/proceed'
        }).then(
            function success(response){
                console.log(response.data);
                httpService.application = response.data.application;
                alert("La aplicación pasará a la siguiente etapa");
                callback(true);
            },
            function error(response){
                callback(false);
            }
        );
    }
    
    function deleteApplication(application, callback){
        $http({
            method: 'DELETE',
            url: getUrl() + '/api/applications/'+application._id
        }).then(
            function success(response){
                alert('Se ha borrado el registro exitosamente');
                callback(true);
            },
            function error(response){
                alert('Error al borrar el registo');
                console.log(response);
                callback(false);
            }
        );
    }
    
    function uploadAnswers(application,formData,callback){
        var url = getUrl() + '/api/applications/'+ application._id +'/upload/answers';
        $http({
            url: url,
            method: 'PUT',
            headers: {
                'Content-Type' : undefined
            },
            data: formData
        }).then(
            function success(response){
                alert('El archivo se ha subido correctamente');
                callback(true);
            },
            function error(response){
                alert('Hubo un error subiendo el archivo');
                console.log(response);
                callback(false);
            }
        );
    }
    //Fin applications
}