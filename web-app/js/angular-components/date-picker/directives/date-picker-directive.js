angular.module('datePickerApp', [])
    .directive('datePicker',['$filter',function($filter){
        return{
        restrict: "A",
        require: '?ngModel',
        scope:{
            date:"=",
            showOn: "@",
            onSelect:"&",
            onClose:"&"
        },

        link:function($scope, $ele,controller) {

            $ele.multiCalendarPicker({
                showOn: $scope.showOn ? $scope.showOn : 'button',
                onSelect:$scope.onSelect(),
                onClose:$scope.onClose()
            })


        }}
    }])
    .controller('datePickerController',function($scope){

        $scope.onSelect = function(date){
            console.info("Date Selected Event: "+date);
        };
        $scope.onClose = function(date){
            console.info("Date Picker Closed Event");
        };
    });

