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
app.controller('usersList', ['$scope', '$modal', '$http', '$filter', 'api', '$resource', '$timeout','province','Storage','sex', function ($scope, $modal, $http, $filter, api, $resource, $timeout,province,Storage,sex) {
     province.logCity();
    var storageKey = 'city';
    $scope.cities=Storage.get(storageKey);
    $scope.$on('city.services',function () {
        var cityItem=province.getCity();
        // console.log(cityItem);
        $scope.itemsCity=cityItem.rows;
        // console.log($scope.itemsCity);
        if(cityItem.success){
            Storage.set(storageKey,$scope.itemsCity);
            //存入缓存
        }
    });

    sex.logSex();
    var sexkey = 'sex';
    $scope.$on('sex.services',function () {
        var sexItem=sex.getSex();
        $scope.itemsSex=sexItem.rows;
        if (sexItem.success){
            Storage.set(sexkey,$scope.itemsSex);
        }
    });

   //链接
       $scope.url = api.url + 'appUser/';
    var getUse = $resource(
        $scope.url + ':type',
        {
            userStatus: '@userStatus',
            id:'@id',
            curPage: "@curPage",
            pageSize: "@pageSize"
        },
        {
            normal:{method:'get',params:{userStatus: 'NORMAL'},isArray:false},
            disabled:{method:'get',params:{userStatus: 'DISABLED'},isArray:false}
        }
        );
    //正常状态
    $scope.paginationConf = {
        currentPage:1,
        totalItems:25,
        itemsPerPage:10,
        pagesLength:21,
        perPageOptions:[10,20,25,50,100],
        onChange:function () {
            var paginationConf = function () {
                getUse.normal(
                    {type:'list'},
                    {
                        curPage: $scope.paginationConf.currentPage,
                        pageSize: $scope.paginationConf.itemsPerPage
                    },function (data) {
                        $scope.paginationConf.totalItems = data.total;
                        $scope.normalList = data.rows;
                        console.log($scope.normalList);
                    });
            };
            $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', paginationConf)
        }
    };
    //禁用状态
    $scope.disabledConf = {
        currentPage:1,
        totalItems:25,
        itemsPerPage:10,
        pagesLength:21,
        perPageOptions:[10,20,25,50,100],
        onChange:function () {
            var disabledConf = function () {
                getUse.disabled(
                    {type:'list'},
                    {
                        curPage: $scope.disabledConf.currentPage,
                        pageSize: $scope.disabledConf.itemsPerPage
                    },function (data) {
                        $scope.disabledConf.totalItems = data.total;
                        $scope.disabledList = data.rows;
                    });
            };
            $scope.$watch('disabledConf.currentPage + disabledConf.itemsPerPage', disabledConf)
        }
    };
    //启用
    $scope.enable = function (data) {
        $scope.item = data;
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/user/user.enable.html',
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
    //禁用
    $scope.disabled = function (data) {
        $scope.item = data;
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/user/user.forbidden.html',
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
    //详细
    $scope.detail = function (userId) {
        getUse.get({type: 'load'}, {id: userId}, function (data) {
            $scope.item = data.result;
        });
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/user/user.user.html',
            controller: 'detailCtrl',
            size: 'md',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.item;
                }
            }
        });
    }
}]);
//详细
app.controller('detailCtrl', ['$scope', '$modalInstance', '$resource', 'items', function ($scope, $modalInstance, $resource, items) {
    $scope.ok = function (userId) {
        $modalInstance.close(items)
    }
}]);
//禁用
app.controller('ForbiddenCtrl', ['$scope', '$modalInstance', '$resource', 'items', function ($scope, $modalInstance, $resource, items) {
    var stop = $resource($scope.url + 'disabled');
    $scope.applyDis = function (userId) {
        stop.save({userId: userId}, function (resp) {
            $modalInstance.close(items)
        });
    };
    $scope.cancel = function () {
        $modalInstance.close(items)
    }
}]);
//启用
app.controller('enableCtrl', ['$scope', '$modalInstance', '$resource', 'items', function ($scope, $modalInstance, $resource, items) {
    var start = $resource($scope.url + 'enable');
    $scope.using = function (userId) {
        start.save({userId: userId}, function () {
            $modalInstance.close(items)
        });
    };
    $scope.cancel = function () {
        $modalInstance.close(items)
    }
}]);