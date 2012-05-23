$(document).ready(function() {
    var ajaxManager = new AjaxManager();
    
    window.PersonModel = Backbone.Model.extend({ });

    window.PersonCollection = Backbone.PagedCollection.extend({
        model:         PersonModel,
        url:           $("#demoPersonTable").attr("data-endpoint"),
        batch:         true,
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
        { name: "phone"     },
        { name: "email"     }
    ];

    window.demoPersonTableView = new Backbone.DataGridView({
        el: $("#demoPersonTable"),
        collection: personCollection,
        editableColumns: editableColumns,
        aoColumnDefs: [
            { aTargets: ["biodem-firstName"], mDataProp: "firstName", sClass: "biodem-firstName", sType: "skip-ui-sort" },
            { aTargets: ["biodem-lastName"],  mDataProp: "lastName",  sClass: "biodem-lastName",  sType: "skip-ui-sort" },
            { aTargets: ["biodem-bannerId"],  mDataProp: "bannerId",  sClass: "biodem-bannerId",  sType: "skip-ui-sort" },
            { aTargets: ["biodem-phone"],     mDataProp: "phone",     sClass: "biodem-phone",     sType: "skip-ui-sort" },
            { aTargets: ["biodem-email"],     mDataProp: "email",     sClass: "biodem-email",     sType: "skip-ui-sort" }
        ],
        success: function(model, response) {
            this.reload();

            var models = { models: this.collection.filter(function(it) { return it.has("messages") != false }) };

            notifications.addNotificationsFromModel(models);
        },
        error: function(model, response) {
            // this callback is never invoked when batch is set to true on the collection
        }
    });

    demoPersonTableView.render();

    $(".demo-person-save-button").button().click(    function() { demoPersonTableView.save(); } );
    $(".demo-person-refresh-button").button().click( function() { demoPersonTableView.collection.fetch(); } );

});
