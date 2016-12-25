//招聘列表
app.controller('applicationsList', ['$scope', '$modal', '$http', '$filter', 'httpServe', '$resource', '$timeout', function ($scope, $modal, $http, $filter, httpServe, $resource, $timeout) {
    $scope.url = httpServe.httpUrl;
    var getBring = $resource(
        $scope.url + ':type',
        {
            status: '@status',
            id: '@id'
        }
    );
    getBring.get({type: 'recruit/list'}, {status: 'NORMAL'}, function (data) {
        $scope.bringList = data.rows;
    });

    $scope.seeClick = function (id) {
        console.log(id);
        getBring.get({type: 'enterprise/load'},{id:id}, function (data) {
            $scope.item = data.result;
        });
        var modalInstance = $modal.open({
            templateUrl:'tpl/modal/jobList/jobList.detail.html',
            size:'lg',
            controller:'ParticularCtrl',
            scope:$scope,
            resolve:{
                items:function () {
                    return $scope.item;
                }
            }
        });
        modalInstance.result.then(function () {
            getBring.get({type: 'recruit/list'}, {status: 'NORMAL'}, function (data) {
                $scope.bringList = data.rows;
            });
        })
    };
    // //正常状态
    // $scope.paginationConf = {
    //     currentPage: 1,
    //     totalItems: 25,
    //     itemsPerPage: 10,
    //     pagesLength: 21,
    //     perPageOptions: [10, 20, 25, 50, 100],
    //     onChange: function () {
    //         var paginationConf = function () {
    //             getNot.getNormal(
    //                 {
    //                     type: 'list'
    //                 },
    //                 {
    //                     curPage: $scope.paginationConf.currentPage,
    //                     pageSize: $scope.paginationConf.itemsPerPage
    //                 }, function (data) {
    //                     $scope.paginationConf.totalItems = data.total;
    //                     $scope.enterpriseList = data.rows;
    //                 });
    //         };
    //         $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', paginationConf)
    //     }
    // };
}]);

app.controller('ParticularCtrl', ['$scope', '$modalInstance', '$filter', 'items', '$resource', function ($scope, $modalInstance, $filter, items, $resource) {
    var stops = $resource($scope.url + 'recruit/stop');
    $scope.stop = function (id) {
        stops.save({id:id},function () {
            $modalInstance.close(items);
        });
    };
    $scope.ok = function () {
        $modalInstance.close(items);
    }
}]);