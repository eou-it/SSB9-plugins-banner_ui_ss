Backbone.emulateHTTP = true;

Backbone.sync = function(method, model, options) {
    // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
    var methodMap = {
        'create': 'POST',
        'update': 'PUT',
        'delete': 'DELETE',
        'read'  : 'GET'
    };

    // Throw an error when a URL is needed, and none is supplied.
    var urlError = function() {
        throw new Error('A "url" property or function must be specified');
    };

    var getUrl = function(object) {
        if (!(object && object.url)) return null;
        return _.isFunction(object.url) ? object.url() : object.url;
    };

    var type = methodMap[method];

    // Default JSON-request options.
    var params = _.extend({
        type:         type,
        dataType:     'json',
        processData:  false
    }, options);

    // Ensure that we have a URL.
    if (!params.url) {
        params.url = getUrl(model) || urlError();
    }

    // This code is an 'enhancement' to Backbone where we will append query parameters on reads if a fetchCriteria
    // object exists.
    if (method === "read" && model) {
        // Check to see if the model contains fetch criteria
        if (model.fetchCriteria) {
            // Loop through the fetchCriteria and add query parameters to the url
            _.each(model.fetchCriteria(),
                function(value, key) {
                    if (params.url.indexOf("?") > 0) {
                        params.url = params.url + "&";
                    }
                    else {
                        params.url = params.url + "?";
                    }

                    params.url = params.url + key + "=" + value;
                }
            );
        }
    }

    // Ensure that we have the appropriate request data.
    if (!params.data && model && (method == 'create' || method == 'update')) {
        params.contentType = 'application/json';
        params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
        params.contentType = 'application/x-www-form-urlencoded';
        params.processData = true;
        params.data = params.data ? {model : params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
        if (type === 'PUT' || type === 'DELETE') {
            if (Backbone.emulateJSON) params.data._method = type;
            params.type = 'POST';
            params.beforeSend = function(xhr) {
                xhr.setRequestHeader('X-HTTP-Method-Override', type);
            };
        }
    }

    // Clear out all messages prior to syncing.
    if (model) {
        model.each(function(m) {
            if (m.has( "messages" )) {
                m.unset( "messages" );
            }
        });
    }

    // Make the request.
    return $.ajax(params);
};

_.extend(Backbone.Model.prototype, {
    isDirty: function() {
        return this._dirty;
    },
    resetDirty: function() {
        this._dirty = false;
    },
    makeDirty: function() {
        this._dirty = true;
    },
    _dirty: false
});


// Extend Backbone.Collection to include 'save' which will inspect all dirty models and attempt to save them.
_.extend(Backbone.Collection.prototype, {
    save: function(options) {
        options || (options = {});

        // Prior to talking to the service we are going to clear all messages and let the response tell us what
        // errors still exist.
        this.each( function( model ) {
            if (model.has( "messages" )) {
                model.unset( "messages", {silent: true} );
            }
        });

        if (this.batch) {
            var collection = this;

            var success = function(batch) {
                // The model that comes down is the batch that was sent up.
                // Loop through the model and update the collection.
                _.each((batch.data.create || []).concat(batch.data.update || []), function(updatedModel) {
                    var model = collection.get(updatedModel.id);
                    model.set(model.parse(updatedModel), options);

                    if (!model.has( "messages")) {
                        model.set( { messages: [{ message:"save successful", type:"success"}] } );
                        model.resetDirty();
                    }
                });

                _.each(batch.data.destroy, function(modelToDelete) {
                    var model = _.select(this.deletedModels, function(deletedModel) {
                        return deletedModel.id == modelToDelete.id;
                    });

                    if (model) {
                        collection.remove(model, options);
                    }
                });

                if (options.success) options.success(collection);
            };

            // TODO:  For now, we handle successes and errors the same.
            // Typically these are going to be system errors.  May need an error handler.
            var error = success;

            var batchModel = createBatchModel(this);

            var getBatchUrl = function(object) {
                if (!(object && object.url)) return null;
                var url = _.isFunction(object.url) ? object.url() : object.url;

                return url + "/batch";
            };


            // Setup the options to send to sync.  Note that the url is using the var getUrl from Backbone.
            saveCollectionOptions = {
                success: success,
                error: error,
                data: JSON.stringify(batchModel),
                url: getBatchUrl(this),
                contentType: 'application/json'
            };

            (this.sync || Backbone.sync)("create", null, saveCollectionOptions);
        }
        else {
            $.each(this.models, function(index, model) {
                if (model.isDirty()) {
                    model.save(null, {
                        success: function(model, response) {
                            model.resetDirty();

                            if (options.success) options.success(model);
                        },
                        error: function(model, response) {
                            var responseJson = $.parseJSON(response.responseText);
                            model.set({errors: responseJson.errors});

                            if (options.error) options.error(model);
                        }
                    });
                }
            });

            // TODO:  Do we need specific destory based success and error handlers?
            // TODO:  Determine what model is returned for a destroyed model.  All we send up is the id.
            if (this.containsMarkedAsDeleted()) {
                $.each(this.deletedModels, function(index, model) {
                    model.destroy({
                        success: function(model, response) {

                            // Remove from deletedModels
                            this.deletedModels = _.reject(this.deletedModels, function(markedAsDeletedModel) {
                                return markedAsDeletedModel.id === model.id;
                            });

                            if (options.success) options.success(model);
                        },
                        error: function(model, response) {
                            var responseJson = $.parseJSON(response.responseText);
                            model.set({errors: responseJson.errors});

                            if (options.error) options.error(model);
                        }
                    });
                });
            }
        }

        return this;
    },
    markAsDeleted: function(model) {
        this.remove(model, {silent:true});

        if (this.deletedModels === null) {
            deletedModels = [];
        }

        this.deletedModels.push(model);
    },
    deletedModels : null,
    containsMarkedAsDeleted: function() {
        return (this.deletedModels && this.deletedModels.length);
    },
    batch : false,
    isDirty: function() {
        return _.any(this.models, function(model) {
            return model.isDirty()
        }) || this.deletedModels;
    }
});

function createBatchModel(model) {
    if (model.isDirty()) {
        var changedModels = _.select(model.models, function(model) {
            return model.isDirty() && _.isUndefined(model.validate(model.attributes));
        });

        var createModels = _.select(changedModels, function(model) {
            return model.isNew();
        });

        var updateModels = _.select(changedModels, function(model) {
            return !model.isNew();
        });

        var deletedIdsList = [];
        if (model.deletedModels) {
            deletedIdsList = _.pluck(model.deletedModels, id);
        }

        return { create: createModels || [], update: updateModels || [], destroy: deletedIdsList };
    }
    else {
        return { create: [], update: [], destroy: [] };
    }
}

function createFetchOptions( collection, options ) {

    var getUrl = function(object) {
        if (!(object && object.url)) return null;
        return _.isFunction(object.url) ? object.url() : object.url;
    };

    var returnUrl = getUrl( collection );

    if (options.params) {
        // Loop through the params and add query parameters to the url
        _.each(options.params,
            function(value, key) {
                if (returnUrl.indexOf("?") > 0) {
                    returnUrl = returnUrl + "&";
                }
                else {
                    returnUrl = returnUrl + "?";
                }

                returnUrl = returnUrl + key + "=" + value;
            }
        );

        options.url = returnUrl;
    }

    return options;
}