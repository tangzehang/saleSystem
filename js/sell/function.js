var confirm_url = "/sell/confirm"

var sell_manage_table_delurl = '/sell_manage/removetable';

var sell_manage_table_addurl = '/sell_manage/addtable';

var sell_manage_items_delurl = '/sell_manage/removeitems';

var sell_manage_table_confirmurl = '/sell_manage/confirmtable';

var sell_manage_items_confirmurl = '/sell_manage/confirmitems';

var is_neworder = false;

var sell_main_add = function(but) {
	// var sell_main_store_index =
	// [{name:'product_code'},{name:'product_name'},{name:'product_catagory'},{name:'product_standard'},{name:'product_sellnum'},{name:'product_sellprice'},{name:'product_allprice'},{name:'product_discount'},{name:'remark'}];
	var re = sell_main_store.getAt(0);
	var cm = Ext.getCmp("editgrid").getColumnModel();
	if (sell_main_store.getCount() > 0)
		var su = check_record(re, cm);
	else
		var su = 0;
	if (su == 0) {
		var record = Ext.data.Record.create(sell_main_store_index);
		var new_re = new record({
			product_sellprice : 0,
			product_allprice : 0,
			product_sellnum : 0,
			product_discount : 1
		});
		sell_main_store.insert(0, new_re);
		Ext.getCmp("editgrid").startEditing(0, 1);
	} else {
		Ext.getCmp("editgrid").startEditing(0, su);
	}

}

var check_record = function(record, cm) { // 验证输入数据是否合法的函数
	var count = cm.getColumnCount();
	for ( var i = 1; i < count; i++) {
		var editor = cm.config[i].editor;
		var value = record.data[cm.config[i].dataIndex];
		if (!editor.validateValue(value))
			return i;
	}
	return 0;
}

var sell_main_confirm = function(but) {
	var data = [];
	var cm = Ext.getCmp("editgrid").getColumnModel();
	var records = sell_main_store;
	records.each(function(e) {
		if (check_record(e, cm) == 0) {
			data.push(e.data);
		}
	});
	if (data.length > 0) {
		var success = function() {
			sell_main_cancel();
		}
		var all_price = Ext.getCmp("sell_main_allprice").getValue();
		Ext.Msg.prompt("确认收款", "应收金额" + all_price + "元", function(btn, text) {
			if (btn == "ok") {
				var params = {
					"data" : Ext.encode(data),
					"get_money" : text
				};
				Ext.Msg.alert("应找金额", "应找金额为" + (text - all_price) + "元",
						function() {
							p_ajax(confirm_url, params, success);
						}, this);
			} else {
				Ext.getCmp("editgrid").startEditing(0, 1);
			}
		}, this)

	} else {
		Ext.Msg.alert("错误", "请输入有效信息", function() {
			Ext.getCmp("editgrid").startEditing(0, 1);
		});
	}

}

var sell_main_cancel = function(but) {// 销售界面的取消函数
	sell_main_store.rejectChanges();
	sell_main_store.removeAll();
	var se = Ext.getCmp("sell_main_allprice");
	var allprice = sell_main_store.sum("product_allprice");
	se.setValue(allprice);
	sell_main_add();
}

var sell_main_del = function(but) {// 销售界面的删除函数
	var se = sell_main_sm.getSelected();
	if (se) {
		sell_main_store.remove(se);
		var se = Ext.getCmp("sell_main_allprice");
		var allprice = sell_main_store.sum("product_allprice");
		se.setValue(allprice);
		sell_main_add();
	} else {
		Ext.Msg.alert("错误", "请选择一条记录", function() {
			sell_main_add();

		})
	}
}

var sell_manage_items_store_beforeload = function() {// 销售单子项store的beforeload函数
	if (is_neworder) {
		Ext.Msg.alert("错误", "正在编辑新的进货单");
		return false;
	}
	var se = sell_manage_table_sm.getSelected();
	if (se) {
		var table_id = se.data.table_id;
		Ext.apply(sell_manage_items_store.baseParams, {
			'table_id' : table_id
		});
	} else {
		Ext.apply(sell_manage_items_store.baseParams, {
			'table_id' : -1
		});
	}
}

