var has_parent = ['不是','是'];

var stock_url = '/stock/getlist';//获取库存数据的URL地址

var product_in_table_url = "/product_in/gettable";//获取进货单的url

var product_in_items_url = "/product_in/getitems";//获取进货单子项的url

var product_check_table_url = "/product_check/gettable";//获取盘点单的url

var product_check_items_url = "/product_check/getitems";//获取盘点单子项的url

var catagory_url = '/catagory/getlist';//类别的获取地址

var stock_index = [{name:'product_id'},{name:'product_code'},{name:'product_name'},{name:'product_catagoryname'},{name:'product_stock'},{name:'product_availablestock'},{name:'has_parent'},{name:'parent_name'},{name:'child_num'}];//库存的store名

var product_in_index = [{name:'table_id'},{name:'create_time'},{name:'confirm_time'},{name:'total_price',type:"float"},{name:'status',type:'boolean'},{name:'remark'}];
//进货单的头部
var product_in_items_index = [{name:'table_item_id'},{name:'table_item_code'},{name:'table_item_name'},{name:'table_item_catagoryname'},{name:'table_item_num',type:'float'},{name:'table_item_price',type:'float'},{name:'table_item_pstatus',type:'boolean'},{name:'table_item_remark',type:'string'}];
//进货单子项的头部
var product_check_index = [{name:'table_id'},{name:'create_time'},{name:'confirm_time'},{name:'status',type:'boolean'},{name:'remark',type:'string'}];
//盘点单的头部
var product_check_items_index = [{name:'table_item_id'},{name:'table_item_code'},{name:'table_item_name'},{name:'table_item_catagoryname'},{name:'table_item_num',type:'float'},{name:'table_item_checknum',type:'float'},{name:'table_item_pstatus',type:'boolean'},{name:'table_item_remark',type:'string'}];
//盘点单子项的头部
var catagory_index = [{name:'id'},{name:'name'}]; //类别的store头

var catagory_store = new Ext.data.Store({   //获取分类的product。为了可以在combo里面选择
	reader:new Ext.data.JsonReader({
		id:'id',
		root:'data',
		totalProperty:'count'
	},catagory_index),
	remoteSort: true,
	url:catagory_url,
	autoLoad:true,
	listeners:{
		load:function(){
			var record = new Ext.data.Record({id:-1,name:"全部"});
			catagory_store.add(record);
		}
	}
});



var stock_store = new Ext.data.Store({   //获取库存的store;
	reader:new Ext.data.JsonReader({
		id:'id',
		root:'data',
		totalProperty:'count'
	},stock_index),
	remoteSort: true,
	url:stock_url,
	autoLoad:true
});

var product_in_items_store = new Ext.data.Store({   //获取进货单所有子项的store;
	reader:new Ext.data.JsonReader({
		id:'table_item_id',
		root:'data',
		totalProperty:'count'
	},product_in_items_index),
	remoteSort: true,
	url:product_in_items_url,
	pruneModifiedRecords:true,
	autoLoad:false,
	listeners:{
		'beforeload':product_in_items_store_beforeload
	}
});

var product_in_table_store = new Ext.data.Store({   //获取所有进货单的store;
	reader:new Ext.data.JsonReader({
		id:'table_id',
		root:'data',
		totalProperty:'count'
	},product_in_index),
	remoteSort: true,
	pruneModifiedRecords:true,
	url:product_in_table_url,
	autoLoad:true,
	listeners:{
		'beforeload':product_in_table_store_beforeload
	}
});

var product_check_table_store = new Ext.data.Store({   //获取盘点单的store;
	reader:new Ext.data.JsonReader({
		id:'table_id',
		root:'data',
		totalProperty:'count'
	},product_check_index),
	remoteSort: true,
	pruneModifiedRecords:true,
	url:product_check_table_url,
	autoLoad:true,
	listeners:{
		'beforeload':product_check_table_store_beforeload
	}
});

var product_check_items_store = new Ext.data.Store({   //获取盘点单子项的store;
	reader:new Ext.data.JsonReader({
		id:'table_item_id',
		root:'data',
		totalProperty:'count'
	},product_check_items_index),
	remoteSort: true,
	pruneModifiedRecords:true,
	url:product_check_items_url,
	autoLoad:false,
	listeners:{
		'beforeload':product_check_items_store_beforeload
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

var stock_check_data = [['1','product_code','产品编码'],['2','product_name','产品名称'],['3','product_catagoryname','分类']];//搜索的data

var stock_check_store = new Ext.data.SimpleStore({  //搜索的store
	fields:['id','class_name','name'],
	data:stock_check_data
});