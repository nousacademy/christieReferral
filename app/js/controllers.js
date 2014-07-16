'use strict';
/* Controllers */

angular.module('myApp.controllers', [])
        .controller('onePage', function($scope, $http, $filter) {
            $scope.query = '';
            $scope.user = {};
            $scope.user.type = 'referral';
            $scope.user.status = 'not used';
            $scope.user.stylist = 'default';
            $scope.refUsage = 0;
            
            $scope.createUser = function() {
                $scope.user.ref_code = $scope.query;
                if (!$scope.user.firstname || !$scope.user.lastname || !$scope.user.email) {
                    console.log('field empty')
                    return;
                }
                console.log($scope.user)
                $http.post('http://api.metroclick.us/christie/create', $scope.user).success(function(createData) {
                    console.log(createData);
                    $scope.create = createData;
                    $scope.allUsers();
                    $scope.modalPopUp = false;
                });
            };
            $scope.allUsers = function(cb) {
                $http.get('http://api.metroclick.us/christie/getlist').success(function(lists) {
                    console.log(lists);
                    $scope.lists = lists;
                    if (cb)
                        cb();
                });
            };
            $scope.allUsers();
            //
            $scope.statusUpdate = function(value) {
                $scope.filteredStatus = 0;
                console.log(value);
                angular.forEach(value, function(value) {
                    if (value.status == 'not used') {
                        $scope.filteredStatus++;
                        console.log('your status has been updated!!')

                    }
                })

            }


            // user info revealer
            $scope.userInfo = false;
            $scope.showUserInfo = function() {

                console.log('i was just clicked')
                $scope.allUsers(function() {
                    $scope.filtered = $filter('filter')($scope.lists, $scope.query);
                    console.log($scope.filtered)
                    $scope.statusUpdate($scope.filtered);
                })
                $scope.userInfo = true;
            };
            // modal control
            $scope.modalPopUp = false;
            $scope.modalAppear = function() {

                $scope.modalPopUp = true;
            };
            
            $scope.modalReferral = false;
            $scope.referralConfirm = function(){
                $scope.modalReferral = true;
            }
            
            //edwin's code
            $scope.updateBackEnd = function() {
                var count = $scope.refUsage;
                var arrayToUpdate = [];
                for (var i = 1; (i < $scope.filtered.length && count != 0); i++) {
                    if ($scope.filtered[i].status == "not used") {
                        arrayToUpdate.push($scope.filtered[i]._id);
                        count--;
                    }
                }
                console.log(arrayToUpdate);
                $http.post('http://api.metroclick.us/christie/updatestatus', {'id': arrayToUpdate}).success(function(data) {
                    console.log(data);
                    $scope.showUserInfo();
                });
            }
            var refUsage = 0;
            $scope.incRefUses = function() {
                if ($scope.refUsage >= $scope.filteredStatus) {
                    console.log("can't go above max available referrals");
                    return;
                }
                else {
                    $scope.refUsage++;
                }
            }

            $scope.decRefUses = function() {
                if ($scope.refUsage == 0) {
                    console.log("can't go below zero");
                    return;
                }
                else {
                    $scope.refUsage--;
                }
            }
        });


