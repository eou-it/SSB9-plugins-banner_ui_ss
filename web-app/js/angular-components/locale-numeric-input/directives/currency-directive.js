module.directive('currencyInput', function ($timeout, $filter,$http) {
    return {
        restrict: 'EA',
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
            $scope.$watch('ngModel', function(){
                var formatted;
                formatted = $filter("currency")($scope.ngModel);
                if($attrs.currency){
                    formatted = $filter("currency")($scope.ngModel,$attrs.currency,$attrs.decimals);
                }
                $scope.formatted = formatted;
            }, true);





            /*
                $scope.toRemoteCurrencyFormat = function(){
                    var locale = $attrs.currencycode;
                    var scriptEle = $("script[src*='angular-locale_']");
                    var path = scriptEle.attr('src');
                    var clientLocaleCurrencycode = path.match(/angular-locale_(.+).js/i)[1];
                    console.log('client code is '+ clientLocaleCurrencycode);
                    var remoteLocalepath = path.replace(clientLocaleCurrencycode,$attrs.currencycode);
                    scriptEle.remove();
                    $.getScript("https://code.angularjs.org/1.0.7/i18n/angular-locale_" + locale + ".js");
                }
            */
        }
    };
});