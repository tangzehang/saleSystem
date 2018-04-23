var confirm_url = '/acount/confirm';

var day_manage_table_rowselect = function(a, index, record) {//日结算单行选择的函数
	day_manage_items_store.load({
		params:{table_id:record.data.table_id}
	});
	Ext.getCmp("day_manage_table_confirm").setDisabled(record.data.status);
	Ext.getCmp("day_manage_table_print").setDisabled(0);
};


var day_manage_table_add = function()
{	//日结算单的创建按钮函数
	var success = function()
	{
		day_manage_table_store.load();
	}
	var url = "/acount/daytableadd";
	var params = {};
	p_ajax(url,params,success);
}

var day_manage_table_confirm = function()// 日结算单的确认按钮函数
{
	var se = day_manage_table_sm.getSelected();
	if(se)
		{
			var id = se.data.table_id;
			var success = function(){
				Ext.getCmp("day_manage_table_confirm").setDisabled(1);
				day_manage_table_store.load();
			};
			var params = {
					'id':id
			};
			p_ajax(confirm_url,params,success);
		}
}

var day_manage_table_search = function()
{
	if ((Ext.getCmp('day_manage_table_check_class').getValue() == "")
			|| (Ext.getCmp('day_manage_table_key').getValue() == "")) {
		Ext.apply(day_manage_table_store.baseParams, {
			'check_class' : 'create_time',
			'key' : ''
		});
		day_manage_table_store.load();
	} else {
		Ext.apply(day_manage_table_store.baseParams, {
			'check_class' : Ext.getCmp('day_manage_table_check_class')
					.getValue(),
			'key' : Ext.getCmp('day_manage_table_key').getValue()
		});
		day_manage_table_store.load();
	}
}