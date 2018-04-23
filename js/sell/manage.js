var sell_manage_head = ["创建日期","确认日期","总金额","收的金额","备注","状态"];

var sell_manage_index = [{name:'create_time'},{name:'confirm_time'},{name:'total_price'},{name:'get_money'},{name:'remark'},{name: 'status'}];

var sell_manage_table_print_url = "/sell_manage/printtable";

var sell_manage_item_print_url = "/sell_manage/printitems";

var sell_manage_items_head = ["编号","名称","分类名","数量","售出价格","折扣","备注"];

var sell_manage_items_index = [{name:'table_item_code'},{name:'table_item_name'},{name:'table_item_catagoryname'},{name:'table_item_num'},{name:'table_item_price'},{name:'table_item_discount'},{name:'table_item_remark'}];

var sell_manage_table_sm = new Ext.grid.RowSelectionModel({singleSelect:true,
	onEditorKey:function(field,e){},
	listeners:{
	'rowselect':sell_manage_table_rowselect
}});

var sell_manage_items_sm = new Ext.grid.RowSelectionModel({
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

var sell_manage_table_col = [new Ext.grid.RowNumberer()];

var sell_manage_items_col = [new Ext.grid.RowNumberer()];

var sell_manage_table_width =[130,130,80,80,100,50];

var sell_manage_items_width =[100,100,100,50,70,50,100];

for(var i = 0;i < sell_manage_head.length; i++)
{

    if(i != sell_manage_head.length - 1) {
        sell_manage_table_col.push({
            header: sell_manage_head[i],
            dataIndex: sell_manage_index[i].name,
            sortable: (i != 4) ? true : false,
            width: sell_manage_table_width[i],
            editable: (sell_manage_index[i].name == "remark") ? true : false
        })
    }else{
        sell_manage_table_col.push({
            header: sell_manage_head[i],
            dataIndex: sell_manage_index[i].name,
            sortable: (i != 4) ? true : false,
            width: sell_manage_table_width[i],
            editable: (sell_manage_index[i].name == "remark") ? true : false,
            renderer:function(a){
                return a+1;
            }
        })
    }
		
};

var sell_manage_items_editor = [
new Ext.form.TextField({
	emptyText:'请输入编号',
    allowBlank:false,
    blankText:'不能为空',
    listeners:{
    	Specialkey:function(a,b){
    		if(b.getKey() == b.ENTER)
    			{
    			var se = a.gridEditor;
    			sell_manage_items_panel.startEditing(se.row,se.col+3);
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
			se.record.set("table_item_price",re.data.name_sellprice);
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
					sell_manage_items_panel.startEditing(se.row,se.col);
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
				se.record.set("table_item_price",b.data.name_sellprice);
				sell_manage_items_panel.startEditing(se.row,se.col+2);
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
        				sell_manage_items_panel.startEditing(se.row,se.col+1);
        			}
        			
        	},
        	change:function(a,b,c){
        		var record = a.gridEditor.record;
        		var d_value = (b-c) * record.data.table_item_price;
        		var record = "";
        		if(is_neworder)
        			record = sell_manage_table_store.getAt(0);
        		else
        			record = sell_manage_table_sm.getSelected();
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
        				sell_manage_items_panel.startEditing(se.row,se.col+1);
        			}
        			
        	},
        	change:function(a,b,c){
        		var record = a.gridEditor.record;
        		var d_value = (b-c) * record.data.table_item_num;
        		var record = "";
        		if(is_neworder)
        			record = sell_manage_table_store.getAt(0);
        		else
        			record = sell_manage_table_sm.getSelected();
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
           				sell_manage_items_panel.startEditing(se.row,se.col+1);
           			}
           			
           	},
           	change:function(a,b,c){
           		var record = a.gridEditor.record;
           		var d_value = (b-c) * record.data.table_item_num * record.data.table_item_price;
           		var record = "";
           		if(is_neworder)
           			record = sell_manage_table_store.getAt(0);
           		else
           			record = sell_manage_table_sm.getSelected();
           		var value = record.data.total_price + d_value;
           		record.set("total_price",value);
           	}
           }
          	 })
        ,
       	new Ext.form.TextField({
       		emptyText:'备注',
       		listeners:{
       	    	specialkey:function(a,b){
       	    		if(b.getKey() == b.ENTER)
       	    			{
       	    			a.blur();
       	    			var se = a.gridEditor;
       	    			var cm = sell_manage_items_panel.getColumnModel();
   	    				if(check_record(se.record,cm) != 0)
   	    					{
   	    					se.record.reject();
   	    					sell_manage_items_panel.startEditing(se.row,1);
   	    					}
   	    				else
   	    					{
   	    					if(is_neworder)
   	    						{
   	    						sell_manage_items_add();
   	    						}
   	    					}
       	    			}
       	    			
       	    	}
       	    }
       	    })];

for(var i = 0;i < sell_manage_items_head.length; i++)
{

		sell_manage_items_col.push({
			header:sell_manage_items_head[i],
			dataIndex:sell_manage_items_index[i].name,
			sortable:true,
			width:sell_manage_items_width[i],
			editor:sell_manage_items_editor[i],
			renderer:function(v,i,r){
				if(!r.data.table_item_pstatus)
					return "<font color = 'red'>"+v+"</font>";
				else
					return v;
			}
			
		})
		
};

