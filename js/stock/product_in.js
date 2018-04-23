var product_in_head = ["创建日期","确认日期","总金额","备注"];

var product_in_index = [{name:'create_time'},{name:'confirm_time'},{name:'total_price'},{name:'remark'}];

var product_in_items_head = ["编号","名称","分类名","数量","进货价格","备注"];

var product_in_items_index = [{name:'table_item_code'},{name:'table_item_name'},{name:'table_item_catagoryname'},{name:'table_item_num'},{name:'table_item_price'},{name:'table_item_remark'}];

var product_in_table_sm = new Ext.grid.RowSelectionModel({singleSelect:true,
	onEditorKey:function(field,e){},
	listeners:{
	'rowselect':product_in_table_rowselect
}});

var product_in_items_sm = new Ext.grid.RowSelectionModel({
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

var product_in_table_col = [new Ext.grid.RowNumberer()];

var product_in_items_col = [new Ext.grid.RowNumberer()];

var product_in_table_width =[130,130,80,150];

var product_in_items_width =[100,100,100,50,70,100];

for(var i = 0;i < product_in_head.length; i++)
{

		product_in_table_col.push({
			header:product_in_head[i],
			dataIndex:product_in_index[i].name,
			sortable:(i != 1 || i != 4) ? true : false ,
			width:product_in_table_width[i],
			editable:(i == product_in_head.length -1) ? true : false
		})
		
};

var product_in_items_editor = [
new Ext.form.TextField({
	emptyText:'请输入编号',
    allowBlank:false,
    blankText:'不能为空',
    listeners:{
    	Specialkey:function(a,b){
    		if(b.getKey() == b.ENTER)
    			{
    			//var se = a.gridEditor;
					var text = a.getValue();
					if(text == "")
					{
						product_in_items_confirm();
					}
    			}
    			
    	},
    	change:function(a,b){
    		var se = a.gridEditor;
    		static_record = se;
    		static_editor = a;
    		var re = name_store.getById(b);
    		if(re)
			{
			se.record.set("table_item_name",re.data.name_name);
			se.record.set("table_item_catagoryname",re.data.name_catagoryname);
				product_in_items_panel.startEditing(se.row,se.col+3);
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
				product_in_items_panel.startEditing(se.row,se.col+2);
			}
		}
        }),
        {
		editable:false,
		readOnly:true
        },
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
        				product_in_items_panel.startEditing(se.row,se.col+1);
        			}
        			
        	},
        	change:function(a,b,c){
        		var record = a.gridEditor.record;
        		var d_value = (b-c) * record.data.table_item_price;
        		var record = "";
        		if(is_neworder)
        			record = product_in_table_store.getAt(0);
        		else
        			record = product_in_table_sm.getSelected();
        		var value = record.data.total_price + d_value;
        		record.set("total_price",value);
        	}
        }
       	 }),
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
        				product_in_items_panel.startEditing(se.row,se.col+1);
        			}
        			
        	},
        	change:function(a,b,c){
        		var record = a.gridEditor.record;
        		var d_value = (b-c) * record.data.table_item_num;
        		var record = "";
        		if(is_neworder)
        			record = product_in_table_store.getAt(0);
        		else
        			record = product_in_table_sm.getSelected();
        		var value = record.data.total_price + d_value;
        		record.set("total_price",value);
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
   	    				if(!check_record(se.record))
   	    					{
   	    					se.record.reject();
   	    					product_in_items_panel.startEditing(se.row,1);
   	    					}
   	    				else
   	    					{
   	    					if(is_neworder)
   	    						{
   	    						product_in_items_add();
   	    						}
   	    					}
       	    			}
       	    			
       	    	}
       	    }
       	    })];

for(var i = 0;i < product_in_items_head.length; i++)
{

		product_in_items_col.push({
			header:product_in_items_head[i],
			dataIndex:product_in_items_index[i].name,
			sortable:true,
			width:product_in_items_width[i],
			editor:product_in_items_editor[i],
			renderer:function(v,i,r){
				if(!r.data.table_item_pstatus)
					return "<font color = 'red'>"+v+"</font>";
				else
					return v;
			}
			
		})
		
};

