var sell_main_head = [ '产品编码', '产品名称', '产品分类', '产品规格', '销售数量', '销售价格', '总价',
		'折扣', '备注' ];
// 销售界面的头部显示
var sell_main_index = [ {
	name : 'product_code'
}, {
	name : 'product_name'
}, {
	name : 'product_catagory'
}, {
	name : 'product_standard'
}, {
	name : 'product_sellnum'
}, {
	name : 'product_sellprice'
}, {
	name : 'product_allprice'
}, {
	name : 'product_discount'
}, {
	name : 'remark'
} ];
// 销售界面的头部数据名
var sell_main_sm = new Ext.grid.RowSelectionModel(
		{
			singleSelect : true,
			onEditorKey : function(field, e) {
				var k = e.getKey(), newCell, g = this.grid, last = g.lastEdit, ed = g.activeEditor, shift = e.shiftKey, ae, last, r, c;
				if (k == e.TAB) {
					e.stopEvent();
					ed.completeEdit();
					if (shift) {
						newCell = g.walkCells(ed.row, ed.col - 1, -1,
								this.acceptsNav, this);
					} else {
						newCell = g.walkCells(ed.row, ed.col + 1, 1,
								this.acceptsNav, this);
					}
				}
				if (k == e.DOWN)
					{
					if(sell_main_sm.getSelected())
						{
						sell_main_sm.selectNext();
						}
					else
						{
						sell_main_sm.selectRow(0);
						}
					}
				if (k == e.UP)
					{
					if(sell_main_sm.getSelected())
					{
					sell_main_sm.selectPrevious();
					}
				else
					{
					sell_main_sm.selectRow(0);
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
							// *** if activeEditor is a TriggerField, explicitly
							// call
							// its triggerBlur() method
							ae.field.triggerBlur();
						}
					}
					g.startEditing(r, c);
				}

			}
		});

var sell_main_col = [ new Ext.grid.RowNumberer() ];