var sell_manage_table_tbar = 
	[{
		text:'添加',
		iconCls:'add',
		id:'sell_manage_table_add',
		handler:sell_manage_table_add
	},
	{
		text:'确认',
		iconCls:'confirm',
		id:'sell_manage_table_confirm',
		disabled:true,
		handler:sell_manage_table_confirm
	},
	{
		text:'删除',
		iconCls:'remove',
		id:'sell_manage_table_del',
		disabled:true,
		handler:sell_manage_table_del
	},
		{
			text:'打印',
			iconCls:'printer',
			id:'sell_manage_table_print',
			disabled:false,
			handler:function(){
				var printUrl = sell_manage_table_print_url;
				if(!(Ext.getCmp('sell_manage_table_check_class').getValue() == "") && !(Ext.getCmp('sell_manage_table_key').getValue() == ""))
				{
					printUrl = printUrl + '?check_class='+Ext.getCmp('sell_manage_table_check_class').getValue()+'&key='+Ext.getCmp('sell_manage_table_key').getValue();
				}
				p_print(printUrl);
			}
		},
	'->',
	'搜索方式:',
	{
		xtype:'combo',
		id:'sell_manage_table_check_class',
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
		id:'sell_manage_table_key',
		width:180,
		//emptyText:'请输入信息',
		listeners:{
			specialkey:function(f,key){
				if(key.getKey() == key.ENTER){
					sell_manage_table_search();
				}
			}
		}
	},
	{
		text:'确认',
		iconCls:'search',
		handler:sell_manage_table_search
	}];

var sell_manage_items_tbar = 
	[{
		text:'添加',
		iconCls:'add',
		id:'sell_manage_items_add',
		disabled:true,
		handler:sell_manage_items_add
	},
	{
		text:'保存',
		iconCls:'option',
		id:'sell_manage_items_confirm',
		disabled:true,
		handler:sell_manage_items_confirm
	},
	{
		text:'取消',
		iconCls:'cancel',
		id:'sell_manage_items_cancel',
		hidden:true,
		handler:sell_manage_items_cancel
	},
	{
		text:'删除',
		iconCls:'remove',
		id:'sell_manage_items_del',
		disabled:true,
		handler:sell_manage_items_del
	},
		{
			text:'打印',
			iconCls:'printer',
			id:'sell_manage_items_print',
			disabled:true,
			handler:function(){
				var se = sell_manage_table_sm.getSelected();
				if (se) {
					var table_id = se.data.table_id;
				} else {
					var table_id = -1;
				}
				var printUrl = sell_manage_item_print_url+"?table_id="+table_id;
				if(!(Ext.getCmp('sell_manage_items_check_class').getValue() == "") && !(Ext.getCmp('sell_manage_items_key').getValue() == ""))
				{
					printUrl = printUrl + '&check_class='+Ext.getCmp('sell_manage_items_check_class').getValue()+'&key='+Ext.getCmp('sell_manage_items_key').getValue();
				}
				p_print(printUrl);
			}
		},
	'->',
	'搜索方式:',
	{
		xtype:'combo',
		id:'sell_manage_items_check_class',
		width:80,
		emptyText:'选择方式',
		store:items_check_store,
		displayField:'name',
		valueField:'class_name',
		mode:'local',
		triggerAction:'all',
		editable:false
	},
	'关键字:',
	{
		xtype:'textfield',
		id:'sell_manage_items_key',
		width:80,
		emptyText:'请输入信息',
		listeners:{
			specialkey:function(f,key){
				if(key.getKey() == key.ENTER){
					sell_manage_items_search();
				}
			}
		}
	},
	{
		text:'确认',
		iconCls:'search',
		handler:sell_manage_items_search
	}];

var sell_manage_panel = new Ext.grid.EditorGridPanel({
 	store:sell_manage_table_store,
	id:'sell_manage_table',
	region:'west',
	width:630,
	//autoWidth:true,
	height:350,
	clicksToEdit:2,
	stripeRows:true,
	sm:sell_manage_table_sm,
	resizabel:true,
	frame:true,
	loadMask:true,
	autoSizeColumns:true,
	tbar:sell_manage_table_tbar,
	bbar:new Ext.PagingToolbar({
        pageSize: 15,
        store:sell_manage_table_store,
        displayInfo:true,
        displayMsg:'显示 {0}-{1}条记录，共{2}条',
        emptyMsg:'没有记录'
		}),		
	columns:sell_manage_table_col
});

var sell_manage_table_remarkeditor = new Ext.form.TextField({
	emptyText:"备注",
	listeners:{
		change:function(a,b,c){
			if(!is_neworder)
				{
				var table_id = sell_manage_table_sm.getSelected().data.table_id;
				var url = "/sell_manage/changeremark";
				var params = {
					'remark':b,
					'table_id':table_id
				};
				success = function(){
					sell_manage_table_store.reload();
				};
				p_ajax(url,params,success);
				}
		}
	}
})

sell_manage_panel.getColumnModel().setEditor(sell_manage_table_col.length - 2,sell_manage_table_remarkeditor);

var sell_manage_items_panel = new Ext.grid.EditorGridPanel({
 	store:sell_manage_items_store,
	id:'sell_manage_items',
	region:'center',
	width:500,
	height:350,
	clicksToEdit:2,
	stripeRows:true,
	sm:sell_manage_items_sm,
	resizabel:true,
	frame:true,
	loadMask:true,
	autoSizeColumns:true,
	tbar:sell_manage_items_tbar,
	bbar:new Ext.PagingToolbar({
        pageSize: 15,
        store:sell_manage_items_store,
        displayInfo:true,
        displayMsg:'显示 {0}-{1}条记录，共{2}条',
        emptyMsg:'没有记录'
		}),		
	columns:sell_manage_items_col
});

