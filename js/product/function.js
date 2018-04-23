/*
 * product里面所有需要的函数都在这个文件里面
 */


var managecatagory = function(){   //管理分类函数
	catagorywin.show(Ext.get('catagorymanage'));
}



var catagory_addwin_show = function(){
	catagory_addwin.show(Ext.get('catagory_add'));
	Ext.getCmp('catagory_addname').focus(true,500);
}

var addrecord = function(){    //新增按钮的实现函数
	addwin.show(Ext.get('add'));
	Ext.getCmp('product_code').focus(true,500);
}

var saverecord = function(){   //保存按钮的实现函数
	var re = product_store.modified;
	if(re.length>0)
		{
		var data = [];
		Ext.each(product_store.modified,function(e){
			data.push(e.data);
		})
		Ext.Ajax.request({
			url:product_save,
			method:'post',
			params:{
				data:Ext.encode(data)
			},
			success:function(response,re){
				var re = Ext.decode(response.responseText)
				if(re.success)
					{
					product_store.reload();
					}
				else
					{
					product_store.reload();
					Ext.Msg.alert("出错",re.msg);
					}
		
			},
			failure:function(response,re){
				Ext.Msg.alert("出错","服务器出错");
			}
			
		})
		}
}


var delrecord = function(but){     //删除按钮的实现函数
	var data = "(\"-1\"";
	var url = "";
	var store;
	if(but.getId() == "remove")
	{
	var select = Ext.getCmp('editgrid').getSelectionModel().getSelections();
	url = product_del;
	store = product_store;
	if(select.length>0)
		{
		Ext.each(select,function(e){
			data =data + ",\""+e.data.product_id+"\"";
		});
		}
	}
	if(but.getId() == "catagory_remove")
	{
	var select = Ext.getCmp('catagorygrid').getSelectionModel().getSelections();
	url = catagory_del;
	store = catagory_store;
	if(select.length>0)
		{
		Ext.each(select,function(e){
			data =data + ",\""+e.data.id+"\"";
		});
		}
	}
	data =data + ")";
	if(select.length > 0)
		{
		Ext.Msg.confirm('注意','确认要删除'+select.length+'条记录?',function(fn){
			if(fn == 'yes')
				{
				Ext.Ajax.request({
					url:url,
					method:'post',
					params:{
						data:data
					},
					success:function(response,re){
						var re = Ext.decode(response.responseText)
						if(re.success)
							{
							product_store.reload();
							catagory_store.reload();
							}
						else
							{
							Ext.Msg.alert("出错","未知错误");
							}
				
					},
					failure:function(response,re){
						Ext.Msg.alert("出错","服务器出错");
					}
					
				})
				}
		})
		}
	else
		{
		Ext.Msg.alert("错误","请选择一条记录");
		}
}


var new_submit = function(but){
	if(but.ownerCt.getForm().isValid())
	{
    but.ownerCt.getForm().submit({
    	success:function(form,record){
    		  var re = Ext.decode(record.response.responseText);
    		  Ext.example.msg("成功","插入成功");
    		  form.reset();
    		  if(but.ownerCt.getId() == "addform")
    			  {
    		  Ext.getCmp('product_code').focus(true);
    		  product_store.reload();
    			  }
    		  if(but.ownerCt.getId() == "catagory_addform")
    			  {
    			  Ext.getCmp('catagory_addname').focus(true);
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



var search = function(){
	if((Ext.getCmp('check_class').getValue() == "") || (Ext.getCmp('key').getValue() == ""))
	{
		Ext.apply(product_store.baseParams,
				{
			'check_class':'product_code',
			'key':''
				});
		product_store.load();
		}
	else
		{
		Ext.apply(product_store.baseParams,
				{
			'check_class':Ext.getCmp('check_class').getValue(),
			'key':Ext.getCmp('key').getValue()
				});
		product_store.load();
		}
}