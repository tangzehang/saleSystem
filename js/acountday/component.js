var day_manage_head = ["创建日期","确认日期","总销售额","总进货价","总利润"];

var day_manage_index = [{name:'create_time'},{name:'confirm_time'},{name:'total_sell_price'},{name:'total_income_price'},{name:'total_profit'}];

var day_manage_items_head = ["产品名称","产品数量","销售价","进货价"];

var day_manage_items_index = [{name:'product_name'},{name:'product_num'},{name:'product_sell_price'},{name:'product_in_price'}];

var day_manage_items_print_url = "/acount/printDayitem";


var day_manage_table_sm = new Ext.grid.RowSelectionModel({singleSelect:true,
	onEditorKey:function(field,e){},
	listeners:{
	'rowselect':day_manage_table_rowselect
}});

var day_manage_table_col = [new Ext.grid.RowNumberer()];

var day_manage_items_col = [new Ext.grid.RowNumberer()];

var day_manage_table_width =[130,130,75,95,90];

var day_manage_items_width =[130,130,130,130];

for(var i = 0;i < day_manage_head.length; i++)
{

		day_manage_table_col.push({
			header:day_manage_head[i],
			dataIndex:day_manage_index[i].name,
			sortable:(i != 5) ? true : false ,
			width:day_manage_table_width[i]
		})
		
};


for(var i = 0;i < day_manage_items_head.length; i++)
{

		day_manage_items_col.push({
			header:day_manage_items_head[i],
			dataIndex:day_manage_items_index[i].name,
			sortable:(i != 4) ? true : false,
			width:day_manage_items_width[i]			
		})
		
};

var day_manage_table_tbar = 
	[{
		text:'创建清算单',
		iconCls:'add',
		id:'day_manage_table_add',
		handler:day_manage_table_add
	},
	{
		text:'确认',
		iconCls:'confirm',
		id:'day_manage_table_confirm',
		disabled:true,
		handler:day_manage_table_confirm
	},
		{
			text:'打印',
			iconCls:'printer',
			id:'day_manage_table_print',
			disabled:true,
			handler:function(){
				var se = day_manage_table_sm.getSelected();
				if (se) {
					var table_id = se.data.table_id;
				} else {
					var table_id = -1;
				}
				var printUrl = day_manage_items_print_url+"?table_id="+table_id;
				if(!(Ext.getCmp('day_manage_table_check_class').getValue() == "") && !(Ext.getCmp('day_manage_table_key').getValue() == ""))
				{
					printUrl = printUrl + '&check_class='+Ext.getCmp('day_manage_table_check_class').getValue()+'&key='+Ext.getCmp('day_manage_table_key').getValue();
				}
				p_print(printUrl);
			}
		},
	'->',
	'搜索方式:',
	{
		xtype:'combo',
		id:'day_manage_table_check_class',
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
		id:'day_manage_table_key',
		width:180,
		//emptyText:'请输入信息',
		listeners:{
			specialkey:function(f,key){
				if(key.getKey() == key.ENTER){
					day_manage_table_search();
				}
			}
		}
	},
	{
		text:'确认',
		iconCls:'search',
		handler:day_manage_table_search
	}];

var day_manage_panel = new Ext.grid.EditorGridPanel({
 	store:day_manage_table_store,
	id:'day_manage_table',
	region:'west',
	width:600,
	//autoWidth:true,
	height:350,
	clicksToEdit:2,
	stripeRows:true,
	sm:day_manage_table_sm,
	resizabel:true,
	frame:true,
	loadMask:true,
	autoSizeColumns:true,
	tbar:day_manage_table_tbar,
	bbar:new Ext.PagingToolbar({
        pageSize: 15,
        store:day_manage_table_store,
        displayInfo:true,
        displayMsg:'显示 {0}-{1}条记录，共{2}条',
        emptyMsg:'没有记录'
		}),		
	columns:day_manage_table_col
});

var day_manage_table_remarkeditor = new Ext.form.TextField({
	emptyText:"备注",
	listeners:{
		change:function(a,b,c){
			if(!is_neworder)
				{
				var table_id = day_manage_table_sm.getSelected().data.table_id;
				var url = "/day_manage/changeremark";
				var params = {
					'remark':b,
					'table_id':table_id
				};
				success = function(){
					day_manage_table_store.reload();
				};
				p_ajax(url,params,success);
				}
		}
	}
})

var day_manage_items_panel = new Ext.grid.EditorGridPanel({
 	store:day_manage_items_store,
	id:'day_manage_items',
	region:'center',
	width:500,
	height:350,
	clicksToEdit:2,
	stripeRows:true,
	resizabel:true,
	frame:true,
	loadMask:true,
	autoSizeColumns:true,
	bbar:new Ext.PagingToolbar({
        pageSize: 15,
        store:day_manage_items_store,
        displayInfo:true,
        displayMsg:'显示 {0}-{1}条记录，共{2}条',
        emptyMsg:'没有记录'
		}),		
	columns:day_manage_items_col
});

