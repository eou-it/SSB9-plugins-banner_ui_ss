

var local=navigator.language;
var locale=local.toLowerCase();
console.log("locale"+locale);
if(!(locale=='ar-sa')) {
	document.write('<script src="../plugins/banner-ui-ss-2.10.4/js/angular/locales/angular-locale_' + locale + '.js"><\/script>');
}
var module = angular.module('numericApp', []);

module.controller('numericController',function($scope) {



$scope.show = function() {
	console.log($scope.myModel1);
}
});