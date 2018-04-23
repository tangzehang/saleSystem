/*
 * product的store处理文件。所有的store都在这个文件里面
 */

var index = [{name:'product_id'},{name:'product_code'},{name:'product_name'},{name:'product_catagory'},{name:'product_unit'},{name:'product_standard'},{name:'product_lastinprice',type:'float'},{name:'product_avinprice',type:'float'},{name:'product_exprice',type:'float'}];
//编辑界面的STORE...component.js有一份一样的，修改的时候两边同时修改

var catagory_index = [{name:'id'},{name:'name'}]; //类别的store头

var product_url = '/product/getproducts';//产品获取地址


var catagory_url = '/catagory/getlist';//类别的获取地址

var catagory_store = new Ext.data.Store({   //获取分类的product。为了可以在combo里面选择
	reader:new Ext.data.JsonReader({
		id:'id',
		root:'data',
		totalProperty:'count'
	},catagory_index),
	remoteSort: true,
	url:catagory_url,
	autoLoad:false
});
var product_store = new Ext.data.Store({        //获取所有产品的store
	reader:new Ext.data.JsonReader({
		id:'product_id',
		root:'data',
		totalProperty:'count'
	},index),
	remoteSort: true,
	url:product_url,
	autoLoad:true,
	listeners:{
		beforeload:function(){
			catagory_store.load();
			product_store.rejectChanges();
			if(Ext.get('save'))
			Ext.getCmp('save').setDisabled(true);
			if(Ext.get('remove'))
			Ext.getCmp('remove').setDisabled(true);
		}
	}
});



//catagory_store.load();


var check_data = [['1','product_code','产品编码/条码'],['2','product_name','产品名称'],['6','product_catagoryname','产品分类'],['3','product_avinprice','平均进货价'],['4','product_lastinprice','最新进货价'],['5','product_exprice','产品销售价']];//搜索的data

var check_store = new Ext.data.SimpleStore({  //搜索的store
	fields:['id','class_name','name'],
	data:check_data
});