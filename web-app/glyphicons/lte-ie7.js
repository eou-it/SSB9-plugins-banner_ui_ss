/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'ellucian\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-help' : '&#xe000;',
			'icon-pending' : '&#xe001;',
			'icon-triangle' : '&#xe002;',
			'icon-circle' : '&#xe003;',
			'icon-remove' : '&#xe004;',
			'icon-calendar' : '&#xe005;',
			'icon-exit' : '&#xe006;',
			'icon-delete' : '&#xe007;',
			'icon-insert' : '&#xe008;',
			'icon-filter' : '&#xe009;',
			'icon-home' : '&#xe00a;',
			'icon-preferences' : '&#xe00b;',
			'icon-refresh' : '&#xe00c;',
			'icon-add' : '&#xe00d;',
			'icon-secure' : '&#xe00e;',
			'icon-search' : '&#xe00f;',
			'icon-error' : '&#xe010;',
			'icon-close' : '&#xe011;',
			'icon-warning' : '&#xe012;',
			'icon-user' : '&#xe013;',
			'icon-print' : '&#xe014;',
			'icon-info' : '&#xe015;',
			'icon-duplicate-record' : '&#xe016;',
			'icon-success-icon' : '&#xe017;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};