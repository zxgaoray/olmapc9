var userList = null;

$(function() {
    if (!userList) {
        $("body").append('<div id="myUserList"></div>');
        $("body").append('<div id="myUserInfo" style="position:absolute;left:300px;top:10px;width:300px;"></div>');
        userList = new List('#myUserList');
        userList.init(function(){
            userList.setDataSource(testData());
            userList.render();
            userList.addListener();
        });
    }
    
    function testData() {
        var list = [];
        for (var i=0; i < 20; i++) {
            var user = {
                id : 'id_' + i
                , name : 'Chris_' + i
                , email : 'Chris_' + i + '@sina.com'
                , address : 'Zhejiang Province'
                , declare : 'Chris ' + i
            }
            
            list.push(user);
        }
        
        return list;
    }
})

var List = function(el) {
    this.dataSource = [];
    this.el = el;
}

List.prototype = {
    init:function(callback){
        this._fetchTemplate(callback);
    }
    , render : function() {
        $(this.el).html(this.template({
            users : this.dataSource
            
        }));
    }
    , setDataSource : function(arr) {
        this.dataSource = arr;
    }
    , addListener : function() {
        var self = this;
        $('.user-list-item').click(function(e){
            var userId = $(this).attr('data');
            var user = self._findeById(userId);
            if (!user) return;
            self._showUserInfo(user);
        })
    }
    , _findeById : function(id) {
        for (var i=0; i < this.dataSource.length; i++) {
            var user = this.dataSource[i];
            if (user.id === id) {
                return user;
            }
        }
    }
    , _showUserInfo : function(user){
        require(['mixture/amd/UserView'],
        function(UserView){
            var userView = new UserView({
                el : '#myUserInfo'
            });
            userView.setUser(user);
            userView.render();
        })
    }
    , _fetchTemplate : function(callback) {
        var self = this;
        $.ajax({
            url : '/test/mixture/userlist.ejs'
            , type : 'get'
            , success : function(txt) {
                self.template = _.template(txt);
                callback();
            }
        })
    }
}