define('mixture/amd/UserView',
[
    'jquery'
    , 'underscore'
    , 'backbone'
    , 'text!mixture/amd/UserView.ejs'
],
function($, _, Backbone, tmpl) {
    
    var View = Backbone.View.extend({
        initialize : function(){
            this.template = _.template(tmpl);
        }
        , render : function() {
            $(this.el).html(this.template({
                fields :[
                    {
                        fieldName : 'name'
                        , fieldAlias : 'Name:'
                    }
                    , {
                        fieldName : 'declare'
                        , fieldAlias : 'Declare:'
                    }
                    , {
                        fieldName : 'email'
                        , fieldAlias : 'Email:'
                    }
                    , {
                        fieldName : 'address'
                        , fieldAlias : 'Address:'
                    }
                ]
                , user : this.userInfo
            }))
        }
        , setUser : function(user) {
            this.userInfo = user;
        }
    })
    
    return View;
})