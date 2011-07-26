/**
 * @author jmiller - common controls
 */

var BindingAgent = {
    map: new Object(),
    get: function(name) {
        return this.map[name];
    },
    set: function(name, value) {
        this.map[name] = value;
        return this.map[name];
    }
};

function createJSON(o,stringBuilder){
    var childNodes = Ext.query('div#'+o.id +' input')
    var splitter = new Array();
    for(var i=0;i<childNodes.length;i++){
    var extNode = Ext.getCmp(childNodes[i].id);
        if(extNode && typeof extNode.toJSONString == 'function'){
        splitter[splitter.length] = extNode.toJSONString();
      }
    }
    stringBuilder = stringBuilder + splitter.join(",");
    return stringBuilder;
}

function HttpProxy(url, method) {
    return new Ext.data.HttpProxy({
        url: url,
        method: (typeof(method) != "undefined") ? method : "GET"
    });
}


function HttpProxyWithMethod(url, method) {
   return new Ext.data.HttpProxy({
        url: url,
        method: method
    });
}
                                                     
function JsonStore(url, fields) {
    return {
        xtype: 'jsonstore',
        root: 'data',
        fields: fields,
        proxy: new HttpProxy(url,"")
    };
}

function JsonStoreWithMethod(url,method, fields) {
    return {
        xtype: 'jsonstore',
        root: 'data',
        fields: fields,
        proxy: new HttpProxyWithMethod(url,method)
    };
}

function CodeAutoComplete(id, label, displayField, valueField, binding, url, minChars, tabIndex) {
    var comp = {
        xtype : 'combo',
        id: id,
        fieldLabel: label,
        width: 250,
        triggerAction : 'all',
        displayField : displayField,
        valueField : valueField,
        typeAhead: true,
        tpl: '<tpl for="."><div ext:qtip="{' + displayField + '}, {' + valueField + '}" class="x-combo-list-item">{' + displayField + '}</div></tpl>',
        listeners: {
            // none
        },
        store : new JsonStoreWithMethod(url,"GET",['id', valueField, displayField]),
        plugins: [ Ext.ux.FieldLabeler ],
        toJSONString:function(){
         return '"'+id+'":"'+this.getValue()+'"'
        }
    };

    if (typeof(minChars) != "undefined"
      && minChars != null) {
        comp.minChars = minChars;
    }

    if (typeof(tabIndex) != "undefined"
      && tabIndex != null) {
        comp.tabIndex = tabIndex;
    }

    return comp;
}



function GridPanelGeneric(id,width,storeId,uri,columnModel){
    var contentStoreVar = new Ext.data.JsonStore({
        url:uri
    });
    var cm = new Ext.grid.ColumnModel({
         defaults: {
            width: 300,
            sortable: true
        },
        columns:columnModel
       });
    return {
        xtype :  "grid",
        cm : cm,
        id : id,
        layout:'fit',
        store : contentStoreVar,
        loadMask : true,
        stripeRows : true,
        viewConfig : {
            forceFit : true
        },
        width: width,
        autoHeight: true,
        height:100,
        frame: true,
        iconCls: 'icon-grid',
        collapsible: false,
        border: false
    };
}

function GridPanel(id, storeId, uri) {
    var recordFields = [
        { name : 'id', mapping : 'id' },
        { name : 'text', mapping : 'text' }
    ];

    var contentStoreVar = new Ext.data.Store({
        storeId: storeId,
        restful: true,
        autoload: false,
        proxy: new Ext.data.HttpProxy({
            url: uri
        }),
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            idProperty: 'id',
            root: 'data',
            messageProperty: 'message'
        },
        recordFields),
        writer: new Ext.data.JsonWriter({
            writeAllFields: true,
            encode: false
        }),
        listeners: {
            exception: function(misc, type) {
                Ext.MessageBox.alert('encountered exception: ' + type);
            },
            metachange: function(store, meta) {
                var g = Ext.getCmp('gridId' + id);

                g.getColumnModel().setConfig(meta.colModel);
                g.reconfigure(store, g.getColumnModel());
            }
        }
    });

    var cm = new Ext.grid.ColumnModel([
        {
            header : 'Id',
            sortable : true,
            hidden: true,
            dataIndex : 'id'
        },
        {
            header : 'Text',
            sortable : true,
            dataIndex : 'text'
        }
    ]);

    return {
        xtype :  "grid",
        cm : cm,
        id : id,
        layout:'fit',
        store : contentStoreVar,
        loadMask : true,
        stripeRows : true,
        viewConfig : {
            forceFit : true
        },
        width: "100%",
        autoHeight: true,
        frame: true,
        iconCls: 'icon-grid',
        collapsible: false,
        border: false,
        header: false
    };
}

