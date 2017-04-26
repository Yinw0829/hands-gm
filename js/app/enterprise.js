//企业审核
app.controller('enterprise', ['$scope', '$modal', 'api', '$resource', 'findIndex', 'Storage', function ($scope, $modal, api, $resource, findIndex, Storage) {
    var city = Storage.get('city');
    var sex = Storage.get('sex');

    $scope.url = api.url + 'enterprise/';
    var getNot = $resource($scope.url + ':type', {certifyStatus: 'NOT'});

    var getArray = {
        get: function () {
            getNot.get({type: 'list'}, function (data) {
                $scope.enterprises = data.rows;
                console.log($scope.enterprises);
            });
        }
    };
    getArray.get();
    $scope.see = function (f) {
        // var index = $scope.enterprises.indexOf(id);
        $scope.item = f;
        // $scope.item = $scope.enterprises[index];
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.audit.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            scope: $scope,
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
    $scope.item = items;
    console.log($scope.item);
    $scope.time = new Date();
    $scope.start = function (id) {
        var myJsDate = $filter('date')($scope.time, 'yyyy-MM-dd');
        var data = {
            userId: id,
            expireDate: myJsDate
        };
        if ($scope.time) {
            $http({
                method: 'POST',
                url: 'api/enterprise/checkSucess',
                data: data,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data, status, headers, config) {
                alert(data.msg);
                $modalInstance.close($scope.items);
            });
        } else {
            alert('时间不能为空')
        }
    };
    // $scope.jobDate = {
    //     startDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
    //     minDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
    //     clearDate: $filter('date')(new Date(), 'yyyy-MM-dd')
    // };
    // $scope.$watch('jobDate.startDate', function (newVaule, oldVaule) {
    //     $scope.jobDate.clearDate=$filter('date')(newVaule,'yyyy-MM-dd');
    // });
    // //下面的固定不要去改
    // $scope.disabled = function (date, mode) {
    //     return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    // };
    // $scope.open = function ($event) {
    //     console.log($event);
    //     console.log('1');
    //     $event.preventDefault();
    //     $event.stopPropagation();
    //     $scope.opened = true;
    // };
    // $scope.dateOptions = {
    //     formatYear: 'yy',
    //     startingDay: 1,
    //     class: 'datepicker'
    // };
    // $scope.dateOptions1 = {
    //     formatYear: 'yy',
    //     startingDay: 1,
    //     class: 'datepicker'
    // };

    $scope.stop = function (id) {
        var useTip = {
            userId: id
        };
        var tip = confirm('是否不通过审核？');
        if (tip) {
            $http({
                method: 'POST',
                url: 'api/enterprise/checkFail',
                data: useTip,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function (data) {
                $modalInstance.close($scope.items);
            });

        }
    }
}]);