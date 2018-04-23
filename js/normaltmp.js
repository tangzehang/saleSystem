var saverecord = function(){
	var re = product_store.modified;
	if(re.length>0)
		{
		var data = [];
		Ext.each(product_store.modified,function(e){
			data.push(e.data);
		})
		Ext.Ajax.request({
			url:'/product/save',
			method:'post',
			params:{
				data:Ext.encode(data)
			},
			success:function(response,re){
				var re = Ext.decode(response.responseText)
				if(re.success)
					{
					store.reload();
					}
				else
					{
					Ext.Msg.alert("出错","请检查数据");
					}
		
			},
			failure:function(response,re){
				Ext.Msg.alert("出错","服务器出错");
			}
			
		})
		}
}