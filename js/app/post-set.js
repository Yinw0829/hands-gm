app.controller('SelectCtrl', ['$scope', '$modal', '$log', '$http', '$resource', 'api', 'dataListService', function ($scope, $modal, $log, $http, $resource, api, dataListService) {
    $scope.url = api.url + 'position/';
    var getSelect = $resource(
        $scope.url + ':type',
        {
            id: '@id'
        },
        {
            getPostCompile:{
                url:$scope.url+'load',
                method:'GET',
                isArray:false
            }
        }
    );
    getSelect.get({type: 'type/list'}, function (data) {
        $scope.postLists = data.rows;
        console.log($scope.postLists);
    });
    getSelect.get({type: 'list'}, function (data) {
        $scope.jobLists = data.rows;
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

    //岗位遍历
    function compileIndex(id) {
        var index = -1;
        angular.forEach($scope.jobLists, function (item, key) {
            if (item.id === id) {
                index = key;
                return;
            }
            // console.log(id);
        });
        //结果
        return index;
    }

    //编辑
    $scope.typeCompile = function (id) {
        var index = findIndex(id);
        if (index !== -1) {
            $scope.item = $scope.postLists[index];
        }
        getSelect.get({type: 'type/load'}, {id: id}, function (data) {
            $scope.item = data.result;
        });
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.classes.html',
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
    //岗位编辑
    $scope.postCompile = function (id) {
        console.log(id);
        getSelect.getPostCompile({id:id},function (resp) {
            $scope.jobList=resp.result
        });
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.compile.html',
            controller: 'typeCompileCtrl',
            size: 'md',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.jobList;
                }
            }
        });
        modalInstance.result.then(function () {
            getSelect.get({type: 'list'}, function (data) {
                $scope.jobLists = data.rows;
            });
        })
    };
    //类型删除
    $scope.del = function (item) {
        var index = $scope.postLists.indexOf(item);
        $scope.item = $scope.postLists[index];
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.typeDel.html',
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
            getSelect.get({type: 'type/list'}, function (data) {
                $scope.postLists = data.rows;
            });
        })
    };
    //类型新增
    $scope.typeAdd = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.form.html',
            controller: 'ModalInstanceCtrl',
            scope: $scope,
            size: 'md'
        });
        modalInstance.result.then(function () {
            getSelect.get({type: 'type/list'}, function (data) {
                $scope.postLists = data.rows;
            });
        })
    };
    //岗位新增
    $scope.postAdd = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.classify.html',
            controller: 'postAddController',
            scope: $scope,
            size: 'md'
        });
        modalInstance.result.then(function () {
            getSelect.get({type: 'list'}, function (data) {
                $scope.jobLists = data.rows;
                con
            });
        })
    };
    //岗位删除
    $scope.postDel = function (item) {
        var index = $scope.jobLists.indexOf(item);
        $scope.item = $scope.jobLists[index];
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.jobDel.html',
            controller: 'jobDelCtrl',
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
                $scope.jobLists = data.rows;
            });
        })
    };
}]);
//岗位删除
app.controller('jobDelCtrl', ['$scope', '$modalInstance', 'items', '$resource', function ($scope, $modalInstance, items, $resource) {
    var jobDel = $resource(
        $scope.url + 'del',
        {id: "@id"},
        {dataDelete: {method: 'POST', isArray: false}});
    $scope.dele = function (id) {
        jobDel.dataDelete({id: id}, function (data) {
            $modalInstance.close(items);
        })
    };
    $scope.cancel = function (id) {
        $modalInstance.close(items);
    }
}]);
//类型删除
app.controller('typeDelCtrl', ['$scope', '$modalInstance', 'items', '$resource', function ($scope, $modalInstance, items, $resource) {
    var auError = true;
    var authError = false;
    var typeDel = $resource(
        $scope.url + 'type/del',
        {id: "@id"},
        {dataDelete: {method: 'POST', params: {charge: true}, isArray: false}});
    $scope.using = function (id) {
        typeDel.dataDelete({id: id}, function (data) {
            $modalInstance.close(items);
        });
        // if ($scope.positionCount == 0){
        //     typeDel.dataDelete({id: id}, function (data) {
        //         $modalInstance.close(items);
        //     })
        // }else{
        //     $scope.authError = '已有数据，不能删除！'
        // }
    };
    $scope.cancel = function (id) {
        $modalInstance.close(items);
    }
}]);
//编辑委托控制器
app.controller('typeCompileCtrl', ['$scope', '$modalInstance', 'items', 'dataListService', function ($scope, $modalInstance, items, dataListService) {
    $scope.jobList = items;
    var jobUrl = 'position/modify';
    $scope.setData = {
        name: $scope.jobList.name,
        id: $scope.jobList.id,
        typeId: $scope.jobList.typeId
    };
    $scope.jobName = function () {
        dataListService.dataListUrl(jobUrl, $scope.setData);
    };
    $scope.$on('dataList.Service', function () {
        $scope.respTip = dataListService.successList();
        $modalInstance.close(items);
    });
}]);
//岗位新增委托控制器
app.controller('postAddController', ['$scope', '$modalInstance', '$resource', function ($scope, $modalInstance, $resource) {
    var jobName = $resource($scope.url + 'add');
    $scope.jobName = function (id) {
        jobName.save({name: $scope.postCheck.name, typeId: $scope.postCheck.id}, function () {
            $modalInstance.close();
        })
    };
}]);
//新增委托控制器
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', '$resource', function ($scope, $modalInstance, $resource) {
    var postName = $resource($scope.url + 'type/add');
    $scope.postName = function (id) {
        postName.save({}, {name: $scope.postCheck.name}, function () {
            $modalInstance.close();
        })
    };
}]);
//编辑委托控制器
app.controller('ModalcheckCtrl', ['$scope', '$modalInstance', 'items', '$resource', function ($scope, $modalInstance, items, $resource) {
    $scope.postCheck = items;
    var redact = $resource($scope.url + 'type/modify');
    $scope.redact = function (id) {
        redact.save(
            {
                id: $scope.postCheck.id,
                name: $scope.postCheck.name
            }, function () {
                $modalInstance.close(items);
            })
    };
}]);