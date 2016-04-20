application.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'app/views/home/homeView.html',
            controller: 'HomeController'
        });
        
}]);