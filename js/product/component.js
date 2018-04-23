var head = ['产品序号','产品编码/条码','产品名称','产品类别','产品单位','产品规格','最新进货价','平均进货价','产品销售价'];
//编辑界面的头部
var index = [{name:'product_id'},{name:'product_code'},{name:'product_name'},{name:'product_catagory'},{name:'product_unit'},{name:'product_standard'},{name:'product_lastinprice',type:'float'},{name:'product_avinprice',type:'float'},{name:'product_exprice',type:'float'}];
//编辑界面的STORE..store.js里面有一份一样的。修改的时候同时修改
var width = [100,180,180,80,70,150,120,120,120];//表头宽度

var catagory_head = ['序号','名称'];

var catagory_index = [{name:'id'},{name:'name'}]; //类别的store头

var product_save = '/product/save';//产品保存地址

var product_del = '/product/remove';//产品删除地址

var catagory_del = '/catagory/remove';//类别删除地址

var product_print = '/product/print';

var sm = new Ext.grid.CheckboxSelectionModel();//选择模式

var sm1 = new Ext.grid.CheckboxSelectionModel();//选择模式

var col = [sm];  //产品表头的数组

var catagory_col = [sm1];   //类别表头数组

var catagory_tbar = [{   //类别的上面按钮栏
    text:'新增',
    iconCls:'add',
    id:'catagory_add',
    handler:catagory_addwin_show
		},
		{
			text:'删除',
			iconCls:'remove',
			id:'catagory_remove',
			handler:delrecord
			
		}];

catagory_col.push({       //类别的表头
			header:catagory_head[0],
			dataIndex:catagory_index[0].name,
			sortable:true, 
			width:50
		});
catagory_col.push({
	header:catagory_head[1],
	dataIndex:catagory_index[1].name,
	sortable:true, 
	width:100
});

var catagorygrid = new Ext.grid.GridPanel({   //类别的显示grid
	frame:true,
	id:'catagorygrid',
	store:catagory_store,
	sm:sm1,
	autoWidth:true,
	height:300,
	tbar:catagory_tbar,
	columns:catagory_col
});

var catagorywin = new Ext.Window({       //类别的显示window
	modal:true,
	frame:true,
	closeAction:'hide',
	width:200,
	height:300,
	items:[catagorygrid]
});


var tbar = [{
        text:'新增',
        iconCls:'add',
        id:'add',
        handler:addrecord
			},
			{
				text:'保存',
				iconCls:'option',
				id:'save',
				disabled:true,
				handler:saverecord
				
			},
			{
        text:'删除',
        iconCls:'remove',
        id:'remove',
        disabled:true,
        handler:delrecord
				},
	{
		text:'打印',
		iconCls:'printer',
		id:'print',
		disabled:false,
		handler:function(){
			var printUrl = product_print;
			if(!(Ext.getCmp('check_class').getValue() == "") && !(Ext.getCmp('key').getValue() == ""))
			{
				printUrl = printUrl + '?check_class='+Ext.getCmp('check_class').getValue()+'&key='+Ext.getCmp('key').getValue();
			}
			p_print(printUrl);
		}
	},
				{
					text:'分类管理',
					iconCls:'plugin',
					id:'catagorymanage',
					handler:managecatagory
				},
				'->',
				'搜索方式:',
				{
					xtype:'combo',
					id:'check_class',
					width:150,
					emptyText:'请选择搜索方式',
					store:check_store,
					displayField:'name',
					valueField:'class_name',
					mode:'local',
					triggerAction:'all',
					editable:false
				},
				'关键字:',
				{
					xtype:'textfield',
					id:'key',
					name:'key',
					emptyText:'请输入关键字',
					listeners:{
						specialkey:function(f,key){
							if(key.getKey() == key.ENTER){
								search();
							}
						}
					}
				},
				{
					text:'确认',
					iconCls:'search',
					id:'search',
					handler:search
				}];




var editor = [
      new Ext.form.TextField({
    editable:false,
	emptyText:'请输入序号',
    width:150,
    readOnly:true,
    allowBlank:false,
    blankText:'不能为空'

    }),
    new Ext.form.TextField({
	emptyText:'请输入产品编码',
    width:150,
    allowBlank:false,
    blankText:'不能为空'
    }),
     new Ext.form.TextField({
 	emptyText:'请输入产品名称',
    width:150,
    allowBlank:false,
    blankText:'不能为空'
 }),
     new Ext.form.ComboBox({
	 editable:false,
     store:catagory_store,
     mode:'local',
     displayField:'name',
     valueField:'id',
     allowBlank:false,
     blankText:'不能为空',
     shadow:true,
     triggerAction:'all' 
}),
    new Ext.form.TextField({
 	emptyText:'请输入单位',
    width:150,
    allowBlank:false,
    blankText:'不能为空'
 }), 
   new Ext.form.TextField({
 	emptyText:'请输入规格',
    width:150,
    allowBlank:false,
    blankText:'不能为空'
 }),
   new Ext.form.NumberField({
	 allowDecimals:true,
	 decimalPrecision:2//小数点后位数
	 }),
   new Ext.form.NumberField({
		 allowDecimals:true,
		 decimalPrecision:2//小数点后位数
		 }),
		 new Ext.form.NumberField({
			 allowDecimals:true,
			 decimalPrecision:2//小数点后位数
			 })];

for(var i = 0;i < head.length; i++)
	{
	if(index[i].name == 'product_catagory')
	{
	//catagory_store.load();
	col.push({
		header:head[i],
		dataIndex:index[i].name,
		sortable:(i > 5 || i < 2) ? true : false ,
		width:width[i],
		editable:(index[i] == 'product_id') ? false : true,
		editor:editor[i],
		renderer:function(v){
			var name = "未知产品";
			//catagory_store.load();
			var record = catagory_store.getById(v);
			if(record)
				name = record.get('name');
			return name;
		}
	})
	}
	else
		{
		col.push({
			header:head[i],
			dataIndex:index[i].name,
			sortable:(i > 5 || i < 2) ? true : false ,
			width:width[i],
			editable:(index[i] == 'product_id') ? false : true,
			editor:editor[i]
		})
		}
	}
