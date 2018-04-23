Ext.example = function () {
    var msgCt;

    function createBox(t, s) {
        return ['<div class="msg">', '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>', '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>', '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>', '</div>'].join('');
    }
    return {
        msg: function (title, format) {
            if (!msgCt) {
                msgCt = Ext.DomHelper.insertFirst(window.parent.document.getElementById('toppanel'), {
                    id: 'msg-div'
                }, true);
            }
            msgCt.alignTo(window.parent.document.getElementById('toppanel'), 't-t');
            var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, {
                html: createBox(title, s)
            }, true);
            m.slideIn('t').pause(2).ghost("t", {
                remove: true
            });
        },
        init: function () {}
    };
}();

var p_ajax = function(p_url,p_params,p_success){
	Ext.Ajax.request({
		url:p_url,
		method:'post',
		params:p_params,
		success:function(reponse){
			var re = Ext.decode(reponse.responseText);
			if(re.success)
				p_success();
			else
				{
				Ext.Msg.alert("错误",re.msg);
				}
		},
		failure:function(){
			Ext.Msg.alert("错误","服务器出错");
		}
		
	});
};
var p_print = function(printUrl){
    var newwin = window.open(printUrl, "_blank");
    newwin.document.location.reload();
    newwin.print();
    //newwin.close();
}