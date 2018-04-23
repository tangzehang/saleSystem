var name_url = '/stock/getname';//获取名字的url，combo用的

var name_index = [{name:'name_code'},{name:'name_name'},{name:'name_catagoryname'},{name:'name_stocknum'},{name:'name_standard'},{name:'name_sellprice'}];//combo的数据名

var name_store = new Ext.data.Store({
	reader:new Ext.data.JsonReader({
		id:'name_code',
		root:'data',
		totalProperty:'count'
	},name_index),
	remoteSort:false,
	url:name_url,
	autoLoad:true
});
