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
            }
        }
    );
    $scope.url = api.url + 'vip/';
    var getvip = $resource(
        $scope.url + ':type',
        {
            enumName: '@enumName'
        },{ }
    );
    getvip.get({type: 'fee/option/list'}, function (data) {
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
            getvip.get({type: 'fee/option/list'}, function (data) {
                $scope.VIPlist = data.rows;
            });
        })
    }
}]);
app.controller('ModalcheckCtrl', ['$scope', '$modalInstance', 'items', '$resource', function ($scope, $modalInstance, items, $resource) {
    var redact = $resource($scope.url + 'fee/option/modify');
    $scope.redact = function (id) {
        redact.save(
            {
                type: items.type,
                money: $scope.money
            }, function (resp) {
                $modalInstance.close(items);
            })
    };
}]);

//修改密码
// app.controller('PasswordCtrl', ['$scope', '$modalInstance', '$filter', 'items', '$resource','$state', function ($scope, $modalInstance, $filter, items, $resource,$state) {
//     var passwd = $resource($scope.url + 'account/changePwd');
//     $scope.ok = function (){
//         var data = {
//             oldPassword: $scope.oldpassword,
//             password: $scope.password
//         };
//         passwd.save(data,function (reg) {
//             console.log(reg);
//             if (reg.success){
//                 $modalInstance.close(items);
//                 $state.go('access.signin');
//             }else{
//                 $scope.authError=reg.msg;
//             }
//         });
//     };
// }]);