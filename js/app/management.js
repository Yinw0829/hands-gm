//企业列表
app.controller('ModalDemoCtrl', ['$scope', '$modal', '$http', '$filter', 'api', '$resource', '$timeout', 'Storage', function ($scope, $modal, $http, $filter, api, $resource, $timeout, Storage) {
    var cityKey = 'city';
    $scope.cities = Storage.get(cityKey);
    // $scope.province = $scope.cities[10].code;
    $scope.url = api.url + 'manager/';
    var getNot = $resource(
        $scope.url + ':type',
        {
            curPage: "@curPage",
            pageSize: "@pageSize",
            status: "@status",
            id: "@id"
        },
        {
            getNormal: {method: 'get', params: {status: 'NORMAL'}, isArray: false},
            getDisBaled: {method: 'get', params: {status: 'DISABLED'}, isArray: false}
        }
    );
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
                    {type: 'list'},
                    {
                        curPage: $scope.paginationConf.currentPage,
                        pageSize: $scope.paginationConf.itemsPerPage
                    }, function (data) {
                        $scope.paginationConf.totalItems = data.total;
                        $scope.getNormal = data.rows;
                        console.log($scope.getNormal);
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
    //新增
    $scope.typeAdd = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/management/modal.add.html',
            controller: 'ModalInstanceCtrl',
            scope: $scope,
            size: 'md'
        });
        modalInstance.result.then(function () {
            $scope.paginationConf.onChange()
        });
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
    //编辑
    $scope.typeCompile = function (userId) {
        $scope.typeId = userId;
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/management/modal.classes.html',
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
            $scope.paginationConf.onChange()
        })
    };
    //重置
    $scope.reset = function (userId) {
        $scope.resId = userId;
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/management/modal.reset.html',
            controller: 'resetCtrl',
            size: 'md',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.item;
                }
            }
        });
    };
    //禁用
    $scope.disabled = function (item) {
        $scope.typeId = item;
        var index = $scope.getNormal.indexOf(item);
        $scope.item = $scope.getNormal[index];
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/management/modal.forbidden.html',
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
            $scope.disabledConf.onChange()
        });
        modalInstance.result.then(function () {
            $scope.paginationConf.onChange()
        });
    };
    //启用
    $scope.enable = function (data) {
        $scope.item = data;
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/management/modal.enable.html',
            controller: 'enableCtrl',
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
        modalInstance.result.then(function () {
            $scope.paginationConf.onChange()
        });
    };
}]);
//重置
app.controller('resetCtrl', ['$scope', '$modalInstance', '$resource', 'items', 'api', function ($scope, $modalInstance, $resource, items, api) {
    var replacement = $resource($scope.url + 'reset');
    $scope.OK = function (id) {
        replacement.save({id: id}, function (resp) {
            $modalInstance.close(items)
        });
    };
    $scope.cancel = function () {
        $modalInstance.close(items)
    }
}]);
//禁用
app.controller('ForbiddenCtrl', ['$scope', '$modalInstance', '$resource', 'items', 'api', function ($scope, $modalInstance, $resource, items, api) {
    var stop = $resource($scope.url + 'disabled');
    $scope.applyDis = function (id) {
        stop.save({id: id}, function (resp) {
            $modalInstance.close(items)
        });
    };
    $scope.cancel = function () {
        $modalInstance.close(items)
    }
}]);
// 添加
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', '$resource', function ($scope, $modalInstance, $resource) {
    var addType = $resource($scope.url + 'add');
    $scope.postCheck = {
        userName: '',
        name: '',
        districtCode: '',
        cellPhone: '',
        email: '',
        address: ''
    };
    $scope.postName = function (postCheck) {
        addType.save(
            postCheck, function (regs) {
                $modalInstance.close();
            })
    };
}]);
//编辑
app.controller('ModalcheckCtrl', ['$scope', '$modalInstance', '$resource','items', 'api', function ($scope, $modalInstance, $resource, items, api) {
    $scope.cityItem=$scope.cities;
    var url = {
        getUrl: api.url + 'manager/load',
        postUrl: api.url + 'manager/modify'
    };
    var urlJson = {
        getNot: $resource(
            url.getUrl,
            {
                id: $scope.typeId
            }
        ),
        postNot: $resource(
            url.postUrl,
            {
                id: $scope.typeId
            }
        )
    };
    urlJson.getNot.get(function (data) {
        $scope.item = data.result;
        $scope.province=$scope.item.districtModel.code;

    });
    $scope.redact = function (id) {
        urlJson.postNot.save(
            {
                id: $scope.typeId,
                name: $scope.item.name,
                cellPhone: $scope.item.userModel.cellPhone,
                email: $scope.item.email,
                districtCode: $scope.province
            }, function (resg) {
                $modalInstance.close(items);
            }
        )
    }
}]);
//启用
app.controller('enableCtrl', ['$scope', '$modalInstance', '$resource', 'items', function ($scope, $modalInstance, $resource, items) {
    var start = $resource($scope.url + 'enable');
    $scope.using = function (id) {
        start.save({id: id}, function (resp) {
            $modalInstance.close(items)
        });
    };
    $scope.cancel = function () {
        $modalInstance.close(items)
    }
}]);