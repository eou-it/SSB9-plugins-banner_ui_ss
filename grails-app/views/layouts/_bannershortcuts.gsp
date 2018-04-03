<%--
Copyright 2018 Ellucian Company L.P. and its affiliates.
--%>
<div id="shortcut_module_added" dir="auto">
    <xe-popup-modal show="modalShown" focusbackelement="tools" pageheader="${g.message(code: 'js.keyboard.shortcut.heading')}">
        <popup-content>
            <div>
                <div ng-repeat="bannershortcut in shortcutObj" ng-class="banner_shortcut_{{$index}} ? 'shortcut-container-expanded' : 'shortcut-container-collapse'">
                        <span class="content-heading-shortcut" tabindex="0" ng-keydown="showDescription($event)" data-ng-bind="bannershortcut.sectionHeading" ng-click="showDescription($event)"></span>
                        <span class="shortcutAccordion" ng-keydown="showDescription($event)" ng-click="showDescription($event)" ng-class="banner_shortcut_{{$index}} ? 'up' : 'down'"></span>
                    <div class="banner-shortcut" id="banner_shortcut_{{$index}}" ng-show="banner_shortcut_{{$index}}">
                        <div class="shortcut-row" ng-repeat="hotkey in bannershortcut.shortcutList" tabindex="0">
                            <div class="shortcut-description" aria-label="{{hotkey.description}}" data-ng-bind="hotkey.description"></div>
                            <div class="column-container">
                                <span ng-repeat-start="item in hotkey.combo" class="chicklet" data-ng-bind="item"></span><div class="delimiter-shortcut" ng-repeat-end ng-if="!$last">&nbsp;</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </popup-content>
    </xe-popup-modal>
</div>