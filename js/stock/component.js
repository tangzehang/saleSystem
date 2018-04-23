var stock_head = ['产品序号','产品编码','产品名称','分类名','产品库存','可用库存','是否散装产品','整箱产品名称','散装数量'];   //库存的表头

var stock_index = [{name:'product_id'},{name:'product_code'},{name:'product_name'},{name:'product_catagoryname'},{name:'product_stock'},{name:'product_availablestock'},{name:'has_parent'},{name:'parent_name'},{name:'child_num'}];//库存的store名

var stock_width = [80,150,150,50,80,80,100,100,80];

var stock_sm = new Ext.grid.CheckboxSelectionModel();

var relation_url = '/stock/relation';

var stock_print = "/stock/print";

var stock_col = [stock_sm];

for(var i = 0;i < stock_head.length; i++)
{
	if(i == 6)
		{
	stock_col.push({
		header:stock_head[i],
		dataIndex:stock_index[i].name,
		sortable:(i != 3 && i != 7) ? true : false ,
		width:stock_width[i],
		editable:true,
		renderer:function(v){
				return has_parent[v];
		}
	})
		}
    else
		{
		stock_col.push({
			header:stock_head[i],
			dataIndex:stock_index[i].name,
			sortable:(i != 3 && i != 7) ? true : false ,
			width:stock_width[i],
			editable:false
		})
		}
};

stock_col.push({
	xtype:'actioncolumn',
	header:'操作',
	width:250,
	items:[{
		icon:'../../images/delete.gif',
		tooltip:'清空散装状态',
		handler: clearsubproduct
		
	}]
});

var stock_tbar = 
	[{
		text:'进货单管理',
		iconCls:'plugin',
		id:'stockin_manage',
		handler:product_in_manage
	},
	{
		text:'盘点管理',
		iconCls:'plugin',
		id:'stockcheck_manage',
		handler:product_check_manage
	},
	{
		text:'关系管理',
		iconCls:'plugin',
		id:'relation_manage',
		handler:relation_manage
	},
		{
			text:'打印',
			iconCls:'printer',
			id:'print',
			disabled:false,
			handler:function(){
				var printUrl = stock_print;
				if(!(Ext.getCmp('stock_check_class').getValue() == "") && !(Ext.getCmp('stock_key').getValue() == ""))
				{
					printUrl = printUrl + '?check_class='+Ext.getCmp('stock_check_class').getValue()+'&key='+Ext.getCmp('stock_key').getValue();
				}
				p_print(printUrl);
			}
		},
	'->',
	'搜索方式:',
	{
		xtype:'combo',
		id:'stock_check_class',
		width:150,
		emptyText:'请选择搜索方式',
		store:stock_check_store,
		displayField:'name',
		valueField:'class_name',
		mode:'local',
		triggerAction:'all',
		editable:false
	},
	'关键字:',
	{
		xtype:'textfield',
		id:'stock_key',
		width:100,
		emptyText:'请输入信息',
		listeners:{
			specialkey:function(f,key){
				if(key.getKey() == key.ENTER){
					stock_search();
				}
			}
		}
	},
	{
		text:'确认',
		iconCls:'search',
		handler:stock_search
	}];

var relation_form = new Ext.form.FormPanel({
	labelAlign:'right',
	id:'relation_form',
	method:'post',
	url:relation_url,
	width:300,
	defaults:{
		width:150
	},
	items:[
	       {
	    	   xtype:'textfield',
	    	   fieldLabel:'整装产品编码',
	    	   id:'parent_code',
	    	   emptyText:'请输入/扫描编码',
	    	   listeners:{
	    		   change:field_change,
	    		   specialkey:key_up
	    	   }
	       },	       
	       {
    		xtype:'combo',
    		fieldLabel:'整装产品名称',
    		name:'',
    		store:name_store,
    		id:'parent_product',
    		allowBlank:false,
    		emptyText:'请选择产品名称',
    		displayField:'name_name',	
    		valueField:'name_code',
    		mode:'local',
    		hiddenName:'parent_name',
    		forceSelection:true,
    		triggerAction:'query',
    		listeners:{
    			select:function(a,b,c){
    				Ext.getCmp('parent_code').setValue(b.id);
    			}
    		}
    	},
    	{
	    	   xtype:'textfield',
	    	   fieldLabel:'散装产品编码',
	    	   emptyText:'请输入/扫描编码',
	    	   id:'child_code',
	    	   listeners:{
	    		   change:field_change,
	    		   specialkey:key_up
	    	   }
	       },
    	{
    		xtype:'combo',
    		fieldLabel:'散装产品名称',
    		name:'',
    		store:name_store,
    		id:'child_product',
    		allowBlank:false,
    		emptyText:'请选择产品名称',
    		displayField:'name_name',	
    		valueField:'name_code',
    		forceSelection:true,
    		mode:'local',
    		hiddenName:'child_name',
    		triggerAction:'query',
    		listeners:{
    			select:function(a,b,c){
    				Ext.getCmp('child_code').setValue(b.id);
    			}
    		}
    	},
    	{
    		xtype:'textfield',
    		fieldLabel:'散装数量',
    		id:'product_num',
    		allowBlank:false,
    		name:'product_num',
    		blankText:'不能为空',
    		emptyText:'请输入数量',
    		listeners:{
	    		   specialkey:key_up
	    	   }
    	}],
    	buttons:[
    	         {
    	        	 text:'提交',
    	        	 handler:submit
    	         },
    	         {
    	        	 text:'重置',
    	        	 handler:function(){
    	        		 this.ownerCt.ownerCt.getForm().reset();
    	        	 }
    	         }
    	]
});

var relation_win = new Ext.Window({
	frame:true,
	closeAction:'hide',
    autoWidth:true,
    autoHeight:true,
    title:"设置散装产品",
    modal:true,
    items:[relation_form]
});