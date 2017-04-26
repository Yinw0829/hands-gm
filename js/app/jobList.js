//招聘列表
app.controller('applicationsList', ['$scope', '$modal', '$http', '$filter', 'api', '$resource', '$timeout', function ($scope, $modal, $http, $filter, api, $resource, $timeout) {
    $scope.url = api.url + 'recruit/';
    var getBring = $resource(
        $scope.url,
        {}, {
            bringLoad: {
                url: $scope.url + 'load',
                method: 'get',
                params: {id: '@id'},
                isArray: false
            },
            bringList: {
                url: $scope.url + 'list',
                method: 'get',
                params: {status: 'NORMAL', curPage: '@curPage', pageSize: '@pageSize'},
                isArray: false
            }
        }
    );
    $scope.seeClick = function (id) {
        getBring.bringLoad({id: id}, function (resp) {
            $scope.item = resp.result;
        });
        var modalInstance = $modal.open({
            templateUrl: 'tpl/modal/jobList/jobList.detail.html',
            size: 'lg',
            controller: 'ParticularCtrl',
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.item;
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.bringList.onChange()
        });
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
                getBring.bringList(
                    {
                        curPage: $scope.paginationConf.currentPage,
                        pageSize: $scope.paginationConf.itemsPerPage
                    }, function (data) {
                        $scope.paginationConf.totalItems = data.total;
                        $scope.bringList = data.rows;
                        console.log($scope.bringList);
                    });
            };
            $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', paginationConf)
        }
    };
}]);

app.controller('ParticularCtrl', ['$scope', '$modalInstance', '$filter', 'items', '$resource', function ($scope, $modalInstance, $filter, items, $resource) {
    var stops = $resource($scope.url + 'stop');
    $scope.stop = function (id) {
        stops.save({id: id}, function () {
            $modalInstance.close(items);
        });
    };
    $scope.ok = function () {
        $modalInstance.close(items);
    }
}]);