var sell_main_editor = [
		new Ext.form.TextField(
				{
					emptyText : '请输入编号',
					allowBlank : false,
					blankText : '不能为空',
					listeners : {
						Specialkey : function(a, b) {
							if (b.getKey() == b.ENTER) {
								var se = a.gridEditor;
								var text = a.getValue();
								if(text == "")
									{
									sell_main_confirm();
									}
							}
						},
						change : function(a, b) {
							var se = a.gridEditor;
							var re = name_store.getById(b);
							var store = se.record.store;
							var index = store.indexOf(se.record);
							if (re) {
								se.record
										.set("product_name", re.data.name_name);
								se.record.set("product_catagory",
										re.data.name_catagoryname);
								se.record.set("product_standard",
										re.data.name_standard);
								se.record.set("product_sellnum", 1);
								se.record.set("product_sellprice",
										1 * re.data.name_sellprice);// 1*可以把字符串变成数字
								se.record.set("product_allprice",
										1 * re.data.name_sellprice);
								var se = Ext.getCmp("sell_main_allprice");
								var allprice = sell_main_store
										.sum("product_allprice");
								se.setValue(allprice);
								sell_main_add();
							} else {
								Ext.Msg.alert("错误", "不存在此编号的产品", function() {
									// a.reset();
									se.record.set("product_name", "临时产品");
									se.record.set("product_catagory", "临时分类");
									se.record.set("product_standard", "1*1");
									se.record.set("product_sellnum", 1);
									Ext.getCmp("editgrid").startEditing(se.row,
											6);
								}, this);
							}

						}
					}
				}),
		new Ext.form.ComboBox(
				{
					store : name_store,
					emptyText : '请选择产品名称',
					allowBlank : false,
					blankText : '不能为空',
					displayField : 'name_name',
					valueField : 'name_name',
					mode : 'local',
					forceSelection : true,
					triggerAction : 'query',
					listeners : {
						select : function(a, b, c) {
							var se = a.gridEditor;
							se.record.set("product_code", b.data.name_code);
							se.record.set("product_catagory",
									b.data.name_catagoryname);
							se.record.set("product_standard",
									b.data.name_standard);
							se.record.set("product_sellnum", 1);
							se.record.set("product_sellprice",
									b.data.name_sellprice);
							se.record.set("product_allprice",
									b.data.name_sellprice);
							var se = Ext.getCmp("sell_main_allprice");
							var allprice = sell_main_store
									.sum("product_allprice");
							se.setValue(allprice);
							sell_main_add();
						}
					}
				}),
		{
			editable : false,
			readOnly : true
		},
		{
			editable : false,
			readOnly : true
		},
		new Ext.form.NumberField({
			allowDecimals : true,
			allowBlank : false,
			allowNegative : false,
			decimalPrecision : 2,// 小数点后位数
			listeners : {
				specialkey:function(a,e)
				{
					if(e.getKey() == e.ENTER)
						{
						sell_main_add();
						}
				},
				change : function(a, b, c) {
					var se = a.gridEditor;
					se.record.set("product_allprice", b
							* se.record.data.product_sellprice);
					var se = Ext.getCmp("sell_main_allprice");
					var allprice = sell_main_store.sum("product_allprice");
					se.setValue(allprice);
				}
			}
		}),
		new Ext.form.NumberField({
			allowDecimals : true,
			allowBlank : false,
			allowNegative : false,
			decimalPrecision : 2,// 小数点后位数
			listeners : {
				specialkey:function(a,e)
				{
					if(e.getKey() == e.ENTER)
						{
						sell_main_add();
						}
				},
				change : function(a, b, c) {
					var se = a.gridEditor;
					se.record.set("product_allprice", b
							* se.record.data.product_sellnum);
					var se = Ext.getCmp("sell_main_allprice");
					var allprice = sell_main_store.sum("product_allprice");

					se.setValue(allprice);
				},
				specialkey : function(a, e) {
					if (e.getKey() == e.ENTER) {
						sell_main_add();
					}
				}
			}
		}),
		new Ext.form.NumberField({
			allowDecimals : true,
			allowBlank : false,
			allowNegative : false,
			eidtable : false,
			readOnly : true,
			decimalPrecision : 2
		// 小数点后位数

		}),
		new Ext.form.NumberField({
			allowDecimals : true,
			allowBlank : false,
			allowNegative : false,
			decimalPrecision : 2,// 小数点后位数
			listeners : {
				specialkey:function(a,e)
				{
					if(e.getKey() == e.ENTER)
						{
						sell_main_add();
						}
				},
				change : function(a, b, c) {
					var se = a.gridEditor;
					se.record.set("product_allprice", (b	* se.record.data.product_sellprice * se.record.data.product_sellnum).toFixed(2));
					//se.record.set("product_sellprice", b * se.record.data.product_sellprice);
					var se = Ext.getCmp("sell_main_allprice");
					var allprice = sell_main_store.sum("product_allprice");
					se.setValue(allprice);
				}
			}
		}), new Ext.form.TextField({
			emptyText : '备注'
		}) ];

for ( var i = 0; i < sell_main_head.length; i++) {
	sell_main_col.push({
		header : sell_main_head[i],
		dataIndex : sell_main_index[i].name,
		sortable : false,
		editor : sell_main_editor[i]
	})
}

var sell_main_tbar = [ {
	text : '添加',
	id : 'sell_main_add',
	iconCls : 'add',
	handler : sell_main_add
}, {
	text : '确认',
	id : 'sell_main_confirm',
	iconCls : 'confirm',
	handler : sell_main_confirm
}, {
	text : '删除',
	id : 'sell_main_del',
	iconCls : 'remove',
	handler : sell_main_del
}, {
	text : '取消',
	id : 'sell_main_cancel',
	iconCls : 'cancel',
	handler : sell_main_cancel
} ];

var sell_main_bbar = [ '->', '总金额：', new Ext.form.NumberField({
	decimal : 2,
	allowNegative : false,
	id : 'sell_main_allprice',
	readOnly : true,
	value : 0,
	width : 80
}), '元' ];