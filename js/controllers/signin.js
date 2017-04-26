'use strict';

app.controller('SigninFormController', ['$scope', '$modal', '$http', '$state', '$resource', 'api', 'Storage','$rootScope', function ($scope, $modal, $http, $state, $resource, api, Storage,$rootScope) {

    var url = api.url;
    var getup = $resource(
        url,
        {},
        {
            enter: {url: url + 'login', method: 'POST', isArray: false}
        }
    );
    $scope.imgclick = function () {
        $scope.imgUrl = 'api/captcha?time=' + (new Date()).getTime();
    };
    $scope.login = function () {
        var data = {
            userName: $scope.user.userName,
            password: $scope.user.password,
            captcha: $scope.captcha
        };
        getup.enter(data, function (reg) {
            if (reg.success) {
                $state.go('app.user');
                Storage.set('user', reg.result);
                $rootScope.$broadcast('user.login')
            } else {
                $scope.imgclick();
                $scope.authError = reg.msg;
            }
        });
    };
    $scope.$watch('userName+password+captcha', function (newValue, oldValue) {
        $scope.authError = ''
    });
    $scope.imgUrl = 'api/captcha?time=' + (new Date()).getTime();

}]);