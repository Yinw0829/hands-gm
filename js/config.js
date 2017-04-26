// config

var app =
    angular.module('app')
        .config(
            ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider',
                function ($controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider) {

                    // lazy controller, directive and service
                    app.controller = $controllerProvider.register;
                    app.directive = $compileProvider.directive;
                    app.filter = $filterProvider.register;
                    app.factory = $provide.factory;
                    app.service = $provide.service;
                    app.constant = $provide.constant;
                    app.value = $provide.value;
                    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
                    $provide.provider('api', function () {
                        this.$get = function () {
                            return {
                                httpUrl: '/hands-manager/'
                            }
                        }
                    })
                }
            ])
        .service('findIndex', function () {
            var _Index = '';
            this.idIndex = function (id, items) {
                _Index = -1;
                angular.forEach(items, function (item, key) {
                    if (item.userId === id) {
                        _Index = key;
                        return;
                    }
                });
                return _Index
            }
        })
        .factory('dataListService', ['$rootScope', '$resource', 'api', function ($rootScope, $resource, api) {
            var apiUrl = api.url;
            $rootScope.dataList = [];
            return {
                dataListUrl: function (address, setData) {
                    var dataListCode = $resource(apiUrl + address, {}, {
                        postApply: {
                            url: apiUrl + address,
                            method: 'POST',
                            isArray: false
                        }
                    });
                    dataListCode.postApply(setData, function (resp) {
                        $rootScope.dataList = resp;
                    });
                    $rootScope.$broadcast('dataList.Service')
                },
                successList: function () {
                    return $rootScope.dataList;
                }
            }
        }]);