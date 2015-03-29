var myapp=angular.module('myApp', ['tc.chartjs']);


//Defining Countries Factory 

myapp.factory("IPGeolocation",function($http){
    var service = {
        getInfo:getInfo
    }
    return service;
    function getInfo() {
        return $http.get("http://ip-api.com/json")
    }
})


myapp.factory("countries", function($http) {

    var service = {
        getCountries:getCountries,
        getCountry:getCountry
    }
    return service;

    function getCountries() {
        return $http.get("http://restcountries.eu/rest/v1/all");
    }

    function getCountry(country) {
        return $http.get("http://restcountries.eu/rest/v1/name/"+ country);
    }

})
myapp.factory("weather", function weather($http) {

    var service = {
        getWeather:getWeather
    }
    return service;

    function getWeather(params) {
        return $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?q='+params.city+','+params.countryCode+'&mode=json&units=metric&cnt=5');
    }
})



//Defining Controller
myapp.controller("countryCont", function($scope, countries) {
    $scope.Selectedcountry=null;
    $scope.do=function(){
        countries.getCountries()
            .success(function(data) {
                $scope.counts=data;
                console.log(data);
            })
    };
    $scope.do();
    $scope.run=function(thing){
        countries.getCountry(thing)
            .success(function(data) {
                $scope.Selectedcountry=data[0];
                console.log($scope.Selectedcountry);
            })
    };
})


//Defining Forecast Controller

myapp.controller("weatherController", function($scope, weather, IPGeolocation) {
    $scope.weather = new Date();
    $scope.forecast = false;
    IPGeolocation.getInfo()
        .success(function(data){
            weather.getWeather(data)
                .success(function(weather){
                    $scope.forecast = weather;
                    console.log($scope.forecast);
                });
        });


})
myapp.controller("statsController", function($scope) {
    $scope.data = [
        {
            value: 300,
            color:'#F7464A',
            highlight: '#FF5A5E',
            label: 'Red'
        },
        {
            value: 50,
            color: '#46BFBD',
            highlight: '#5AD3D1',
            label: 'Green'
        },
        {
            value: 100,
            color: '#FDB45C',
            highlight: '#FFC870',
            label: 'Yellow'
        }];
})



//Defining The Filter
myapp.filter('temp', function($filter) {
    return function(input, precision) {
        if (!precision) {
            precision = 1;
        }
        var numberFilter = $filter('number');
        return numberFilter(input, precision) + '\u00B0C';
    };
})

