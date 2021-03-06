(function () {
    var app = angular.module('efg', ['ngMask', 'ui.bootstrap', 'ngFileUpload', 'ngAutocomplete']);

    app.controller("FooterController", ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

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

        $scope.copyFooters = function(){
            var footerArray = [];

            for (var num in $scope.numArray){
                var index = parseInt(num) + 1;
                var footerCode = $.trim($('#footer' + index).html());
                footerArray.push(footerCode);
            }

            var footerArrayToJson = angular.toJson(footerArray);
            $http.post('results.php', footerArrayToJson).then(function(response){
                $rootScope.zipFile = response.data;
            });
        };
    }]);

    app.controller("UploadController", ['$rootScope', 'Upload', function($rootScope, Upload){
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

    app.controller("ResultController", ['$rootScope', function($rootScope){

    }])
})();