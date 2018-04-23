/*
 * 新增产品界面的所有操作，可能其他界面要用到这些功能。
 */

var product_add = '/product/add';//产品增加地址

var catagory_add = '/catagory/add';//类别增加地址

var addwin = new Ext.Window({     //新增弹出的窗口
	modal:true,
	frame:true,
	closeAction:'hide',
    autoWidth:true,
    autoHeight:true,
    items:[new Ext.form.FormPanel({
    	labelAlign:'right',
    	id:'addform',
    	method:'post',
    	url:product_add,
    	frame:true,
    	width:300,
    	defaults:{
    		width:150
    		},
    	items:[
      {
    		xtype:'textfield',
    		fieldLabel:'产品编码/条码',
    		name:'product_code',
    		id:'product_code',
    		allowBlank:false,
    		blankText:'清输入编码/条码',
    		emptyText:'清输入编码/条码',
    		listeners:{
    			specialkey:function(f,key){
    				if(key.getKey() == key.ENTER){
    					Ext.getCmp('product_name').focus(true);
    				}
    			}
    		}
    	},
    	{
    		xtype:'textfield',
    		fieldLabel:'产品名称',
    		name:'product_name',
    		id:'product_name',
    		allowBlank:false,
    		blankText:'请输入名称',
    		emptyText:'请输入名称',
    		listeners:{
    			specialkey:function(f,key){
    				if(key.getKey() == key.ENTER){
    					Ext.getCmp('product_catagory').focus();
    					Ext.getCmp('product_catagory').expand();
    				}
    			}
    		}
    	},
    	{
    		xtype:'combo',
    		fieldLabel:'分类<a href="#" onclick="catagory_addwin.show();Ext.getCmp(\'catagory_addname\').focus(true,500);;return false;" >(新增分类)</a>',
    		name:'product_catagory',
    		store:catagory_store,
    		id:'product_catagory',
    		allowBlank:false,
    		emptyText:'请选择分类',
    		displayField:'name',	
    		valueField:'id',
    		mode:'local',
    		hiddenName:'product_catagoryid',
    		editable:false,
    		triggerAction:'all',
    		listeners:{
    			select:function(){
    				Ext.getCmp('product_unit').focus(true,10);
    				return ;
    			}
    		}
    	},
    	{
    		xtype:'textfield',
    		fieldLabel:'产品单位',
    		name:'product_unit',
    		id:'product_unit',
    		allowBlank:false,
    		blankText:'请输入单位',
    		emptyText:'请输入单位',
    		listeners:{
    			specialkey:function(f,key){
    				if(key.getKey() == key.ENTER){
    					Ext.getCmp('product_standard').focus(true);
    				}
    			}
    		}
    	},
    	{
    		xtype:'textfield',
    		fieldLabel:'产品规格',
    		name:'product_standard',
    		id:'product_standard',
    		//allowBlank:false,
    		blankText:'请输入规格',
    		emptyText:'请输入规格',
    		listeners:{
    			specialkey:function(f,key){
    				if(key.getKey() == key.ENTER){
    					Ext.getCmp('product_inprice').focus(true);
    				}
    			}
    		}
    	},
    	{
    		xtype:'numberfield',
    		fieldLabel:'进货价',
    		name:'product_inprice',
    		id:'product_inprice',
    		allowBlank:false,
    		value:0,
    		decimalPrecision:2,
    		allowNegative:false,
    		blankText:'请输入进货价',
    		emptyText:'请输入进货价',
    		listeners:{
    			specialkey:function(f,key){
    				if(key.getKey() == key.ENTER){
    					Ext.getCmp('product_exprice').focus(true);
    				}
    			}
    		}
    	},
    	{
    		xtype:'numberfield',
    		decimalPrecision:2,
    		fieldLabel:'销售价',
    		allowNegative:false,
    		name:'product_exprice',
    		id:'product_exprice',
    		allowBlank:false,
    		value:0,
    		blankText:'请输入销售价',
    		emptyText:'请输入收货价',
    		listeners:{
    			specialkey:function(f,key){
    				if(key.getKey() == key.ENTER){
    					new_submit(this);
    				}
    			}
    		}
    	}
    	],
    	buttons:[{
    		text:'添加',
    		handler:function(){
				new_submit(this.ownerCt);
			}
    	},
    	{
    		text:'重置',
    		handler:function(){
    			this.ownerCt.ownerCt.getForm().reset();
    		}
    	}]
    })]
});



var catagory_addwin = new Ext.Window({   //增加类别的window
	modal:true,
	frame:true,
	closeAction:'hide',
	autoWidth:true,
	autoHeight:true,
	items:[new Ext.form.FormPanel({
		labelAlign:'right',
		id:'catagory_addform',
		method:'post',
		url:catagory_add,
		width:300,
		defaults:{
			width:150
		},
		items:[{
		xtype:'textfield',
		fieldLabel:'名称',
		name:'catagory_addname',
		id:'catagory_addname',
		emptyText:'请输入新的类名',
		blankText:'不能为空',
		allowBlank:false,
		listeners:{
			specialkey:function(f,key){
				if(key.getKey() == key.ENTER)
					new_submit(this);
			}
		}
		}],
		buttons:[{
    		text:'添加',
    		handler:function(){
				new_submit(this.ownerCt);
			}
    	},
    	{
    		text:'重置',
    		handler:function(){
    			this.ownerCt.ownerCt.getForm().reset();
    		}
    	}]		
	})]
});
