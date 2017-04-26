angular.module('ui.services', [])
    .factory('province', ['api', '$rootScope', '$resource', function (api, $rootScope, $resource) {
        var Url = api.url;
        var resource = $resource(Url + 'district/list');
        var city = [];
        return {
            logCity: function () {
                resource.get(function (resp) {
                    city = resp;
                    if (city.success) {
                        $rootScope.$broadcast('city.services');
                    }
                    //广播   city.services （名称自定义）
                })
            },
            getCity: function () {
                return city;
            }
        }
    }])
    .factory('sex', ['api', '$rootScope', '$resource', function (api, $rootScope, $resource) {
        var Url = api.url;
        var sexUrl = $resource(Url + 'enum/list?enumName=Sex&type=ALL');
        var sex = [];
        return {
            logSex: function () {
                sexUrl.get(function (res) {
                    sex = res;
                    if (sex.success) {
                        $rootScope.$broadcast('sex.services');
                    }
                })
            },
            getSex: function () {
                return sex;
            }
        }
    }])
    .factory('Storage', function () {
        return {
            //在缓存中存入key及相应的data的值，并且将其保存成JSON的格式
            set: function (key, data) {
                return window.localStorage.setItem(key, window.JSON.stringify(data));
            },
            //将缓存中的key（对象）取出来
            get: function (key) {
                return window.JSON.parse(window.localStorage.getItem(key));
            },
            //移除缓存种的key（对象）
            remove: function (key) {
                return window.localStorage.removeItem(key);
            }
        };
    });
