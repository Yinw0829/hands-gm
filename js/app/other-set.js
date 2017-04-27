app.controller('otherSet', ['$scope', '$modal', '$log', '$http', '$resource', 'api', '$state', function ($scope, $modal, $log, $http, $resource, api, $state) {
    $scope.url = api.url;
    var passwd = $resource(
        $scope.url + ':type',
        {
            enumName: '@enumName'
        }, {
            passwords: {
                url: $scope.url + 'account/changePwd',
                method: 'POST',
                isArray: false
            },
            vipList: {
                url: $scope.url + 'vip/fee/option/list',
                method: 'GET',
                isArray: false
            }
        }
    );
    passwd.vipList(function (data) {
        $scope.VIPlist = data.rows;
    });

    //修改密码
    $scope.ok = function () {
        var data = {
            oldPassword: $scope.oldpassword,
            password: $scope.password
        };
        passwd.passwords(data, function (reg) {
            if (reg.success) {
                $state.go('access.signin');
            } else {
                $scope.authError = reg.msg;
            }
        });
    };
    // VIP
    $scope.typeCompile = function (y) {
        $scope.item = y;
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.VIP.html',
            controller: 'ModalcheckCtrl',
            size: 'md',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.item;
                }
            }
        });
        modalInstance.result.then(function () {
            passwd.vipList(function (data) {
                $scope.VIPlist = data.rows;
            });
        })
    }
}]);
//修改费用
app.controller('ModalcheckCtrl', ['$scope', '$modalInstance', 'items', '$resource', '$http', '$stateParams', 'api', function ($scope, $modalInstance, items, $resource, $http, $stateParams, api) {
    $scope.url = api.url;
    var redact = $resource($scope.url, {}, {
        getRedact: {
            url: $scope.url + 'vip/fee/option/modify',
            method: 'POST',
            isArray: false
        }
    });
    $scope.redact = function (id) {
        redact.getRedact(
            {
                type: items.type,
                money: $scope.money
            }, function (resp) {
                $modalInstance.close(items);
            })
    };
}]);
