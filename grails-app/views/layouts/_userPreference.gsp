<%--
Copyright 2017 Ellucian Company L.P. and its affiliates.
--%>
<div id="userPreferenceDiv" ng-app="userPreference" data-ng-controller="PopupCtrl">
    <xe-popup-modal show="modalShown" title="{{title}}">
        <popup-content>
            <div>
                <xe-ui-select id="preference" ng-model="locale.selected" theme="select2">
                    <xe-ui-select-match>{{$select.selected.name}}</xe-ui-select-match>
                    <xe-ui-select-choices repeat="locale in localeList | propsFilter: {name: $select.search}">
                        <div ng-bind-html="locale.name | highlight: $select.search"></div>
                    </xe-ui-select-choices>
                </xe-ui-select>
            </div>
        </popup-content>
        <popup-buttons>
            <xe-button ng-click="saveLocale()" id="button_0" xe-type="primary" xe-label="SAVE"  xe-disabled="false"></xe-button>
        </popup-buttons>
    </xe-popup-modal>
</div>