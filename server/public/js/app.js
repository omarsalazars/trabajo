var app = angular.module('myApp',['ngRoute']);

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
    });
});

app.controller('indexController',function($scope){

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

app.controller('searchController',function($scope){
    $scope.offers = [
        {
            puesto:'Desarrollador Web',
            empresa: 'Glazzol',
            ciudad : 'Aguascalientes',
            salario: '$9000'
        },
        {
            puesto:'Gerente',
            empresa: 'Chuck E Cheese',
            ciudad : 'Aguascalientes',
            salario: '$4500'
        },
        {
            puesto:'Desarrollador Web',
            empresa: 'Glazzol',
            ciudad : 'Aguascalientes',
            salario: '$9000'
        }
    ];
});