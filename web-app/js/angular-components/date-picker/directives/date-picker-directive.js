angular.module('datePickerApp', [])
    .directive('datePicker',['$filter',function($filter){
        return{
        restrict: "EA",
        require: '?ngModel',
        scope:{
            date:"=",
            showOn: "@",
            onSelect:"&onSelect",
            onClose:"&onClose"
        },

        link:function($scope, $ele,controller) {

            $ele.multiCalendarPicker({
                showOn: $scope.showOn ? $scope.showOn : 'button',
                onSelect:$scope.onSelect(),
                onClose:$scope.onClose()
            })
            /*$ele.bind("blur", function () {
                var target = $ele.val();
                controller.$setViewValue(target);
                var validDateFormat = true;
                if (target === '') {
                    validDateFormat = true;
                } else {
                    try {
                        $.multicalendar.parse(target, calendarType);
                        validDateFormat = true;
                    } catch (e) {
                        validDateFormat = false;
                    }
                }

                controller.$setValidity('dateFormat', validDateFormat);
                $scope.$apply();
            });*/
        }}
    }])
    .controller('datePickerController',function($scope){

        $scope.onSelect = function(date){
            console.error("date Selected"+date);
        };
        $scope.onClose = function(date){
            console.error("date in Close");
        };
    });

