var product_check_head = ["创建日期","确认日期","备注"];

var product_check_index = [{name:'create_time'},{name:'confirm_time'},{name:'remark'}];

var product_check_items_head = ["产品编号","产品名称","分类","应有数量","盘点数量","备注"];

var product_check_items_index = [{name:'table_item_code'},{name:'table_item_name'},{name:'table_item_catagoryname'},{name:'table_item_num'},{name:'table_item_checknum'},{name:'table_item_remark'}];

var product_check_table_sm = new Ext.grid.RowSelectionModel({singleSelect:true,
	onEditorKey:function(field,e){},
	listeners:{
		'rowselect':product_check_table_rowselect
	}});

var product_check_items_sm = new Ext.grid.RowSelectionModel({
	singleSelect:true,
	onEditorKey:function(field,e){
		var k = e.getKey(), newCell, g = this.grid, last = g.lastEdit, ed = g.activeEditor, shift = e.shiftKey, ae, last, r, c;  
		if (k == e.TAB) {
			e.stopEvent();
			ed.completeEdit();
			if (shift) {
				newCell = g.walkCells(ed.row, ed.col - 1, -1, this.acceptsNav,
						this);
						} else {
							newCell = g.walkCells(ed.row, ed.col + 1, 1, this.acceptsNav,
									this);
						}
		} 
		if (newCell) {
			r = newCell[0];
			c = newCell[1];
			this.onEditorSelect(r, last.row);
			if (g.isEditor && g.editing) { // *** handle tabbing while
				// editorgrid is in edit mode
				ae = g.activeEditor;
				if (ae && ae.field.triggerBlur) {
					// *** if activeEditor is a TriggerField, explicitly call
					// its triggerBlur() method
					ae.field.triggerBlur();
				}
			}
			g.startEditing(r, c);
		}
		
		}});

var product_check_table_col = [new Ext.grid.RowNumberer()];

var product_check_items_col = [new Ext.grid.RowNumberer()];

var product_check_table_width =[150,150,130];

var product_check_items_width =[100,100,70,100,100,110];

var product_check_items_editor = [
new Ext.form.TextField({
	emptyText:'请输入编号',
    allowBlank:false,
    blankText:'不能为空',
    listeners:{
    	Specialkey:function(a,b){
    		if(b.getKey() == b.ENTER)
    			{
					var text = a.getValue();
					if(text == "")
					{
						product_check_table_confirm();
					}
    			}
    			
    	},
    	change:function(a,b){
    		var se = a.gridEditor;
    		static_record = se;
    		static_editor = a;
    		var re = name_store.getById(b);
    		var store = se.record.store;
    		var index = store.indexOf(se.record);
    		var is_exist = store.findBy(function(e){ return (e.data.table_item_code == b && store.indexOf(e) != index);});
    		if(re && is_exist == -1)
			{
			se.record.set("table_item_name",re.data.name_name);
			se.record.set("table_item_catagoryname",re.data.name_catagoryname);
			se.record.set("table_item_num",re.data.name_stocknum);
				product_check_items_panel.startEditing(se.row,se.col+4);
			}
		else if(is_exist != -1)
			{
			Ext.Msg.alert("错误","此编号的产品已经在盘点单中",function(){
				se.record.reject();
				a.reset();
				product_check_items_panel.startEditing(se.row,se.col);
				},this);
			}
		else
			{
			static_record.record.reject();
			static_editor.reset();
			Ext.Msg.confirm("错误","无此编号的产品,是否添加产品？",function(btn){
				if(btn == "yes")
					addrecord();
				else
					{
					product_in_items_panel.startEditing(se.row,se.col);
					}
			},this);
			}
    	}
    }
    }),
    new Ext.form.ComboBox({
    	store:name_store,
    	emptyText:'请选择产品名称',
        allowBlank:false,
        blankText:'不能为空',
		displayField:'name_name',
		valueField:'name_name',
		mode:'local',
		forceSelection:true,
		triggerAction:'query',
		listeners:{
			select:function(a,b,c){
				var se = a.gridEditor;
				se.record.set("table_item_code",b.id);
				se.record.set("table_item_catagoryname",b.data.name_catagoryname);
				se.record.set("table_item_num",b.data.name_stocknum);
				product_check_items_panel.startEditing(se.row,se.col+3);
			}
		}
        }),
        {
		editable:false,
		readOnly:true
        },
        {
    		editable:false,
    		readOnly:true
        }
        ,
       	new Ext.form.NumberField({
       	 allowDecimals:true,
       	 allowBlank:false,
       	 allowNegative:false,
       	 decimalPrecision:2,//小数点后位数
       	listeners:{
        	specialkey:function(a,b){
        		if(b.getKey() == b.ENTER)
        			{
        				var se = a.gridEditor;
        				product_check_items_panel.startEditing(se.row,se.col+1);
        			}
        			
        	}
        }
       	 }),
       	new Ext.form.TextField({
       		emptyText:'备注',
       		listeners:{
       	    	specialkey:function(a,b){
       	    		if(b.getKey() == b.ENTER)
       	    			{
       	    			a.blur();
       	    			var se = a.gridEditor;
   	    				if(!check_record(se.record,1))
   	    					{
   	    					se.record.reject();
   	    					product_check_items_panel.startEditing(se.row,1);
   	    					}
   	    				else
   	    					{
   	    					if(is_newcheckorder)
   	    						{
   	    						product_check_items_add();
   	    						}
   	    					}
       	    			}
       	    			
       	    	}
       	    }
       	    })];


