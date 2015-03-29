angular
    .module('myApp', [])
    .filter('temp', filterTemp)
    .factory("countries", countries)
    .factory("weather", weather)
    .factory("IPGeolocation",IPGeolocation)
    .controller("appCont", appCont)
    .controller("weatherController", weatherController);

//Defining Countries Factory 
countries.$inject=['$http'];
weather.$inject=['$http'];
IPGeolocation.$inject=['$http'];
function IPGeolocation($http){
    var service = {
        getInfo:getInfo
    }
    return service;
    function getInfo() {
        return $http.get("http://ip-api.com/json")
    }
}
function countries($http) {
    
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
    
}
function weather($http) {

    var service = {
        getWeather:getWeather
    }
    return service;

    function getWeather(params) {
        return $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?q='+params.city+','+params.countryCode+'&mode=json&units=metric&cnt=5');
    }
}

//Defining Controller
function appCont($scope, countries) {
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
    
}
//Defining Forecast Controller
function weatherController($scope, weather, IPGeolocation) {
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


}
//Defining The Filter
function filterTemp($filter) {
    return function(input, precision) {
        if (!precision) {
            precision = 1;
        }
        var numberFilter = $filter('number');
        return numberFilter(input, precision) + '\u00B0C';
    };
};
