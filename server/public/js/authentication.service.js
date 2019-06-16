angular
    .module('myApp')
    .factory('AuthenticationService', Service);

function Service($http, $localStorage,$rootScope) {
    var service = {};

    service.Login = Login;
    service.Logout = Logout;

    return service;

    function Login(email, password, callback) {
        $http.post('/api/users/login', { email: email, password: password })
            .then(function (response) {
            // login successful if there's a token in the response
            console.log(response);
            if (response.data.token) {
                // store username and token in local storage to keep user logged in between page refreshes
                $localStorage.currentUser = { 
                    user : response.data.user,
                    token: response.data.token
                };

                // add jwt token to auth header for all requests made by the $http service
                $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
                
                
                // execute callback with true to indicate successful login
                callback(true);
            } else {
                // execute callback with false to indicate failed login
                callback(false);
            }
        });
    }

    function Logout() {
        // remove user from local storage and clear http auth header
        $rootScope.hide = false;
        delete $localStorage.currentUser;
        $http.defaults.headers.common.Authorization = '';
    }
}