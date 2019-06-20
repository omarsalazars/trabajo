angular
    .module('myApp')
    .factory('AuthenticationService', Service);

function Service($http, $localStorage,$rootScope) {
    var service = {};

    service.Login = Login;
    service.Logout = Logout;

    return service;

    function Login(email, password, callback) {
        $http.post(
            '/api/users/login', 
            { email: email, password: password }
        ).then(
            function success(response) {
                // login successful if there's a token in the response
                console.log(response);
                if(response.data.err){
                    alert(response.data.err.message);
                    console.log(response.data);
                }
                if (response.data.token) {
                    // store username and token in local storage to keep user logged in between page refreshes
                    $localStorage.currentUser = { 
                        user : response.data.user,
                        token: response.data.token
                    };
                    $rootScope.email = $localStorage.currentUser.user.email;
                    $rootScope.logged=true;
                    // add jwt token to auth header for all requests made by the $http service
                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;


                    // execute callback with true to indicate successful login
                    callback(true);
                }
            },
            function error(response){
                // execute callback with false to indicate failed login
                alert(response.data.err.message);
                callback(false);
            }
        );
    }

    function Logout() {
        // remove user from local storage and clear http auth header
        $rootScope.logged = false;
        delete $localStorage.currentUser;
        $http.defaults.headers.common.Authorization = '';
    }
}