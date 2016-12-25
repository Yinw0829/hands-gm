//企业列表
app.filter('cityFilter', function () {
    return function (data, parentCode) {
        var filteData = [];
        angular.forEach(data, function (obj) {
            if (obj.parentCode === parentCode) {
                filteData.push(obj);
            }
        });
        return filteData;
    }
});
app.controller('enterpriseList', ['$scope', '$modal', '$http', '$filter', 'httpServe', '$resource', '$timeout', function ($scope, $modal, $http, $filter, httpServe, $resource, $timeout) {
    $scope.url = httpServe.httpUrl + 'enterprise/';
    var getNot = $resource(
        $scope.url + ':type',
        {
            curPage: "@curPage",
            pageSize: "@pageSize"
        },
        {
            getNormal: {method: 'get', params: {certifyStatus: 'SUCCESS', userStatus: 'NORMAL'}, isArray: false},
            getDisBaled: {method: 'get', params: {certifyStatus: 'SUCCESS', userStatus: 'DISABLED'}, isArray: false}
        });
    //省市
    // $http.get('http://localhost:8087/hands/api/districtList').then(function (data) {
    //     $scope.cities = data.data.rows;
    // });

    $scope.search = {

    };



    //正常状态
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 25,
        itemsPerPage: 10,
        pagesLength: 21,
        perPageOptions: [10, 20, 25, 50, 100],
        onChange: function () {
            var paginationConf = function () {
                getNot.getNormal(
                    {
                        type: 'list'
                    },
                    {
                        curPage: $scope.paginationConf.currentPage,
                        pageSize: $scope.paginationConf.itemsPerPage
                    }, function (data) {
                        $scope.paginationConf.totalItems = data.total;
                        $scope.enterpriseList = data.rows;
                    });
            };
            $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', paginationConf)
        }
    };
    //禁用状态
    $scope.disabledConf = {
        currentPage: 1,
        totalItems: 25,
        itemsPerPage: 10,
        pagesLength: 21,
        perPageOptions: [10, 20, 25, 50, 100],
        onChange: function () {
            var disabledConf = function () {
                getNot.getDisBaled(
                    {
                        type: 'list'
                    },
                    {
                        curPage: $scope.disabledConf.currentPage,
                        pageSize: $scope.disabledConf.itemsPerPage
                    }, function (data) {
                        $scope.disabledConf.totalItems = data.total;
                        $scope.disabledList = data.rows;
                    });
            };
            $scope.$watch('disabledConf.currentPage + disabledConf.itemsPerPage', disabledConf)
        }
    };
    //禁用   正常状态
    $scope.disabled = function (item) {
        var index = $scope.enterpriseList.indexOf(item);
        $scope.item = $scope.enterpriseList[index];
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.forbidden.html',
            controller: 'ForbiddenCtrl',
            size: 'md',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.item;
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.paginationConf.onChange()
        });
    };
    //启用    禁用状态
    $scope.enable = function (item) {
        var index = $scope.disabledList.indexOf(item);
        $scope.item = $scope.disabledList[index];
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.using.html',
            controller: 'StarCtrl',
            size: 'md',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.item;
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.disabledConf.onChange()
        });
    };
    //延期
    $scope.delay = function (size, id) {
        $scope.item = id;
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.delay.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            scope: $scope,
            resolve: {
                items: function () {
                    $scope.paginationConf.onChange();
                    return $scope.item;
                }
            }
        });
    };
}]);
//延期委托控制器
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', '$filter', '$http', 'items', function ($scope, $modalInstance, $filter, $http, items) {
    // $scope.items = items;
    $scope.time = new Date();
    $scope.delay = function () {
        var myJsDate = $filter('date')($scope.time, 'yyyy-MM-dd');
        console.log(myJsDate);
        var data = {
            userId: items,
            expireDate: myJsDate
        };
        if ($scope.time) {
            $http({
                method: 'POST',
                url: 'http://localhost:8087/hands/manager/api/enterprise/delay',
                data: data,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data, status, headers, config) {
                $scope.paginationConf.onChange();
                $modalInstance.close();
            });
        } else {
            alert('时间不能为空')

        }
    };
}]);

//禁用
app.controller('ForbiddenCtrl', ['$scope', '$modalInstance', '$resource', 'items', function ($scope, $modalInstance, $resource, items) {
    var dis = $resource($scope.url + 'disabled');
    $scope.applyDis = function (id) {
        dis.save({type: 'list'}, {userId: id}, function () {
            $modalInstance.close(items)
        });
    };
    $scope.cancel = function () {
        $modalInstance.close(items)
    }
}]);
//启用
app.controller('StarCtrl', ['$scope', '$modalInstance', '$resource', 'items', function ($scope, $modalInstance, $resource, items) {
    var start = $resource($scope.url + 'enable');
    $scope.using = function (id) {
        start.save({type: 'list'}, {userId: id}, function () {
            $modalInstance.close(items)
        });
    };
    $scope.cancel = function () {
        $modalInstance.close(items)
    }
}]);