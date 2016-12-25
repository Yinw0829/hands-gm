/**
 * Created by iform on 2016-11-23.
 */
app.factory('listCertify',['$scope','$http',function ($scope, $http,httpServe) {
    $http.get('http://localhost:8087/hands/manager/api/enterprise/list?certifyStatus=NOT').then(function (data) {
        $scope.enterprises = data.data.rows;
        console.log($scope.enterprises);
    });
    function findIndex(id) {
        var index = -1;
        angular.forEach($scope.enterprises, function (item, key) {
            if (item.userId === id) {
                index = key;
                return;
            }
        });
        return index
    }
}]);

app.controller('enterprise', ['$scope', '$modal','listCertify', function ($scope, $modal,listCertify) {

    $scope.see = function (size, id) {
        var index = findIndex(id);
        if (index != -1) {
            $scope.item = listCertify[index];
        }
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.audit.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.item;
                }
            }
        });
        // modalInstance.result.then(function (selectedItem) {
        //     $scope.selected = selectedItem;
        // });
        // modalInstance.opened.then(function () {
        //     console.log($scope.item)
        // });
    };
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
                tis();
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
                console.log(data);
                $modalInstance.close($scope.items);

            });

        }
    }
}]);