var product_in_table_tbar = 
	[{
		text:'添加',
		iconCls:'add',
		id:'product_in_table_add',
		handler:product_in_table_add
	},
	{
		text:'确认',
		iconCls:'confirm',
		id:'product_in_table_confirm',
		disabled:true,
		handler:product_in_table_confirm
	},
	{
		text:'删除',
		iconCls:'remove',
		id:'product_in_table_del',
		disabled:true,
		handler:product_in_table_del
	},
	'->',
	'搜索方式:',
	{
		xtype:'combo',
		id:'product_in_table_check_class',
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
		id:'product_in_table_key',
		width:180,
		//emptyText:'请输入信息',
		listeners:{
			specialkey:function(f,key){
				if(key.getKey() == key.ENTER){
					product_in_table_search();
				}
			}
		}
	},
	{
		text:'确认',
		iconCls:'search',
		handler:product_in_table_search
	}];

var product_in_items_tbar = 
	[{
		text:'添加',
		iconCls:'add',
		id:'product_in_items_add',
		disabled:true,
		handler:product_in_items_add
	},
	{
		text:'保存',
		iconCls:'option',
		id:'product_in_items_confirm',
		disabled:true,
		handler:product_in_items_confirm
	},
	{
		text:'取消',
		iconCls:'cancel',
		id:'product_in_items_cancel',
		hidden:true,
		handler:product_in_items_cancel
	},
	{
		text:'删除',
		iconCls:'remove',
		id:'product_in_items_del',
		disabled:true,
		handler:product_in_items_del
	},
	'->',
	'搜索方式:',
	{
		xtype:'combo',
		id:'product_in_items_check_class',
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
		id:'product_in_items_key',
		width:120,
		emptyText:'请输入信息',
		listeners:{
			specialkey:function(f,key){
				if(key.getKey() == key.ENTER){
					product_in_items_search();
				}
			}
		}
	},
	{
		text:'确认',
		iconCls:'search',
		handler:product_in_items_search
	}];

var product_in_panel = new Ext.grid.EditorGridPanel({
 	store:product_in_table_store,
	id:'product_in_table',
	region:'west',
	width:600,
	//autoWidth:true,
	height:450,
	clicksToEdit:2,
	stripeRows:true,
	sm:product_in_table_sm,
	resizabel:true,
	frame:true,
	loadMask:true,
	autoSizeColumns:true,
	tbar:product_in_table_tbar,
	bbar:new Ext.PagingToolbar({
        pageSize: 15,
        store:product_in_table_store,
        displayInfo:true,
        displayMsg:'显示 {0}-{1}条记录，共{2}条',
        emptyMsg:'没有记录'
		}),		
	columns:product_in_table_col
});

var product_in_table_remarkeditor = new Ext.form.TextField({
	emptyText:"备注",
	listeners:{
		change:function(a,b,c){
			if(!is_neworder)
				{
				var table_id = product_in_table_sm.getSelected().data.table_id;
				var url = "/product_in/changeremark";
				var params = {
					'remark':b,
					'table_id':table_id
				};
				success = function(){
					product_in_table_store.reload();
				};
				p_ajax(url,params,success);
				}
		}
	}
})

product_in_panel.getColumnModel().setEditor(product_in_table_col.length - 1,product_in_table_remarkeditor);

var product_in_items_panel = new Ext.grid.EditorGridPanel({
 	store:product_in_items_store,
	id:'product_in_items',
	region:'center',
	width:500,
	height:450,
	clicksToEdit:2,
	stripeRows:true,
	sm:product_in_items_sm,
	resizabel:true,
	frame:true,
	loadMask:true,
	autoSizeColumns:true,
	tbar:product_in_items_tbar,
	bbar:new Ext.PagingToolbar({
        pageSize: 15,
        store:product_in_items_store,
        displayInfo:true,
        displayMsg:'显示 {0}-{1}条记录，共{2}条',
        emptyMsg:'没有记录'
		}),		
	columns:product_in_items_col
});

var product_in_table_win = new Ext.Window(
{
    modal:true,
    width:1200,
    height:450,
    frame:true,
    layout:'border',
    title:'进货单管理<font color=red>红色表示产品已经删除</font>',
    closeAction:'hide',
    items:[product_in_panel,
    	   product_in_items_panel
    	  ]
}
);


