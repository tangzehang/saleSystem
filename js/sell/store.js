var sell_main_store_index = [{name:'product_code'},{name:'product_name'},{name:'product_catagory'},{name:'product_standard'},{name:'product_sellnum',type:'float'},{name:'product_sellprice',type:'float'},{name:'product_allprice',type:'float'},{name:'product_discount',type:'float'},{name:'remark'}];

var sell_manage_table_url = "/sell_manage/gettable";//获取售货单的url

var sell_manage_items_url = "/sell_manage/getitems";//获取售货单子项的url

var sell_manage_store_index = [{name:'table_id'},{name:'create_time'},{name:'confirm_time'},{name:'total_price',type:"float"},{name:'get_money',type:'float'},{name:'status',type:'boolean'},{name:'remark'},{name:'status',type:'int'}];
//售货单的头部
var sell_manage_items_store_index = [{name:'table_item_id'},{name:'table_item_code'},{name:'table_item_name'},{name:'table_item_catagoryname'},{name:'table_item_num',type:'float'},{name:'table_item_price',type:'float'},{name:'table_item_pstatus',type:'boolean'},{name:'table_item_discount',type:'float'},{name:'table_item_remark',type:'string'}];
//售货单子项的头部
var catagory_url = '/catagory/getlist';//类别的获取地址

var catagory_index = [{name:'id'},{name:'name'}]; //类别的store头

var catagory_store = new Ext.data.Store({   //获取分类的product。为了可以在combo里面选择
	reader:new Ext.data.JsonReader({
		id:'id',
		root:'data',
		totalProperty:'count'
	},catagory_index),
	remoteSort: true,
	url:catagory_url,
	autoLoad:true
});

var sell_main_store = new Ext.data.SimpleStore({
	field:sell_main_store_index
});

var sell_manage_items_store = new Ext.data.Store({   //获取售货单所有子项的store;
	reader:new Ext.data.JsonReader({
		id:'table_item_id',
		root:'data',
		totalProperty:'count'
	},sell_manage_items_store_index),
	remoteSort: true,
	url:sell_manage_items_url,
	pruneModifiedRecords:true,
	autoLoad:false,
	listeners:{
		'beforeload':sell_manage_items_store_beforeload
	}
});

var sell_manage_table_store = new Ext.data.Store({   //获取所有售货单的store;
	reader:new Ext.data.JsonReader({
		id:'table_id',
		root:'data',
		totalProperty:'count'
	},sell_manage_store_index),
	remoteSort: true,
	pruneModifiedRecords:true,
	url:sell_manage_table_url,
	autoLoad:true,
	listeners:{
		'beforeload':sell_manage_table_store_beforeload
	}
});

var table_check_data = [['1','create_time','创建日期'],['2','confirm_time','确认日期']];//搜索的data

var table_check_store = new Ext.data.SimpleStore({  //搜索的store
	fields:['id','class_name','name'],
	data:table_check_data
});

var items_check_data = [['1','table_item_code','产品编码'],['2','table_item_name','产品名称'],['3','table_item_catagoryname','分类']];//搜索的data

var items_check_store = new Ext.data.SimpleStore({  //搜索的store
	fields:['id','class_name','name'],
	data:items_check_data
});