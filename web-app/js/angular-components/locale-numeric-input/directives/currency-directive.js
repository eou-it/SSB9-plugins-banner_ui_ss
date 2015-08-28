module.directive('currencyInput',['$timeout','$filter','readonlysvc','$compile', function($timeout, $filter,readonlysvc,$compile) {
    var withoutDecimal='<input type="number" ng-model="ngModel" class="form-control" ng-show="showNumber" ng-blur="numberBlurred()" only-number/><input value="{{formatted}}" class="form-control" ng-click="textFocused()" ng-hide="showNumber" only-number/>';
    var withDecimal='<input type="number" ng-model="ngModel" class="form-control" ng-show="showNumber" ng-blur="numberBlurred()" /><input value="{{formatted}}" class="form-control" ng-click="textFocused()" ng-hide="showNumber" />';
    var getTemplate = function(decimalLength){
        var template = '';
        decimalLength = decimalLength||0;
        if(decimalLength==0) {
            template = withoutDecimal;
        } else {
            template = withDecimal;
        }
        return template;
    };

    return {
        restrict: 'E',
        template: '<input type="number" ng-model="ngModel" class="form-control" ng-show="showNumber" ng-blur="numberBlurred()" /><input value="{{formatted}}" class="form-control" ng-click="textFocused()" ng-hide="showNumber"/>',
        scope:{
            ngModel : "="
        },
        link: function($scope, $elm, $attrs) {
            var result=parseFloat($attrs.value||0);
            $scope.ngModel=result;
            $elm.html(getTemplate($attrs.decimals));
            var liveRegion= $('.number-input-accessible');
            if (liveRegion.length == 0) {
                liveRegion = $("<span>", {
                    role: "status",
                    "aria-live": "assertive",
                    "aria-atomic":"true"
                })
                    .addClass("number-input-accessible screen-reader")
                    .appendTo(document.body);
            }
            $elm.find('input[type=number]').focus(function() {
                var ariaText=$.i18n.prop("numeric.currency.value");
                var editUnavailableText=$.i18n.prop("numeric.edit.unavailable");
                if ($elm.find('input').attr('readonly')) {
                    ariaText = ariaText+" "+editUnavailableText;
                }
                liveRegion.text(ariaText);
            });

            $compile($elm.contents())($scope);
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