var sell_manage_table_store_beforeload = function() {// 销售单表单加载之前的操作
	if (is_neworder) {
		Ext.Msg.alert("错误", "正在编辑新的销售单");
		return false;
	}
}

var sell_manage_table_rowselect = function(a, index, record) {// 销售单单行选择的函数
	if (record.data.table_id != -1) {
		sell_manage_items_store.load();
		name_store.load();
		Ext.getCmp("sell_manage_table_confirm").setDisabled(record.data.status);
		Ext.getCmp("sell_manage_table_del").setDisabled(record.data.status);
		Ext.getCmp("sell_manage_items_confirm").setDisabled(record.data.status);
		Ext.getCmp("sell_manage_items_add").setDisabled(record.data.status);
		Ext.getCmp("sell_manage_items_del").setDisabled(record.data.status);
		Ext.getCmp("sell_manage_items_print").setDisabled(0);
		var cm = sell_manage_items_panel.getColumnModel();
		for ( var i = 0; i < sell_manage_items_col.length; i++) {
			cm.setEditable(i, !record.data.status);
		}
	}
}

var sell_manage_table_del = function()// 销售单的删除按钮函数
{
	var se = sell_manage_table_sm.getSelected();
	if (se) {
		if (!se.data.status) {
			Ext.Msg
					.confirm(
							'注意',
							'确认要删除进货单?',
							function(fn) {
								if (fn == 'yes') {
									var table_id = se.data.table_id;
									var params = {
										'table_id' : table_id
									};
									var success = function() {
										Ext.getCmp("sell_manage_table_confirm")
												.setDisabled(1);
										Ext.getCmp("sell_manage_table_del")
												.setDisabled(1);
										Ext.getCmp("sell_manage_items_confirm")
												.setDisabled(1);
										Ext.getCmp("sell_manage_items_add")
												.setDisabled(1);
										Ext.getCmp("sell_manage_items_del")
												.setDisabled(1);
										var cm = sell_manage_items_panel
												.getColumnModel();
										for ( var i = 0; i < sell_manage_items_col.length; i++) {
											cm.setEditable(i, 0);
										}
										sell_manage_table_store.reload();
										sell_manage_items_store.reload();
									};
									p_ajax(sell_manage_table_delurl, params,
											success);
								}
							});
		} else {
			Ext.Msg.alert("错误", "进货单已经确认过");
		}
	} else {
		Ext.Msg.alert("错误", "请先选择一个记录");
	}
}

var sell_manage_table_confirm = function()// 销售单的确认按钮函数
{
	var se = sell_manage_table_sm.getSelected();
	var all_price = se.data.total_price;
	if (se) {
		if (!se.data.status) {
			Ext.Msg
					.prompt(
							"确认售货单",
							"应收金额" + all_price + "元",
							function(btn, text) {
								if (btn == "ok") {
									var table_id = se.data.table_id;
									var params = {
										'table_id' : table_id,
										'get_money' : text
									};
									var success = function() {
										Ext.getCmp("sell_manage_table_confirm")
												.setDisabled(1);
										Ext.getCmp("sell_manage_table_del")
												.setDisabled(1);
										Ext.getCmp("sell_manage_items_confirm")
												.setDisabled(1);
										Ext.getCmp("sell_manage_items_add")
												.setDisabled(1);
										Ext.getCmp("sell_manage_items_del")
												.setDisabled(1);
										var cm = sell_manage_items_panel
												.getColumnModel();
										for ( var i = 0; i < sell_manage_items_col.length; i++) {
											cm.setEditable(i, 0);
										}
										sell_manage_table_store.reload();
										sell_manage_items_store.reload();
									};
									p_ajax(sell_manage_table_confirmurl,
											params, success);
								}
							});
		} else {
			Ext.Msg.alert("错误", "进货单已经确认过");
		}
	}

	else {
		Ext.Msg.alert("错误", "请先选择一个记录");
	}
}

