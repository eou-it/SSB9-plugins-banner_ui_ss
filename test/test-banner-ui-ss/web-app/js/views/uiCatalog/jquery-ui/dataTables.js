$(document).ready(function() {
    var ajaxManager = new AjaxManager();
    
    window.PersonModel = Backbone.Model.extend({ });

    window.PersonCollection = Backbone.PagedCollection.extend({
        model:         PersonModel,
        url:           $("#demoPersonTable").attr("data-endpoint"),
        batch:         true,
        paginate:      true,
        pageMaxSize:   5,
        sortColumn:    "lastName",
        sortDirection: "asc",
        ajaxCallback:  function( params ) {
            return ajaxManager.create( "BioDem", { abortOld: true } ).add( params );
        }
    });

    window.personCollection = new PersonCollection;
    personCollection.fetch();

    //
    // DataTables
    //

    var editableColumns = [
        { name: "firstName" },
        { name: "lastName"  },
        { name: "birthDate" },
        { name: "phone"     },
        { name: "email"     }
    ];

    window.demoPersonTableView = new Backbone.DataGridView({
        el:         $("#demoPersonTable"),
        collection: personCollection,
        columns: [
            { aTargets: ["biodem-firstName"], mDataProp: "firstName", sClass: "biodem-firstName", sType: "skip-ui-sort" },
            { aTargets: ["biodem-lastName"],  mDataProp: "lastName",  sClass: "biodem-lastName",  sType: "skip-ui-sort" },
            { aTargets: ["biodem-bannerId"],  mDataProp: "bannerId",  sClass: "biodem-bannerId",  sType: "skip-ui-sort" },
            { aTargets: ["biodem-birthDate"], mDataProp: "birthDate", sClass: "biodem-birthDate", sType: "skip-ui-sort" },
            { aTargets: ["biodem-phone"],     mDataProp: "phone",     sClass: "biodem-phone",     sType: "skip-ui-sort" },
            { aTargets: ["biodem-email"],     mDataProp: "email",     sClass: "biodem-email",     sType: "skip-ui-sort" }
        ],
        editableColumns : editableColumns
    });

    demoPersonTableView.render();
});
