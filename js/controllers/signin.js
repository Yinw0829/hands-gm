'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function () {
        $scope.authError = null;
        // Try to login
        $http.post('api/login.json', {
                username: $scope.user.username,
                password: $scope.user.password
            })
            .then(function (response) {
                console.log(response);
                if (!response.data.user) {
                    $scope.authError = 'Email or Password not right';
                } else {
                    $state.go('app.user');
                }
            }, function (x) {
                $state.go('app.user');
                //          $scope.authError = 'Server Error';
            });
    };
  }]);