for(var i = 0;i < product_check_head.length; i++)
{

		product_check_table_col.push({
			header:product_check_head[i],
			dataIndex:product_check_index[i].name,
			sortable:(i != 2 || i != 5) ? true : false ,
			width:product_check_table_width[i]
		})
		
};

for(var i = 0;i < product_check_items_head.length; i++)
{

		product_check_items_col.push({
			header:product_check_items_head[i],
			dataIndex:product_check_items_index[i].name,
			sortable:(i < 4) ? true : false ,
			width:product_check_items_width[i],
			editable:false,
			editor:product_check_items_editor[i],
			renderer:function(v,i,r){
				if(!r.data.table_item_pstatus)
					return "<font color = 'red'>"+v+"</font>";
				else
					return v;
			}
		})
		
};

var product_check_table_tbar = 
	[{
		text:'添加',
		iconCls:'add',
		id:'product_check_table_add',
		handler:product_check_table_add
	},
	{
		text:'确认',
		iconCls:'option',
		id:'product_check_table_confirm',
		disabled:true,
		handler:product_check_table_confirm
	},
	{
		text:'删除',
		iconCls:'remove',
		id:'product_check_table_del',
		disabled:true,
		handler:product_check_table_del
	},
	'->',
	'搜索方式:',
	{
		xtype:'combo',
		id:'product_check_table_check_class',
		width:80,
		emptyText:'选择方式',
		store:table_check_store,
		displayField:'name',
		valueField:'class_name',
		mode:'local',
		triggerAction:'all',
		editable:false
	},
	{
		xtype:'textfield',
		inputType:'date',
		id:'product_check_table_key',
		width:180,
		//emptyText:'请输入信息',
		listeners:{
			specialkey:function(f,key){
				if(key.getKey() == key.ENTER){
					product_check_table_search();
				}
			}
		}
	},
	{
		text:'确认',
		iconCls:'search',
		handler:product_check_table_search
	}];

