<%--
Copyright 2017 Ellucian Company L.P. and its affiliates.
--%>
<div id="userPreferenceDiv" dir="auto" data-ng-controller="PopupCtrl">
    <xe-popup-modal show="modalShown" focusbackelement="tools" pageheader="${g.message(code: 'userpreference.popup.language.heading')}" >
        <popup-content>
            <div>
                <xe-ui-select id="preference" ng-model="language.selected" theme="select2" ng-required="true" text-selected="description">
                    <xe-ui-select-match placeholder="${g.message(code: 'userpreference.popup.language.selectinput.placeholder')}">{{$select.selected.description}}</xe-ui-select-match>
                    <xe-ui-select-choices repeat="localeLang in localeList | propsFilter: {description: $select.search}">
                        <div ng-bind-html="localeLang.description | highlight: $select.search"></div>
                    </xe-ui-select-choices>
                </xe-ui-select>
            </div>
        </popup-content>
        <popup-buttons>
            <xe-button ng-click="saveLocale()" id="saveLanguage" xe-disabled="disableButton" xe-type="primary" xe-label="${g.message(code: 'userpreference.popup.language.save')}" ></xe-button>
        </popup-buttons>
    </xe-popup-modal>
</div>