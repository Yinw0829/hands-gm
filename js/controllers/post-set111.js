app.controller('SelectCtrl', ['$scope', '$modal', '$http', function ($scope, $modal,$http) {

    //用这个方法来刷新
    $scope.getSelect=function () {
        $http.get('http://localhost:8087/hands/manager/api/position/type/list').success(function (data) {
            $scope.postLists = data.rows;
        });
    };

    //页面加载的时候调用这个方法来发起$http.get的请求
    $scope.getSelect();

    //新增
    $scope.add = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.form.html',
            controller: 'ModalInstanceCtrl',
            //这个控制器里定义的方法要在委托控制器里也要能使用必须加上scope:$scope
            scope:$scope,
            //不在页面上控制大小了，直接在这里控制了，页面上add('md')中的'md'删掉
            size: 'md'
        })
    };
}]);
//新增
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', '$filter', '$http', function ($scope, $modalInstance, $filter, $http) {
    $scope.postName = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:8087/hands/manager/api/position/type/add',
            headers: {'Content-Type': 'application/json'},
            data: {name: $scope.name}
        })
            .success(function (data) {
                //关闭页面的时候刷新，这个是在SelectCtrl中定义的方法，通用$modal中的scope:$scope传过来的
                $scope.getSelect();
                //关闭页面
                $modalInstance.close();

            });
    };

}]);









app.controller('SelectCtrl', ['$scope', '$modal', '$log', '$http', function ($scope, $modal, $log, $http) {

    $scope.getSelect=function () {
        $http.get('http://localhost:8087/hands/manager/api/position/type/list').success(function (data) {
            $scope.postLists = data.rows;
        });
    };
    $scope.getSelect();
    $scope.newSelect = function () {
        $http.get('http://localhost:8087/handsmanager/api/position/list').success(function (data) {
            $scope.jobLists = data.rows;
        });
    };
    $scope.newSelect();
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

    //删除
    $scope.postDel = function (id) {
        console.log(id);
        var omit = confirm('是否删除！');
        if (omit) {
            $http({
                method: 'POST',
                url: 'http://localhost:8087/hands/manager/api/position/type/del',
                data: {id: id},
                headers: {'Content-Type': 'application/json'}
            })
                .success(function (msg) {
                    $scope.getSelect();
                })
        }
    };
    //新增
    $scope.add = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.form.html',
            controller: 'ModalInstanceCtrl',
            scope:$scope,
            size: 'md'
        })
    };
    //编辑
    $scope.compile = function (id) {
        // console.log(id);
        var index = findIndex(id);
        if (index !== -1) {
            //index是id在$scope.postLists对象中的位置
            $scope.item = $scope.postLists[index];
        }
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.classes.html',
            controller: 'ModalcheckCtrl',
            size: 'md',
            resolve: {
                items: function () {
                    return $scope.item;
                }
            }
        });
    };

    //岗位新增
    $scope.new = function (size) {
        var modalstation = $modal.open({
            templateUrl: 'tpl/modal/modal.classify.html',
            controller: 'ModalstationCtrl',
            $scope:scope,
            size: 'md'
        })
    }

}]);

//岗位新增委托控制器
app.controller('ModalstationCtrl', ['$scope', '$modalInstance', '$filter', '$http', 'items', function ($scope, $modalInstance, $filter, $http, items) {
    $scope.jobName = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:8087/hands/manager/api/position/type/add',
            headers: {'Content-Type': 'application/json'},
            data: {name: $scope.name, typeId:$scope. typeId}
        })
    }
}]);



//新增委托控制器
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', '$filter', '$http', function ($scope, $modalInstance, $filter, $http) {
    $scope.postName = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:8087/hands/manager/api/position/type/add',
            headers: {'Content-Type': 'application/json'},
            data: {name: $scope.name}
        })
            .success(function (data) {
                $scope.getSelect();
                $modalInstance.close();

            });
    };
}]);

//编辑委托控制器
app.controller('ModalcheckCtrl', ['$scope', '$modalInstance', '$filter', '$http', 'items', function ($scope, $modalInstance, $filter, $http, items) {
    console.log(items);
    $scope.postCheck = items;
    console.log($scope.postCheck);
    //编辑确认
    $scope.redact = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:8087/hands/manager/api/position/type/modify',
            headers: {'Content-Type': 'application/json'},
            data: {
                id: $scope.postCheck.id,
                name: $scope.postCheck.name
            }
        })
            .success(function (data) {
                $modalInstance.close();
            })
    };
}]);