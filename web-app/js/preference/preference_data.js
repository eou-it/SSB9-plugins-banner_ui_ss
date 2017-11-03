/**
 * Created by eshaank on 11/2/2017.
 */
(function() {
    var uiSelectController = function ($scope, $http, $q) {
        $scope.stateData = [
            {id:"AL",name:"Alabama"},
            {id:"AK",name:"Alaska"},
            {id:"AS",name:"American Samoa"},
            {id:"AZ",name:"Arizona"},
            {id:"WI",name:"Wisconsin"},
            {id:"WY",name:"Wyoming"}
        ];

        var curPage = 0;

        $scope.refreshData = function(search, loadingMore) {
            if (!loadingMore) {
                curPage = 0;
            } else {
                curPage++;
            }
            $scope.isLoading = true;
            $http({
                url: '/PlatformSandboxApp/ssb/uiCatalog/platformAngularComponents/getUISelectData',
                method: "GET",
                params:{ searchString: search, page: curPage}

            }).then(function(res) {
                $scope.options = res.data.result;
                $scope.isLoading = false;
            }, function(error) {
                $scope.isLoading = false;
                console.error(error);
            })

        };
        $scope.state2 = {};
        $scope.state2.selected = $scope.stateData[1];

    };

    var preferenceData = angular.module("preferenceData", ['xe-ui-components']);
    preferenceData.controller("uiSelectController", ["$scope", "$http", "$q", uiSelectController]);
}());
