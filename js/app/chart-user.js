app.controller('appUser', ['$scope', '$modal', '$log', '$http', '$resource', 'api', '$state','Storage',function ($scope, $modal, $log, $http, $resource, api, $state,Storage) {
    var cityKey = 'city';
    $scope.cities = Storage.get(cityKey);

    $scope.url = api.url + 'appUser/';
    var getSta = $resource(
        $scope.url + ':type',
        {
            statType: '@statType'
        },
        {
            DAY: {method: 'get', params: {statType: 'DAY'}, isArray: false},
            WEEk:{method: 'get', params: {statType: 'WEEK'}, isArray: false},
            MONTH:{method: 'get', params: {statType: 'MONTH'}, isArray: false},
            //注册量
            DAY1: {method: 'get', params: {statType: 'DAY'}, isArray: false},
            WEEK1:{method: 'get', params: {statType: 'WEEK'}, isArray: false},
            MONTH1:{method: 'get', params: {statType: 'MONTH'}, isArray: false},
            //认证量
            DAY2: {method: 'get', params: {statType: 'DAY'}, isArray: false},
            WEEK2:{method: 'get', params: {statType: 'WEEK'}, isArray: false},
            MONTH2:{method: 'get', params: {statType: 'MONTH'}, isArray: false}
        }
    );

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
    // 注册量
    getSta.MONTH1({type:'regCount'},function (data) {
        $scope.MonthLogin = data;
    });
    getSta.WEEK1({type:'regCount'},function (data) {
        $scope.WeekLogin = data;
    });
    getSta.DAY1({type:'regCount'},function (data) {
        $scope.DayLogin = data;
    });
    // 认证量
    getSta.MONTH2({type:'certifyCount'},function (data) {
        $scope.MonthAttes = data;
    });
    getSta.WEEK2({type:'certifyCount'},function (data) {
        $scope.WeekAttes = data;
    });
    getSta.DAY2({type:'certifyCount'},function (data) {
        $scope.DayAttes = data;
    });

}]);