var sell_manage_items_confirm = function()// 销售单子项保存按钮函数
{
	if (!is_neworder) {
		var se = sell_manage_table_sm.getSelected();
		if (se) {
			var table_id = se.data.table_id;
			var status = se.data.status;
			if (status) {
				Ext.Msg.alert("错误", "进货单已确定");
				sell_manage_items_store.rejectChanges();
			} else {
				var re = sell_manage_items_store.modified;
				var cm = sell_manage_items_panel.getColumnModel();
				if (re.length > 0) {
					var data = [];
					Ext.each(re, function(e) {
						if (e == undefined)
							return false;
						if (check_record(e, cm) == 0)
							data.push(e.data);
						else {
							if (e.data.table_item_id == -1)
								sell_manage_items_store.remove(e);
							else
								e.reject();
						}
					});
					var params = {
						data : Ext.encode(data),
						table_id : table_id
					};
					var success = function() {
						sell_manage_items_store.reload();
						sell_manage_items_store.rejectChanges();
						sell_manage_table_store.reload();
					}
					if (data.length > 0) {
						p_ajax(sell_manage_items_confirmurl, params, success);
					} else {
						Ext.Msg.alert("错误", "没有合法的修改数据");
					}
				} else {
					Ext.Msg.alert("错误", "没有修改的子项");
				}
			}
		} else {
			Ext.Msg.alert("错误", "请先选择一个进货单");
		}
	} else// 新进货单
	{
		var remark = sell_manage_table_store.getAt(0).data.remark;
		var create_date = sell_manage_table_store.getAt(0).data.create_time;
		var data = [];
		var cm = sell_manage_items_panel.getColumnModel();
		var re = sell_manage_items_store.modified;
		Ext.each(re, function(e) {
			if (e == undefined)
				return false;
			if (check_record(e, cm) == 0)
				data.push(e.data);
			else
				sell_manage_items_store.remove(e);
		});
		var params = {
			data : Ext.encode(data),
			remark : remark,
			create_date : create_date
		};
		var success = function() {
			Ext.Msg.confirm("添加成功", "是否继续添加？", function(btn) {
				if (btn == "yes") {
					sell_manage_table_add();
				} else {
					sell_manage_items_cancel();
					// sell_manage_table_store.reload();
					// sell_manage_items_store.reload();
				}
			})
		}
		if (data.length > 0)
			p_ajax(sell_manage_table_addurl, params, success);
		else {
			Ext.Msg.alert("错误", "没有合法的修改数据");
		}
	}

}

var sell_manage_items_del = function()// 销售单子项删除函数
{
	var se = sell_manage_items_sm.getSelected();
	if (se) {
		if (se.data.table_item_id != -1) {
			Ext.Msg.confirm('注意', '确认要删除' + se.data.table_item_name + '?',
					function(fn) {
						if (fn == 'yes') {
							se.reject();
							var item_id = se.data.table_item_id;
							var params = {
								'item_id' : item_id
							};
							var success = function() {
								sell_manage_table_store.reload();
								sell_manage_items_store.reload();
							};
							p_ajax(sell_manage_items_delurl, params, success);
						}
					});
		} else {
			se.reject();
			sell_manage_items_store.remove(se);
		}
	} else {
		Ext.Msg.alert("错误", "请先选择一个记录");
	}
}

var sell_manage_items_add = function() { // 销售单子项添加函数
	var re = sell_manage_table_sm.getSelected();
	if (is_neworder || !re.data.status) {

		var sell_manage_items_record = Ext.data.Record
				.create(sell_manage_items_store_index);
		var re = new sell_manage_items_record({
			table_item_id : -1,
			table_item_code : "",
			table_item_name : "",
			table_item_catagoryname : "",
			table_item_num : 0,
			table_item_price : 0,
			table_item_pstatus : true,
			table_item_discount : 1,
			table_item_remark : ""
		});
		var cm = sell_manage_items_panel.getColumnModel();
		if (sell_manage_items_store.getCount() > 0) {
			if (check_record(sell_manage_items_store.getAt(0), cm) == 0)
				sell_manage_items_store.insert(0, re);
		} else {
			sell_manage_items_store.insert(0, re);
		}
		sell_manage_items_panel.startEditing(0, 1);
	} else {
		Ext.Msg.alert("错误", "非法操作");
	}
}

