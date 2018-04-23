var day_manage_items_url = "/acount/dayitem";

var day_manage_table_url = "/acount/daytable";

var day_manage_items_store_index = [{name:'table_item_id'},{name:'product_name'},{name:'product_num'},{name:'product_sell_price',type:'float'},{name:'product_in_price',type:'float'}];

var day_manage_store_index = [{name:'table_id'},{name:'create_time'},{name:'status',type:'boolean'},{name:'confirm_time'},{name:'total_sell_price',type:'float'},{name:'total_income_price',type:'float'},{name:'total_profit',type:'float'}];


var day_manage_items_store = new Ext.data.Store({   //获取售货单所有子项的store;
	reader:new 
	Ext.data.JsonReader({
		id:'table_item_id',
		root:'data',
		totalProperty:'count'
	},day_manage_items_store_index),
	remoteSort: true,
	url:day_manage_items_url,
	pruneModifiedRecords:true,
	autoLoad:false
});

var day_manage_table_store = new Ext.data.Store({   //获取所有售货单的store;
	reader:new Ext.data.JsonReader({
		id:'table_id',
		root:'data',
		totalProperty:'count'
	},day_manage_store_index),
	remoteSort: true,
	pruneModifiedRecords:true,
	url:day_manage_table_url,
	autoLoad:true
});

var table_check_data = [['1','create_time','创建日期'],['2','confirm_time','确认日期']];//搜索的data

var table_check_store = new Ext.data.SimpleStore({  //搜索的store
	fields:['id','class_name','name'],
	data:table_check_data
});