var product_check_items_tbar = 
	[{
		text:'添加',
		iconCls:'add',
		disabled:true,
		id:'product_check_items_add',
		handler:product_check_items_add
	},
	{
		text:'保存',
		iconCls:'option',
		disabled:true,
		id:'product_check_items_confirm',
		handler:product_check_items_confirm
	},
	{
		text:'取消',
		iconCls:'cancel',
		id:'product_check_items_cancel',
		hidden:true,
		handler:product_check_items_cancel
	},
	{
		text:'删除',
		iconCls:'remove',
		disabled:true,
		id:'product_check_items_del',
		handler:product_check_items_del
	},
	{
		text:'更多',
		iconCls:'remove',
		disabled:true,
		id:'product_check_items_more',
		handler:function(a){
			product_check_more_win.show(Ext.get('product_check_items_more'));
		}
	},
	'->',
	'搜索方式:',
	{
		xtype:'combo',
		id:'product_check_items_check_class',
		width:80,
		emptyText:'选择方式',
		store:items_check_store,
		displayField:'name',
		valueField:'class_name',
		mode:'local',
		triggerAction:'all',
		editable:false
	},
	{
		xtype:'textfield',
		id:'product_check_items_key',
		width:120,
		emptyText:'请输入信息',
		listeners:{
			specialkey:function(f,key){
				if(key.getKey() == key.ENTER){
					product_check_items_search();
				}
			}
		}
	},
	{
		text:'确认',
		iconCls:'search',
		handler:product_check_items_search
	}];

var product_check_panel = new Ext.grid.EditorGridPanel({
 	store:product_check_table_store,
	id:'product_check_table',
	region:'west',
	width:600,
	//autoWidth:true,
	height:450,
	clicksToEdit:2,
	autoSizeColumns:true,
	sm:product_check_table_sm,
	resizabel:true,
	frame:true,
	loadMask:true,
	tbar:product_check_table_tbar,
	bbar:new Ext.PagingToolbar({
        pageSize: 15,
        store:product_check_table_store,
        displayInfo:true,
        displayMsg:'显示 {0}-{1}条记录，共{2}条',
        emptyMsg:'没有记录'
		}),		
	columns:product_check_table_col
});

var product_check_table_remarkeditor = new Ext.form.TextField({
	emptyText:"备注",
	listeners:{
		change:function(a,b,c){
			if(!is_newcheckorder)
				{
				var table_id = product_check_table_sm.getSelected().data.table_id;
				var url = "/product_check/changeremark";
				var params = {
					'remark':b,
					'table_id':table_id
				};
				success = function(){
					product_check_table_store.reload();
				};
				p_ajax(url,params,success);
				}
		}
	}
})

product_check_panel.getColumnModel().setEditor(product_check_table_col.length - 1,product_check_table_remarkeditor);

var product_check_items_panel = new Ext.grid.EditorGridPanel({
 	store:product_check_items_store,
	id:'product_check_items',
	region:'center',
	width:620,
	height:450,
	clicksToEdit:2,
	autoSizeColumns:true,
	sm:product_check_items_sm,
	resizabel:true,
	frame:true,
	loadMask:true,
	tbar:product_check_items_tbar,
	bbar:new Ext.PagingToolbar({
        pageSize: 15,
        store:product_check_items_store,
        displayInfo:true,
        displayMsg:'显示 {0}-{1}条记录，共{2}条',
        emptyMsg:'没有记录'
		}),		
	columns:product_check_items_col
});

var product_check_table_win = new Ext.Window(
{
    modal:true,
    width:1300,
    height:350,
    frame:true,
    layout:'border',
    closeAction:'hide',
    title:'盘点管理<font color=red>红色表示产品已经删除</font>',
    items:[product_check_panel,
    	   product_check_items_panel
    	  ]
    
}		
);

var product_check_more_win = new Ext.Window({
	modal:true,
	width:400,
	autoHeight:true,
	frame:true,
	layout:'border',
	closeAction:'hide',
	title:'高级选项',
	tbar:['批量选择',
	    {
			xtype:'combo',
			width:100,
			forceSelection:true,
			store:catagory_store,
			displayField:'name',
			valueField:'name',
			mode:'local',
			triggerAction:'all',
			id:'product_check_items_moreselect'
	 	},
		'类的其他产品的盘点库存为',
		{
			xtype:'numberfield',
			width:80,
			allowNegative:false,
			value:0,
			id:'product_check_items_morenum'
		}],
	buttons:[
         	{
         		text:'确认',
         		handler:product_check_more_confirm
			},
			{
				text:'取消',
				handler:function(a){
					a.ownerCt.ownerCt.hide();
				}
			}]
})
