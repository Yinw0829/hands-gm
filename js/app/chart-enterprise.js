app.controller('listByStat', ['$scope', '$modal', '$log', '$http', '$resource', 'api', '$state', 'Storage',function ($scope, $modal, $log, $http, $resource, api, $state,Storage) {
    var cityKey = 'city';
    $scope.cities = Storage.get(cityKey);

    $scope.url = api.url + 'enterprise/';
    var getSta = $resource(
        $scope.url + ':type',
        {
            statType: '@statType',
            curPage: "@curPage",
            pageSize: "@pageSize"
        },
        {
            DAY: {method: 'get', params: {statType: 'DAY'}, isArray: false},
            WEEk:{method: 'get', params: {statType: 'WEEK'}, isArray: false},
            MONTH:{method: 'get', params: {statType: 'MONTH'}, isArray: false},
            DAY1: {method: 'get', params: {statType: 'DAY'}, isArray: false},
            WEEK1:{method: 'get', params: {statType: 'WEEK'}, isArray: false},
            MONTH1:{method: 'get', params: {statType: 'MONTH'}, isArray: false}
        }
    );
    //月统计
    $scope.paginationConf = {
        currentPage:1,
        totalItems:25,
        itemsPerPage:10,
        pagesLength:21,
        perPageOptions:[10,20,25,50,100],
        onChange:function () {
            var paginationConf = function () {
                getSta.MONTH(
                    {type:'listByStat'},
                    {
                        curPage: $scope.paginationConf.currentPage,
                        pageSize: $scope.paginationConf.itemsPerPage
                    },function (data) {
                        $scope.paginationConf.totalItems = data.total;
                        $scope.MonthList = data.rows;
                    });
            };
            $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', paginationConf)
        }
    };
    //周统计
    $scope.disabledConf = {
        currentPage:1,
        totalItems:25,
        itemsPerPage:10,
        pagesLength:21,
        perPageOptions:[10,20,25,50,100],
        onChange:function () {
            var disabledConf = function () {
                getSta.WEEk(
                    {type:'listByStat'},
                    {
                        curPage: $scope.disabledConf.currentPage,
                        pageSize: $scope.disabledConf.itemsPerPage
                    },function (data) {
                        $scope.disabledConf.totalItems = data.total;
                        $scope.WeekList = data.rows;
                    });
            };
            $scope.$watch('disabledConf.currentPage + disabledConf.itemsPerPage', disabledConf)
        }
    };
    //天统计
    $scope.dayConf = {
        currentPage:1,
        totalItems:25,
        itemsPerPage:10,
        pagesLength:21,
        perPageOptions:[10,20,25,50,100],
        onChange:function () {
            var dayConf = function () {
                getSta.DAY(
                    {type:'listByStat'},
                    {
                        curPage: $scope.dayConf.currentPage,
                        pageSize: $scope.dayConf.itemsPerPage
                    },function (data) {
                        $scope.dayConf.totalItems = data.total;
                        $scope.DayList = data.rows;
                    });
            };
            $scope.$watch('dayConf.currentPage + dayConf.itemsPerPage', dayConf)
        }
    };




    // getSta.MONTH({type:'listByStat'},function (data) {
    //     $scope.MonthList = data.rows;
    // });
    // getSta.WEEk({type:'listByStat'},function (data) {
    //     $scope.WeekList = data.rows;
    // });
    getSta.DAY({type:'listByStat'},function (data) {
        $scope.DayList = data.rows;
    });
    getSta.MONTH1({type:'regCount'},function (data) {
        $scope.MonthLists = data;
    });
    getSta.WEEK1({type:'regCount'},function (data) {
        $scope.WeekLists = data;
    });
    getSta.DAY1({type:'regCount'},function (data) {
        $scope.DayLists = data;
    });

}]);