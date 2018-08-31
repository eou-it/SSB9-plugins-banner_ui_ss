<%--
Copyright 2018 Ellucian Company L.P. and its affiliates.
--%>
<div ng-cloak id="shortcut_module_added" dir="auto">
    <xe-popup-modal show="modalShown" focusbackelement="tools" pageheader="${g.message(code: 'aurora.toolsmenu.keyboard.shortcuts.heading')}">
        <popup-content>
            <div>
                <div ng-repeat="bannershortcut in shortcutObj" class="banner_aria-shortcut_{{$index}}" ng-class="banner_shortcut_{{$id}} ? 'shortcut-container-collapse' : 'shortcut-container-expanded'">
                        <span class="content-heading-shortcut" tabindex="0" ng-keydown="showDescription($event)" data-ng-bind="bannershortcut.sectionHeading" ng-click="showDescription($event)"></span>
                        <span class="shortcutAccordion" ng-keydown="showDescription($event)" ng-click="showDescription($event)" ng-class="!banner_shortcut_{{$id}} ? 'up' : 'down'"></span>
                    <div class="banner-shortcut banner_shortcut_{{$index}}" id="banner_shortcut_{{$id}}" ng-show="!banner_shortcut_{{$id}}">
                        <div class="shortcut-row" ng-repeat="hotkey in bannershortcut.shortcutList">
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