function FormPanel(id, items, buttonHandler, height) {
    var comp = {
        xtype: 'form',
        formId: id,
        header: false,
        frame : true,
        bodyStyle : 'padding: 6px',
        labelWidth : 75,
        labelAlign: 'right',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults : {
            xtype: 'textfield',
            msgTarget : 'side'
        },
        items: [ items ]
    };

    if (buttonHandler != null) {
        comp.buttons = [ {
            text: 'Go',
            handler: buttonHandler
        }];
    }
//
//    if (height != null) {
//        comp.height = height;
//    }

    return comp;
}

function Spacer(width, height) {
    return {
        xtype: 'spacer',
        width: width,
        height: height
    };
}

function CheckboxGroup(items,label){
    return {
            xtype: 'checkboxgroup',
            fieldLabel: label,
            items: items
    };
}



function Button(text, click) {
    return {
        xtype: 'button',
        text: text,
        handler: click
    };
}

function Text(label, value,id) {
    return {
        xtype: 'textfield',
        fieldLabel: label,
        value: value,
        id:id,
        plugins: [ Ext.ux.FieldLabeler ],
        toJSONString:function(){
         var returnValue =  this.getValue().trim();
         if(returnValue.length==0){
              return '"'+id+'":null'  
            }
         return '"'+id+'":"'+this.getValue()+'"'  
        }
    };
}

function NumberField(label, value,id) {
    return {
        xtype: 'numberfield',
        fieldLabel: label,
        value: value,
        id:id,
        plugins: [ Ext.ux.FieldLabeler ],
        toJSONString:function(){
         return '"'+id+'":"'+this.getValue()+'"'
        }
    };
}

function CheckBox(label, checked,id) {
    return {
        xtype: 'checkbox',
        checked: checked,
        fieldLabel:label,
        id:id,
        plugins: [ Ext.ux.FieldLabeler ],
        toJSONString:function(){
          return '"'+id+'":"'+this.getValue()+'"'
        }
    };
}



function ListBox(list,id,emptyText,displayfield){    
    var data = [
           ['', 'None'],
           ['OR', 'OR'],
           ['TO', 'TO']
       ];
    var store = new Ext.data.ArrayStore({
            idIndex: 0,
            fields: ['value', 'name'],
            data: data
        });

    var combo = new Ext.form.ComboBox({
        store: store,
        displayField: 'name',
        valueField: 'value',
        forceSelection: true,
        fieldLabel: displayfield,
        typeAhead: true,
        mode: 'local',        
        triggerAction: 'all',
        emptyText:emptyText,
        selectOnFocus:true,
        id:id ,
        typeAhead: true,
         plugins: [ Ext.ux.FieldLabeler ],
        toJSONString:function(){
          return '"'+id+'":"'+this.getValue()+'"'
        }
    });    
    return combo;
}

function HBox(items) {
    return {
        xtype : 'panel',
        layout: 'hbox',
        layoutConfig: {
            pack: 'center',
            padding: 10
        },
        border: false,
        labelAlign: 'right',
        autoEl : { },
        items : items
    };
}

function HBoxGeneric(align,width,height,items) {
    return {
        xtype : 'panel',
        layout: 'hbox',
        layoutConfig: {
            pack: 'center',
            padding: 10,
            align:align
        },
        border: false,
        labelAlign: 'right',
        autoEl : { },
        items : items ,
        height:height,
        width:width
    };
}



function VBox(items) {
    return new FitLayout([{
        xtype : 'panel',
        layout: 'vbox',
        layoutConfig: {
            pack: 'center',
            padding: 10
        },
        border: false,
        labelAlign: 'right',
        autoEl : { },
        items : items
    }]);
}

function VBoxGeneric(align,width,height,id,items) {
    return new FitLayout([{
        height:height ,
        width:width,
        id:id,
        xtype : 'panel',
        layout: 'vbox',
        layoutConfig: {
            pack: 'center',
            padding: 10,
            align:align
        },
        border: false,
        labelAlign: 'right',
        autoEl : { },
        items : items
        //autoWidth:true
    }]);
}


function TablePanel(columns,items) {
    return new FitLayout([{
        autoHeight:true,
        xtype : 'panel',
        layout: 'table',
        layoutConfig:{columns:columns,
                       padding: 10
                     },
        border: true,
        autoEl : { },
        items : items
    }]);
}


