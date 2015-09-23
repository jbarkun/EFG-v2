(function () {
    var app = angular.module('test', ['ngMask', 'ui.bootstrap', 'ngFileUpload']);

    app.controller("testController", ['$scope', function ($scope) {

        $scope.num = 1;
        $scope.numArray = [1];

        this.allowAddNew = true;
        this.allowRemove = false;

        this.addNum = function () {
            $scope.num += 1;
            $scope.numArray.push($scope.num);

            //disable Add New button if there are 10 or more forms
            if ($scope.numArray.length >= 10) {
                this.allowAddNew = false;
            }

            if ($scope.numArray.length >= 1) {
                this.allowRemove = true;
            }
        };

        this.remove = function (removeItem) {
            $scope.numArray = jQuery.grep($scope.numArray, function (value) {
                return value != removeItem;
            });
            this.allowAddNew = true;


            //disable X button when only one form left
            if ($scope.numArray.length <= 1) {
                this.allowRemove = false;
            }

        };
    }]);

    app.controller("uploadController", ['$rootScope', 'Upload', function($rootScope, Upload){
        $rootScope.upload = function (file) {
            delete $rootScope.uploadProgress;
            if (!file.$error){
                delete $rootScope.uploadError;
                Upload.upload({
                    url: 'upload.php',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $rootScope.uploadProgress = progressPercentage;
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    if (data.substring(0, 4) == 'http'){
                        $rootScope.logoUrl = data;
                    }
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                })
            }
            else {
                $rootScope.uploadError = file.$error;
            }
        };
    }]);
})();