var sell_manage_table_add = function() { // 销售单添加函数
	name_store.load();
	Ext.getCmp("sell_manage_table_confirm").setDisabled(1);
	Ext.getCmp("sell_manage_table_del").setDisabled(1);
	Ext.getCmp("sell_manage_table_add").setDisabled(1);
	Ext.getCmp("sell_manage_table_print").setDisabled(1);
	Ext.getCmp("sell_manage_items_confirm").setDisabled(0);
	Ext.getCmp("sell_manage_items_add").setDisabled(0);
	Ext.getCmp("sell_manage_items_del").setDisabled(0);
	Ext.getCmp("sell_manage_items_cancel").setVisible(1);
	Ext.getCmp("sell_manage_items_print").setVisible(0);
	var cm = sell_manage_items_panel.getColumnModel();
	for ( var i = 0; i < sell_manage_items_col.length; i++) {
		cm.setEditable(i, 1);
	}
	is_neworder = true;
	sell_manage_table_store.removeAll();
	sell_manage_items_store.removeAll();
	var sell_manage_table_record = Ext.data.Record
			.create(sell_manage_store_index);
	var table_re = new sell_manage_table_record({
		table_id : -1,
		create_time : new Date().format("Y-m-d,H:i:s"),
		confirm_tiem : "",
		total_price : 0,
		get_money : 0,
		status : 0,
		remark : ""
	});
	sell_manage_table_store.insert(0, table_re);
	sell_manage_items_add();
}

var in_cancel = function() { // 进货初始组件设置
	Ext.getCmp("sell_manage_table_confirm").setDisabled(1);
	Ext.getCmp("sell_manage_table_del").setDisabled(1);
	Ext.getCmp("sell_manage_table_add").setDisabled(0);
	Ext.getCmp("sell_manage_table_print").setDisabled(0);
	Ext.getCmp("sell_manage_items_confirm").setDisabled(1);
	Ext.getCmp("sell_manage_items_add").setDisabled(1);
	Ext.getCmp("sell_manage_items_print").setVisible(1);
	Ext.getCmp("sell_manage_items_del").setDisabled(1);
	Ext.getCmp("sell_manage_items_cancel").setVisible(0);
	var cm = sell_manage_items_panel.getColumnModel();
	for ( var i = 0; i < sell_manage_items_col.length; i++) {
		cm.setEditable(i, 0);
	}
	is_neworder = false;
	sell_manage_items_store.removeAll();
	name_store.load();
}

var sell_manage_items_cancel = function() { // 进货单子项取消函数
	in_cancel();
	sell_manage_table_store.reload();
}

var sell_manage_table_search = function() { // 进货单查找函数
	if ((Ext.getCmp('sell_manage_table_check_class').getValue() == "")
			|| (Ext.getCmp('sell_manage_table_key').getValue() == "")) {
		Ext.apply(sell_manage_table_store.baseParams, {
			'check_class' : 'create_time',
			'key' : ''
		});
		sell_manage_table_store.load();
	} else {
		Ext.apply(sell_manage_table_store.baseParams, {
			'check_class' : Ext.getCmp('sell_manage_table_check_class')
					.getValue(),
			'key' : Ext.getCmp('sell_manage_table_key').getValue()
		});
		sell_manage_table_store.load();
	}
}

var sell_manage_items_search = function() { // 进货单子项查找函数
	if ((Ext.getCmp('sell_manage_items_check_class').getValue() == "")
			|| (Ext.getCmp('sell_manage_items_key').getValue() == "")) {
		Ext.apply(sell_manage_items_store.baseParams, {
			'check_class' : 'table_item_code',
			'key' : ''
		});
		sell_manage_items_store.load();
	} else {
		Ext.apply(sell_manage_items_store.baseParams, {
			'check_class' : Ext.getCmp('sell_manage_items_check_class')
					.getValue(),
			'key' : Ext.getCmp('sell_manage_items_key').getValue()
		});
		sell_manage_items_store.load();
	}
}
