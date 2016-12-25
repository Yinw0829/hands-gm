//企业审核
app.controller('enterprise', ['$scope', '$modal','httpServe','$resource', 'findIndex',function ($scope, $modal, httpServe,$resource,findIndex) {
    $scope.url=httpServe.httpUrl+'enterprise/';
    var getNot=$resource($scope.url+':type',{certifyStatus:'NOT'});

    var  getArray={
        get:function () {
            getNot.get({type: 'list'}, function (data) {
                $scope.enterprises = data.rows;
            })
        }
    };
    getArray.get();
    $scope.see = function (id) {
        console.log($scope.enterprises);
        var index = $scope.enterprises.indexOf(id);
        $scope.item = $scope.enterprises[index];
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.audit.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            scope:$scope,
            resolve: {
                items: function () {
                    return $scope.item;
                }
            }
        });
        modalInstance.result.then(function () {
            getArray.get();
        });
    }
}]);
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', '$filter', '$http', 'items', function ($scope, $modalInstance, $filter, $http, items) {
    $scope.items = items;
    $scope.time =new Date();
    $scope.start = function (id) {
        var myJsDate= $filter('date')($scope.time, 'yyyy-MM-dd');
        var data={
            userId:id,
            expireDate:myJsDate
        };
        if ($scope.time) {
            $http({
                method: 'POST',
                url: 'http://localhost:8087/hands/manager/api/enterprise/checkSucess',
                data: data,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data,status,headers,config) {
                alert(data.msg);
                $modalInstance.close($scope.items);
            });
        } else {
            alert('时间不能为空')
        }
    };

    $scope.stop=function (id) {
        var useTip={
            userId:id
        };
        console.log(useTip);
        var tip=confirm('是否不通过审核？');
        if(tip){
            $http({
                method:'POST',
                url:'http://localhost:8087/hands/manager/api/enterprise/checkFail',
                data:useTip,
                headers: {
                    'Content-Type': 'application/json'}
            }).success(function (data) {
                $modalInstance.close($scope.items);
            });

        }
    }
}]);