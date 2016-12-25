app.controller('SelectCtrl', ['$scope', '$modal', '$log', '$http', '$resource', 'httpServe', function ($scope, $modal, $log, $http, $resource, httpServe) {
    $scope.url = httpServe.httpUrl + 'position/';
    var getSelect = $resource(
        $scope.url + ':type'
    );
    getSelect.get({type: 'type/list'}, function (data) {
        $scope.postLists = data.rows;
    });
    getSelect.get({type: 'list'}, function (data) {
        $scope.jobLists = data.rows;
    });

    //分页
    // $scope.paginationConf = {
    //     currentPage: 1,
    //     totalItems: 25,
    //     itemsPerPage: 10,
    //     pagesLength: 21,
    //     perPageOptions: [10, 20, 25, 50, 100],
    //     onChange: function () {
    //         var paginationConf = function () {
    //             getSelect.jobLists(
    //                 {
    //                     curPage: $scope.paginationConf.currentPage,
    //                     pageSize: $scope.paginationConf.itemsPerPage
    //                 }, function (data) {
    //                     $scope.paginationConf.totalItems = data.total;
    //                     $scope.jobLists = data.rows;
    //                 });
    //         };
    //         $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', paginationConf)
    //     }
    // };

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
            console.log(id);
        });
        //结果
        return index;
    }

    //编辑
    $scope.typeCompile = function (id) {
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
        var index = compileIndex(id);
        if (index !== -1) {
            $scope.item = $scope.jobLists[index];
        }
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/modal.compile.html',
            controller: 'typeCompileCtrl',
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
    console.log(items);
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
    console.log(items);
    var typeDel = $resource(
        $scope.url + 'type/del',
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
//编辑委托控制器
app.controller('typeCompileCtrl', ['$scope', '$modalInstance', 'items', '$resource', function ($scope, $modalInstance, items, $resource) {
    console.log(items);
    $scope.jobCheck = items;
    var jobName = $resource($scope.url + 'modify');
    $scope.jobName = function (id) {
        jobName.save({},
            {
                name: $scope.jobCheck.name,
                id: $scope.jobCheck.id,
                typeId: $scope.jobCheck.typeId
            },
            function () {
                $modalInstance.close(items);
            })
    };
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
    console.log(items);
    $scope.postCheck = items;
    var redact = $resource($scope.url + 'type/modify');
    $scope.redact = function (id) {
        redact.save({},
            {
                id: $scope.postCheck.id,
                name: $scope.postCheck.name
            }, function () {
                $modalInstance.close(items);
            })
    };
}]);