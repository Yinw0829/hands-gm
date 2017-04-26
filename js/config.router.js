'use strict';


angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    )
    .config(
        ['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                //默认页
                $urlRouterProvider
                .otherwise('/access/signin');
                    // .otherwise('/app/user');
                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: 'tpl/app.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load([
                                        'js/app/user.js',
                                        'js/app/chart.js']);
                                }]
                        }
                    })
                    //忘记密码
                    .state('access.password', {
                        url: '/password',
                        templateUrl: 'tpl/blocks/password.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/signin.js']);
                                }]
                        }
                    })
                    // //用户管理
                    .state('app.user', {
                        url: '/user',
                        templateUrl: 'tpl/user.html'
                    })
                    //企业管理-企业审核
                    .state('app.enterprise_audit', {
                        url: '/enterprise_audit',
                        templateUrl: 'tpl/enterprise_audit.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load('js/app/enterprise.js');
                                }]
                        }
                    })
                    //企业管理-企业详细
                    .state('app.enterprise_detailed', {
                        url: '/enterprise_detailed/:id',
                        templateUrl: 'tpl/enterprise_detailed.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load('js/app/enterpriseList.js');
                                }]
                        }
                    })
                    //招聘列表
                    .state('app.jobList', {
                        url: '/jobList',
                        templateUrl: 'tpl/jobList.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load('js/app/jobList.js');
                                }]
                        }
                    })
                    //企业管理-企业列表
                    .state('app.enterprise_list', {
                        url: '/enterprise_list',
                        templateUrl: 'tpl/enterprise_list.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/app/enterpriseList.js']);
                                }]
                        }
                    })
                    //数据统计-企业统计
                    .state('app.chart_enterprise', {
                        url: '/chart_enterprise',
                        templateUrl: 'tpl/chart_enterprise.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/app/chart-enterprise.js']);
                                }]
                        }
                    })
                    //数据统计-用户统计
                    .state('app.chart_user', {
                        url: '/chart_user',
                        templateUrl: 'tpl/chart_user.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/app/chart-user.js']);
                                }]
                        }
                    })
                    //数据统计-招聘统计
                    .state('app.chart_hands', {
                        url: '/chart_hands',
                        templateUrl: 'tpl/chart_hands.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/app/chart-hands.js']);
                                }]
                        }
                    })
                    //权限设置-角色管理
                    .state('app.role_management', {
                        url: '/role_management',
                        templateUrl: 'tpl/role_management.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/app/management.js']);
                                }]
                        }
                    })
                    //权限设置-区域管理
                    // .state('app.area_management', {
                    //     url: '/area_management',
                    //     templateUrl: 'tpl/area_management.html'
                    // })

                    //岗位设置
                    .state('app.post_set', {
                        url: '/post_set',
                        templateUrl: 'tpl/post_set.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ui.select').then(
                                        function () {
                                            return $ocLazyLoad.load('js/app/post-set.js');
                                        }
                                    );
                                }]
                        }
                    })
                    //其他设置
                    .state('app.other_set', {
                        url: '/other_set',
                        templateUrl: 'tpl/other_set.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/app/other-set.js']);
                                }]
                        }
                    })
                    //行业设置
                    .state('app.business', {
                        url: '/business',
                        templateUrl: 'tpl/business.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/app/business.js']);
                                }]
                        }
                    })
                    // 登录(总管理员不需要注册和密码找回)
                    .state('lockme', {
                        url: '/lockme',
                        templateUrl: 'tpl/page_lockme.html'
                    })
                    .state('access', {
                        url: '/access',
                        template: '<div ui-view class="fade-in-right-big smooth"></div>'
                    })
                    .state('access.signin', {
                        url: '/signin',
                        templateUrl: 'tpl/page_signin.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/signin.js']);
                                }]
                        }
                    })
            }
        ]
    );