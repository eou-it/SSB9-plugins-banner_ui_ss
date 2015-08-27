module.directive('currencyInput',['$timeout','$filter','readonlysvc', function($timeout, $filter,readonlysvc) {
    return {
        restrict: 'E',
        template: '<input type="number" ng-model="ngModel" class="form-control" ng-show="showNumber" ng-blur="numberBlurred()" /><input value="{{formatted}}" class="form-control" ng-click="textFocused()" ng-hide="showNumber"/>',
        scope:{
            ngModel : "="
        },
        link: function($scope, $elm, $attrs) {
            var result=parseFloat($attrs.value||0);
            $scope.ngModel=result;
            $scope.showNumber = false;
            $scope.numberBlurred = function(){
                $scope.showNumber = false;
            };

            $scope.textBlurred = function(){
                $scope.showNumber = true;
            };

            $scope.textFocused = function(){
                $scope.showNumber = true;
                $timeout(function(){
                    $elm.find('input[type=number]').focus();
                }, 50)
            };

            $scope.$watch('$scope.showNumber',function(){
                if($scope.showNumber){
                     $timeout(function(){
                        $elm.find('input[type=number]').focus();
                        console.log('focused');
                    }, 50)
                }
            },true);

            $scope.$watch(function() { return $elm.attr('ng-readonly') },function(value){
                if(value !== undefined){
                    readonlysvc.toggle($elm,$elm.attr('ng-readonly'));
                }
            });

            $scope.$watch('ngModel', function(){
                var formatted;
                formatted = $filter("currency")($scope.ngModel);
                if($attrs.currency){
                    formatted = $filter("currency")($scope.ngModel,$attrs.currency,$attrs.decimals);
                }
                $scope.formatted = formatted;
            }, true);





        }
    };
}]);