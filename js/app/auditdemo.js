/**
 * Created by iform on 2016-11-25.
 */
app.controller('auditdemo',['$scope','$http','$stateParams','$timeout',function ($scope,$http,$stateParams,$timeout) {
    $scope.sum=$stateParams.itemID;


    $http.get("js/app/cart.json").success(function (data) {
        $scope.cart = data.cart;
    });

    function findIndex(id) {
        var index = -1;
        angular.forEach($scope.cart, function (item, key) {
            if (item.id === id) {
                index = key;
                return;
            }
        });
        return index
    }

    $timeout(function () {
        var id=Number($scope.sum);
        var index=findIndex(id);
        if(index!==-1){
            $scope.Data=$scope.cart[index];
            console.log($scope.Data);
        }
    },2000);

    // $scope.items=function () {
    //     var id=Number($scope.sum);
    //     var index=findIndex(id);
    //     if(index!==-1){
    //         $scope.Data=$scope.cart[index];
    //     }
    //     console.log($scope.Data)
    // };
}]);