angular.module('datePickerApp', [])
    .directive('datePicker',function(){
        return{
        restrict: "A",
        scope:{
            date:"=",
            showOn: "@",
            onSelect:"&",
            onClose:"&"
        },

        link:function($scope, $ele) {

            $ele.multiCalendarPicker({
                showOn: $scope.showOn ? $scope.showOn : 'button',
                onSelect:$scope.onSelect(),
                onClose:$scope.onClose()
            })


        }}
    });


