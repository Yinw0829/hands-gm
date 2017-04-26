app.controller('BusinessCtrl', ['$scope', '$modal', '$log', '$http', '$resource', 'api', function ($scope, $modal, $log, $http, $resource, api) {
    $scope.url = api.url + 'industry/';
    var getSelect = $resource(
        $scope.url+ ':type',
        {
            id:'@id'
        }
    );
    getSelect.get({type: 'list'}, function (data) {
        $scope.postLists = data.rows;
    });

    //遍历
    function findIndex(id) {
        var index = -1;
        angular.forEach($scope.postLists, function (item, key) {
            if (item.id === id) {
                index = key;
                return;
            }
        });
        //结果
        return index;
    }

    //类型新增
    $scope.typeAdd = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/business/modal.form.html',
            controller: 'ModalInstanceCtrl',
            scope: $scope,
            size: 'md'
        });
        modalInstance.result.then(function () {
            getSelect.get({type: 'list'}, function (data) {
                    $scope.postLists = data.rows;
                });
        })
    };


    // 编辑
    $scope.typeCompile = function (id) {
        var index = findIndex(id);
        if (index !== -1) {
            $scope.item = $scope.postLists[index];
        }
        getSelect.get({type:'load'},{id:id},function (data) {
            $scope.item = data.result;
        });
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/business/modal.classes.html',
            controller: 'ModalcheckCtrl',
            size: 'md',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.item;
                }
            }
        });
    };

    //类型删除
    $scope.del = function (item) {
        var index = $scope.postLists.indexOf(item);
        $scope.item = $scope.postLists[index];
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/business/modal.typeDel.html',
            controller: 'typeDelCtrl',
            scope: $scope,
            size: 'md',
            resolve: {
                items: function () {
                    return $scope.item;
                }
            }
        });
        modalInstance.result.then(function () {
            getSelect.get({type: 'list'}, function (data) {
                $scope.postLists = data.rows;
            });
        })
    };

}]);
// 类型删除
app.controller('typeDelCtrl', ['$scope', '$modalInstance', 'items', '$resource', function ($scope, $modalInstance, items, $resource) {
    var typeDel = $resource(
        $scope.url + 'del',
        {id: "@id"},
        {dataDelete: {method: 'POST', params: {charge: true}, isArray: false}});
    $scope.using = function (id) {
        typeDel.dataDelete({id: id}, function (data) {
            $modalInstance.close(items);
        })
    };
    $scope.cancel = function (id) {
        $modalInstance.close(items);
    }
}]);
// 编辑委托控制器
app.controller('ModalcheckCtrl', ['$scope', '$modalInstance', 'items', '$resource', function ($scope, $modalInstance, items, $resource) {
    $scope.postCheck = items;
    var jobName = $resource($scope.url + 'modify');
    $scope.redact = function (id) {
        jobName.save(
            {
                name: $scope.postCheck.name,
                id: $scope.postCheck.id
            },
            function () {
                $modalInstance.close(items);
            })
    };
}]);

//新增委托控制器
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', '$resource', function ($scope, $modalInstance, $resource) {
    var postName = $resource($scope.url + 'add');
    $scope.postName = function (id) {
        postName.save({name: $scope.postCheck.name}, function () {
            $modalInstance.close();
        })
    };
}]);