function BoxLayout(items, orientation) {
    return {
        xtype : 'panel',
        layout: (typeof(orientation) != "undefined") ? orientation : "hbox",
        layoutConfig: {
            pack: 'center',
            padding: 10
        },
        border: false,
        labelAlign: 'right',
        autoEl : { },
        items : items
    };
}

function Column(width, hidden) {
    return {
        xtype: 'panel',
        labelAlign: 'right',
        border: false,
        columnWidth: width,
        hidden: (typeof(hidden) != "undefined") ? hidden : false,
        items: [ ]
    };
}

function ColumnLayout(columns) {
    var cols = new Array();
    var w = (Math.round((1 / columns)*1000)/1000);

    for (var x = 0; x < columns; x++) {
        cols.push(new Column(w));
    }

    return {
        xtype : 'panel',
        layout: 'column',
        monitorResize: true,
        border: false,
        items : cols
    };
}



function FitLayout(items) {
    return {
        xtype : 'panel',
        layout: 'fit',
        border: false,
        autoEl : { },
        items : items
    };
}

function Panel(title,renderTo, items) {
    new Ext.Panel({
        overflow:'auto',
        title:title,
        renderTo: renderTo,
        id: renderTo + "Panel",
        border: false,
        monitorResize: true,
        items: items
    });
}

function MenuCheckBox(id, text, checked, handler) {
    return {
        id: id,
        text: text,
        checked: checked,
        checkHandler: handler
    };
}





function ContentBlock(parentId, renderTo) {
    function onItemCheck(item, checked){
        if (checked) {
            var mainPanel = Ext.getCmp(parentId);

            var c = parseInt(item.id.replace('columnOption', ''));

            Ext.MessageBox.alert(c + ' columns requested');
        }
    }

    new Ext.Panel({
        renderTo: renderTo,
        monitorResize: true,
        layout: 'fit',
        id: parentId,
        items : [ ],
        tbar: new Ext.Toolbar({
            items : [
                new Ext.Toolbar.Fill(),
                {
                    text: 'Columns',
                    iconCls: 'bmenu',
                    id: parentId + 'ColumnMenu',
                    menu: null
                }
            ]
        })
    });

    return {
        parentId: parentId,
        data: null,
        cm: null,
        columnMenu: new Ext.menu.Menu({
            style: {
                overflow: 'visible'
            },
            items: [ ]
        }),
        initializeContainer: function() {
            var container = Ext.getCmp(this.parentId);

            var cols = [];

            for (var x = 0; x < this.cm.length; x++) {
                var cmObj = this.cm[x];

                if (!cmObj.hidden) {
                    continue;
                }

                cols.push(cmObj.dataIndex);
            }

            var cl = new ColumnLayout(cols.length);

            container.removeAll(true);

            container.add(cl);
            container.doLayout();
        },
        setColumnModel: function(cm) {
            this.cm = cm;
        },
        getData: function() {
            return this.data;
        },
        setData: function(records) {
            if (typeof(records) == "undefined"
             || records.length <= 0) {
                return false;
            }

            this.data = records;

            this.initializeContainer();

            for (var x = 0; x < records.length; x++) {
                this.displayRecord(records[x], true);
            }
        },
        displayRecord: function(record, doLayout) {
            var mainPanel = Ext.getCmp(this.parentId);
            var container = mainPanel.items.itemAt(0);

            var cnt = 0;

            record.fields.eachKey(function(key, item) {
                var t = new Text(key, record.data[key]);

                var isHidden = this.isHiddenField(key);

                if (!isHidden) {
                    if (cnt >= container.items.length) {
                        cnt = 0;
                    }

                    container.items.itemAt(cnt++).add(t);
                }

                this.columnMenu.add(new MenuCheckBox(this.parentId + key, key, !isHidden, null));
            }, this);

            Ext.getCmp(this.parentId + 'ColumnMenu').menu = this.columnMenu;
            Ext.getCmp(this.parentId + 'ColumnMenu').menu.doLayout();

            if (typeof(doLayout) == 'boolean'
             && doLayout == true) {
                container.items.each(function(item, index, totalCount) {
                    item.doLayout();
                });
            }
        },
        isHiddenField: function(key) {
            for (var x = 0; x < this.cm.length; x++) {
                var cmObj = this.cm[x];
                if (cmObj.dataIndex == key) {
                    if (typeof(cmObj.hidden) == "boolean") {
                        return cmObj.hidden;
                    }
                }
            }
            return true;
        }
    };
}


