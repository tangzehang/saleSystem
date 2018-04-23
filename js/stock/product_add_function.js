var static_record;
var static_editor;

var catagory_addwin_show = function(){
	catagory_addwin.show();
	Ext.getCmp('catagory_addname').focus(true,500);
}

var addrecord = function(){    //新增按钮的实现函数
	addwin.show();
	Ext.getCmp('product_code').focus(true,500);
}

var new_submit = function(but){
	if(Ext.getCmp('addform').getForm().isValid())
	{
    Ext.getCmp('addform').getForm().submit({
    	success:function(form,record){
    		  var re = Ext.decode(record.response.responseText);
    		  Ext.example.msg("成功","插入成功");
    		  form.reset();
    		  if(but.ownerCt.ownerCt.getId() == "addform")
    			  {
    			   name_store.reload();
    			  	addwin.hide();
					product_in_items_panel.startEditing(static_record.row,static_record.col);
					
    			  }
    		  if(but.ownerCt.ownerCt.getId() == "catagory_addform")
    			  {
    			  catagory_addwin.hide();
    			  catagory_store.reload();
    			  }
    		  
    	  },
    	  failure:function(form,record){
    		  var re = Ext.decode(record.response.responseText);
    		  Ext.Msg.alert('错误',re.msg);
      }
    });
	}
	else
		{
		Ext.Msg.alert("表单错误","请正确输入");
		}
}


