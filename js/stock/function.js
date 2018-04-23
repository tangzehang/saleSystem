var clearurl = '/stock/clearsub';// 清楚父产品状态的url

var product_in_table_delurl = '/product_in/removetable';
var product_check_table_delurl = '/product_check/removetable';

var product_in_table_addurl = '/product_in/addtable';
var product_check_table_addurl = '/product_check/addtable';

var product_in_items_delurl = '/product_in/removeitems';
var product_check_items_delurl = '/product_check/removeitems';

var product_in_table_confirmurl = '/product_in/confirmtable';
var product_check_table_confirmurl = '/product_check/confirmtable';

var product_in_items_confirmurl = '/product_in/confirmitems';
var product_check_items_confirmurl = '/product_check/confirmitems';

var is_neworder = false;// 是否新进货单的控制

var is_newcheckorder = false;// 是否新盘点单的控制

var relation_manage = function() { // 新增按钮的实现函数
	relation_win.show(Ext.get('relation_manage'));
	Ext.getCmp('parent_code').focus(true, 500);
}

var field_change = function(a, b) {// 新增关系窗口编号改变的函数
	var id = "";
	if (a.getId() == "parent_code")
		id = "parent_product";
	if (a.getId() == "child_code")
		id = "child_product";
	if (a.getId() == "product_num")
		return true;
	if (name_store.getById(b)) {
		Ext.getCmp(id).setValue(b);
		return true;
	} else {
		Ext.getCmp(id).reset();
		Ext.Msg.alert("错误", "没有此编号", function() {
			a.focus(true, 80);
		});
		return false;
	}
}

var key_up = function(a, key) {// 新增关系窗口的回车键函数
	if (key.getKey() == key.ENTER) {
		var b = a.getValue();
		if (field_change(a, b)) {
			if (a.getId() == "parent_code")
				Ext.getCmp('child_code').focus(true, 80);
			if (a.getId() == "child_code")
				Ext.getCmp('product_num').focus(true, 80);
			if (a.getId() == "product_num")
				deal_form(a.ownerCt.getForm());
		}
	}
}

var deal_form = function(form) {// 表单提交的函数
	if (form.isValid()) {
		form.submit({
			success : function(form, record) {
				var re = Ext.decode(record.response.responseText);
				Ext.example.msg("成功", "插入成功");
				form.reset();
				stock_store.reload();
			},
			failure : function(from, record) {
				var re = Ext.decode(record.response.responseText);
				Ext.Msg.alert("错误", re.msg);
			}
		});
	} else {
		Ext.Msg.alert("错误", "请输入必要的信息");
	}
}

var submit = function(a) {// 新增关系窗口的提交按钮函数
	var form = a.ownerCt.ownerCt.getForm();
	deal_form(form);
}

var clearsubproduct = function(grid, rowIndex, colIndex) {// 清空子产品的函数
	if (grid.getStore().getAt(rowIndex).get('has_parent') == 0) {
		Ext.Msg.alert("错误", "不是散装产品");
	} else {
		var params = {
			id : grid.getStore().getAt(rowIndex).get('product_id')
		};
		var success = function() {
			stock_store.reload();
		};
		p_ajax(clearurl, params, success);
	}
}

var product_in_manage = function() {// 显示进货单管理的函数
	product_in_table_win.show(Ext.get('stockin_manage'));
}

var product_check_manage = function() {// 显示盘点单的函数
	product_check_table_win.show(Ext.get('stockcheck_manage'));
}

var product_in_table_rowselect = function(a, index, record) {// 进货单单行选择的函数
	if (record.data.table_id != -1) {
		product_in_items_store.load();
		name_store.load();
		Ext.getCmp("product_in_table_confirm").setDisabled(record.data.status);
		Ext.getCmp("product_in_table_del").setDisabled(record.data.status);
		Ext.getCmp("product_in_items_confirm").setDisabled(record.data.status);
		Ext.getCmp("product_in_items_add").setDisabled(record.data.status);
		Ext.getCmp("product_in_items_del").setDisabled(record.data.status);
		var cm = product_in_items_panel.getColumnModel();
		for ( var i = 0; i < product_in_items_col.length; i++) {
			cm.setEditable(i, !record.data.status);
		}
	}
}

var product_check_table_rowselect = function(a, index, record) {// 进货单单行选择的函数
	if (record.data.table_id != -1) {
		product_check_items_store.load();
		name_store.load();
		Ext.getCmp("product_check_table_confirm").setDisabled(
				record.data.status);
		Ext.getCmp("product_check_table_del").setDisabled(record.data.status);
		Ext.getCmp("product_check_items_confirm").setDisabled(
				record.data.status);
		Ext.getCmp("product_check_items_add").setDisabled(record.data.status);
		Ext.getCmp("product_check_items_del").setDisabled(record.data.status);
		Ext.getCmp("product_check_items_more").setDisabled(record.data.status);
		var cm = product_check_items_panel.getColumnModel();
		for ( var i = 0; i < product_check_items_col.length; i++) {
			cm.setEditable(i, !record.data.status);
		}
	}
}

var product_in_items_store_beforeload = function() {// 进货单子项store的beforeload函数
	if (is_neworder) {
		Ext.Msg.alert("错误", "正在编辑新的进货单");
		return false;
	}
	var se = product_in_table_sm.getSelected();
	if (se) {
		var table_id = se.data.table_id;
		Ext.apply(product_in_items_store.baseParams, {
			'table_id' : table_id
		});
	} else {
		Ext.apply(product_in_items_store.baseParams, {
			'table_id' : -1
		});
	}
}

var product_check_items_store_beforeload = function() {// 盘点单子项store的beforeload函数
	if (is_newcheckorder) {
		Ext.Msg.alert("错误", "正在编辑新的盘点单");
		return false;
	}
	var se = product_check_table_sm.getSelected();
	if (se) {
		var table_id = se.data.table_id;
		Ext.apply(product_check_items_store.baseParams, {
			'table_id' : table_id
		});
	} else {
		Ext.apply(product_check_items_store.baseParams, {
			'table_id' : -1
		});
	}
}

var product_in_table_store_beforeload = function() {
	if (is_neworder) {
		Ext.Msg.alert("错误", "正在编辑新的进货单");
		return false;
	}
}

var product_check_table_store_beforeload = function() {
	if (is_newcheckorder) {
		Ext.Msg.alert("错误", "正在编辑新的盘点单");
		return false;
	}
}

var product_in_table_del = function()// 进货单的删除按钮函数
{
	var se = product_in_table_sm.getSelected();
	if (se) {
		if (!se.data.status) {
			Ext.Msg.confirm('注意', '确认要删除进货单?', function(fn) {
				if (fn == 'yes') {
					var table_id = se.data.table_id;
					var params = {
						'table_id' : table_id
					};
					var success = function() {
						Ext.getCmp("product_in_table_confirm").setDisabled(1);
						Ext.getCmp("product_in_table_del").setDisabled(1);
						Ext.getCmp("product_in_items_confirm").setDisabled(1);
						Ext.getCmp("product_in_items_add").setDisabled(1);
						Ext.getCmp("product_in_items_del").setDisabled(1);
						var cm = product_in_items_panel.getColumnModel();
						for ( var i = 0; i < product_in_items_col.length; i++) {
							cm.setEditable(i, 0);
						}
						product_in_table_store.reload();
						product_in_items_store.reload();
					};
					p_ajax(product_in_table_delurl, params, success);
				}
			});
		} else {
			Ext.Msg.alert("错误", "进货单已经确认过");
		}
	} else {
		Ext.Msg.alert("错误", "请先选择一个记录");
	}
}

var product_check_table_del = function()// 盘点单的删除按钮函数
{
	var se = product_check_table_sm.getSelected();
	if (se) {
		if (!se.data.status) {
			Ext.Msg
					.confirm(
							'注意',
							'确认要删除盘点单?',
							function(fn) {
								if (fn == 'yes') {
									var table_id = se.data.table_id;
									var params = {
										'table_id' : table_id
									};
									var success = function() {
										Ext.getCmp(
												"product_check_table_confirm")
												.setDisabled(1);
										Ext.getCmp("product_check_table_del")
												.setDisabled(1);
										Ext.getCmp(
												"product_check_items_confirm")
												.setDisabled(1);
										Ext.getCmp("product_check_items_add")
												.setDisabled(1);
										Ext.getCmp("product_check_items_del")
												.setDisabled(1);
										var cm = product_check_items_panel
												.getColumnModel();
										for ( var i = 0; i < product_check_items_col.length; i++) {
											cm.setEditable(i, 0);
										}
										product_check_table_store.reload();
										product_check_items_store.reload();
									};
									p_ajax(product_check_table_delurl, params,
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

var product_in_table_confirm = function()// 进货单的确认按钮函数
{
	var se = product_in_table_sm.getSelected();
	if (se) {
		if (!se.data.status) {
			var table_id = se.data.table_id;
			var params = {
				'table_id' : table_id
			};
			var success = function() {
				Ext.getCmp("product_in_table_confirm").setDisabled(1);
				Ext.getCmp("product_in_table_del").setDisabled(1);
				Ext.getCmp("product_in_items_confirm").setDisabled(1);
				Ext.getCmp("product_in_items_add").setDisabled(1);
				Ext.getCmp("product_in_items_del").setDisabled(1);
				var cm = product_in_items_panel.getColumnModel();
				for ( var i = 0; i < product_in_items_col.length; i++) {
					cm.setEditable(i, 0);
				}
				product_in_table_store.reload();
				product_in_items_store.reload();
				stock_store.reload();
			};
			p_ajax(product_in_table_confirmurl, params, success);
		} else {
			Ext.Msg.alert("错误", "进货单已经确认过");
		}
	}

	else {
		Ext.Msg.alert("错误", "请先选择一个记录");
	}
}

var product_check_table_confirm = function()// 盘点单的确认按钮函数
{
	var se = product_check_table_sm.getSelected();
	if (se) {
		if (!se.data.status) {
			var table_id = se.data.table_id;
			var params = {
				'table_id' : table_id
			};
			var success = function() {
				Ext.getCmp("product_check_table_confirm").setDisabled(1);
				Ext.getCmp("product_check_table_del").setDisabled(1);
				Ext.getCmp("product_check_items_confirm").setDisabled(1);
				Ext.getCmp("product_check_items_add").setDisabled(1);
				Ext.getCmp("product_check_items_del").setDisabled(1);
				var cm = product_check_items_panel.getColumnModel();
				for ( var i = 0; i < product_check_items_col.length; i++) {
					cm.setEditable(i, 0);
				}
				product_check_table_store.reload();
				product_check_items_store.reload();
				stock_store.reload();
			};
			p_ajax(product_check_table_confirmurl, params, success);
		} else {
			Ext.Msg.alert("错误", "进货单已经确认过");
		}
	}

	else {
		Ext.Msg.alert("错误", "请先选择一个记录");
	}
}

var product_in_items_confirm = function()// 进货单子项保存按钮函数
{
	if (!is_neworder) {
		var se = product_in_table_sm.getSelected();
		if (se) {
			var table_id = se.data.table_id;
			var status = se.data.status;
			if (status) {
				Ext.Msg.alert("错误", "进货单已确定");
				product_in_items_store.rejectChanges();
			} else {
				var re = product_in_items_store.modified;
				if (re.length > 0) {
					var data = [];
					Ext.each(re, function(e) {
						if(e == undefined)
							return false;
						if (check_record(e))
							data.push(e.data);
						else {
							if (e.data.table_item_id == -1)
								product_in_items_store.remove(e);
							else
								e.reject();
						}
					});
					var params = {
						data : Ext.encode(data),
						table_id : table_id
					};
					var success = function() {
						product_in_items_store.reload();
						product_in_items_store.rejectChanges();
						product_in_table_store.reload();
					}
					if (data.length > 0) {
						p_ajax(product_in_items_confirmurl, params, success);
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
		var remark = product_in_table_store.getAt(0).data.remark;
		var create_date = product_in_table_store.getAt(0).data.create_time;
		var data = [];
		var re = product_in_items_store.modified;
		Ext.each(re, function(e) {
			if(e == undefined)
				return false;
			if (check_record(e))
				data.push(e.data);
			else
				product_in_items_store.remove(e);
		});
		var params = {
			data : Ext.encode(data),
			remark : remark,
			create_date : create_date
		};
		var success = function() {
			Ext.Msg.confirm("添加成功", "是否继续添加？", function(btn) {
				if (btn == "yes") {
					product_in_table_add();
				} else {
					product_in_items_cancel();
					//product_in_table_store.reload();
					//product_in_items_store.reload();					
				}
			})
		}
		if (data.length > 0)
			p_ajax(product_in_table_addurl, params, success);
		else {
			Ext.Msg.alert("错误", "没有合法的修改数据");
		}
	}

}

var product_check_items_confirm = function()// 盘点单子项保存按钮函数
{
	if (!is_newcheckorder) {
		var se = product_check_table_sm.getSelected();
		if (se) {
			var table_id = se.data.table_id;
			var status = se.data.status;
			if (status) {
				Ext.Msg.alert("错误", "盘点单已确定");
				product_check_items_store.rejectChanges();
			} else {
				var re = product_check_items_store.modified;
				if (re.length > 0) {
					var data = [];
					Ext.each(re, function(e) {
						if(e == undefined)
							return false;
						if (check_record(e, 1))
							data.push(e.data);
						else {
							if (e.data.table_item_id == -1)
								product_check_items_store.remove(e);
							else
								e.reject();
						}
					});
					var params = {
						data : Ext.encode(data),
						table_id : table_id
					};
					var success = function() {
						product_check_items_store.reload();
						product_check_items_store.rejectChanges();
						product_check_table_store.reload();
					}
					if (data.length > 0) {
						p_ajax(product_check_items_confirmurl, params, success);
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
	} else// 新盘点单
	{
		var remark = product_check_table_store.getAt(0).data.remark;
		var create_date = product_check_table_store.getAt(0).data.create_time;
		var data = [];
		var re = product_check_items_store.modified;
		Ext.each(re, function(e) {
			if(e == undefined)
				return false;
			if (check_record(e, 1))
				data.push(e.data);
			else
				product_check_items_store.remove(e);
		});
		var params = {
			data : Ext.encode(data),
			remark : remark,
			create_date : create_date
		};
		var success = function() {
			Ext.Msg.confirm("添加成功", "是否继续添加？", function(btn) {
				if (btn == "yes") {
					product_check_table_add();
				} else {
					//product_check_table_store.reload();
					//product_check_items_store.reload();
					product_check_items_cancel();
				}
			})
		}
		if (data.length > 0)
			p_ajax(product_check_table_addurl, params, success);
		else {
			Ext.Msg.alert("错误", "没有合法的修改数据");
		}
	}

}

var product_in_items_del = function()// 进货单子项删除函数
{
	var se = product_in_items_sm.getSelected();
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
								product_in_table_store.reload();
								product_in_items_store.reload();
							};
							p_ajax(product_in_items_delurl, params, success);
						}
					});
		} else {
			se.reject();
			product_in_items_store.remove(se);
		}
	} else {
		Ext.Msg.alert("错误", "请先选择一个记录");
	}
}

var product_check_items_del = function()// 盘点单子项删除函数
{
	var se = product_check_items_sm.getSelected();
	if (se) {
		var code = se.data.table_item_code;
		var name = se.data.table_item_name;
		var catagoryname = se.data.table_item_catagoryname;
		var num = se.data.table_item_num;
		if (se.data.table_item_id != -1) {// 如果不是新加的项目
			Ext.Msg
					.confirm('注意', '确认要删除' + se.data.table_item_name + '?',
							function(fn) {
								if (fn == 'yes') {
									se.reject();
									var item_id = se.data.table_item_id;
									var params = {
										'item_id' : item_id
									};
									var success = function() {
										product_check_table_store.reload();
										product_check_items_store.reload();
									};
									p_ajax(product_check_items_delurl, params,
											success);
								}
							});
		} else// 新加的项目，则直接在前台删除
		{
			se.reject();
			product_check_items_store.remove(se);
		}

	} else {
		Ext.Msg.alert("错误", "请先选择一个记录");
	}
}

var product_in_items_add = function() { // 进货单子项添加函数
	var re = product_in_table_sm.getSelected();
	if (is_neworder || !re.data.status) {
		var product_in_items_index = [ {
			name : 'table_item_id'
		}, {
			name : 'table_item_code'
		}, {
			name : 'table_item_name'
		}, {
			name : 'table_item_catagoryname'
		}, {
			name : 'table_item_num',
			type : 'float'
		}, {
			name : 'table_item_price',
			type : 'float'
		}, {
			name : 'table_item_pstatus',
			type : 'boolean'
		}, {
			name : 'table_item_remark',
			type : 'string'
		} ];
		var product_in_items_record = Ext.data.Record
				.create(product_in_items_index);
		var re = new product_in_items_record({
			table_item_id : -1,
			table_item_code : "",
			table_item_name : "",
			table_item_catagoryname : "",
			table_item_num : 0,
			table_item_price : 0,
			table_item_pstatus: true,
			table_item_remark : ""
		});
		if(product_in_items_store.getCount() > 0)
			{
			if(check_record(product_in_items_store.getAt(0)))
				product_in_items_store.insert(0, re);
			}
		else
			{
			product_in_items_store.insert(0, re);
			}
		product_in_items_panel.startEditing(0, 1);
	} else {
		Ext.Msg.alert("错误", "非法操作");
	}
}

var product_check_items_add = function() { // 盘点单子项添加函数
	var re = product_check_table_sm.getSelected();
	if (is_newcheckorder || !re.data.status) {
		var product_check_items_index = [ {
			name : 'table_item_id'
		}, {
			name : 'table_item_code'
		}, {
			name : 'table_item_name'
		}, {
			name : 'table_item_catagoryname'
		}, {
			name : 'table_item_num',
			type : 'float'
		}, {
			name : 'table_item_checknum',
			type : 'float'
		}, {
			name : 'table_item_pstatus',
			type : 'boolean'
		}, {
			name : 'table_item_remark',
			type : 'string'
		} ];
		var product_check_items_record = Ext.data.Record
				.create(product_check_items_index);
		var re = new product_check_items_record({
			table_item_id : -1,
			table_item_code : "",
			table_item_name : "",
			table_item_num : 0,
			table_item_checknum : 0,
			table_item_pstatus : true,
			table_item_remark : ""
		});
		if(product_check_items_store.getCount() > 0)
			{
			if(check_record(product_check_items_store.getAt(0),1))
				product_check_items_store.insert(0, re);
			}
		else
			{
			product_check_items_store.insert(0, re);
			}
		product_check_items_panel.startEditing(0, 1);
	} else {
		Ext.Msg.alert("错误", "非法操作");
	}
}

var product_in_table_add = function() { // 进货单添加函数
	name_store.load();
	Ext.getCmp("product_in_table_confirm").setDisabled(1);
	Ext.getCmp("product_in_table_del").setDisabled(1);
	Ext.getCmp("product_in_table_add").setDisabled(1);
	Ext.getCmp("product_in_items_confirm").setDisabled(0);
	Ext.getCmp("product_in_items_add").setDisabled(0);
	Ext.getCmp("product_in_items_del").setDisabled(0);
	Ext.getCmp("product_in_items_cancel").setVisible(1);
	var cm = product_in_items_panel.getColumnModel();
	for ( var i = 0; i < product_in_items_col.length; i++) {
		cm.setEditable(i, 1);
	}
	is_neworder = true;
	product_in_table_store.removeAll();
	product_in_items_store.removeAll();
	var product_in_index = [ {
		name : 'table_id'
	}, {
		name : 'create_time'
	}, {
		name : 'confirm_time'
	}, {
		name : 'total_price'
	}, {
		name : 'status',
		type : 'boolean'
	}, {
		name : 'remark'
	} ];
	var product_in_table_record = Ext.data.Record.create(product_in_index);
	var table_re = new product_in_table_record({
		table_id : -1,
		create_time : new Date().format("Y-m-d,H:i:s"),
		confirm_tiem : "",
		total_price : 0,
		status : 0,
		remark : ""
	});
	product_in_table_store.insert(0, table_re);
	product_in_items_add();
}

var product_check_table_add = function() { // 盘点单添加函数
	name_store.load();
	Ext.getCmp("product_check_table_confirm").setDisabled(1);
	Ext.getCmp("product_check_table_del").setDisabled(1);
	Ext.getCmp("product_check_table_add").setDisabled(1);
	Ext.getCmp("product_check_items_confirm").setDisabled(0);
	Ext.getCmp("product_check_items_add").setDisabled(0);
	Ext.getCmp("product_check_items_del").setDisabled(0);
	Ext.getCmp("product_check_items_cancel").setVisible(1);
	Ext.getCmp("product_check_items_more").setDisabled(0);
	var cm = product_check_items_panel.getColumnModel();
	for ( var i = 0; i < product_check_items_col.length; i++) {
		cm.setEditable(i, 1);
	}
	is_newcheckorder = true;
	product_check_table_store.removeAll();
	product_check_items_store.removeAll();
	var product_check_index = [ {
		name : 'table_id'
	}, {
		name : 'create_time'
	}, {
		name : 'confirm_time'
	}, {
		name : 'status',
		type : 'boolean'
	}, {
		name : 'remark'
	} ];
	var product_check_table_record = Ext.data.Record
			.create(product_check_index);
	var table_re = new product_check_table_record({
		table_id : -1,
		create_time : new Date().format("Y-m-d,H:i:s"),
		confirm_tiem : "",
		status : 0,
		remark : ""
	});
	product_check_table_store.insert(0, table_re);
	product_check_items_add();
}

var in_cancel = function() { // 进货初始组件设置
	Ext.getCmp("product_in_table_confirm").setDisabled(1);
	Ext.getCmp("product_in_table_del").setDisabled(1);
	Ext.getCmp("product_in_table_add").setDisabled(0);
	Ext.getCmp("product_in_items_confirm").setDisabled(1);
	Ext.getCmp("product_in_items_add").setDisabled(1);
	Ext.getCmp("product_in_items_del").setDisabled(1);
	Ext.getCmp("product_in_items_cancel").setVisible(0);
	var cm = product_in_items_panel.getColumnModel();
	for ( var i = 0; i < product_in_items_col.length; i++) {
		cm.setEditable(i, 0);
	}
	is_neworder = false;
	product_in_items_store.removeAll();
	name_store.load();
}

var product_in_items_cancel = function() { // 进货单子项取消函数
	in_cancel();
	product_in_table_store.reload();
}

var check_cancel = function() {// 盘点初始组件设置
	Ext.getCmp("product_check_table_confirm").setDisabled(1);
	Ext.getCmp("product_check_table_del").setDisabled(1);
	Ext.getCmp("product_check_table_add").setDisabled(0);
	Ext.getCmp("product_check_items_confirm").setDisabled(1);
	Ext.getCmp("product_check_items_add").setDisabled(1);
	Ext.getCmp("product_check_items_del").setDisabled(1);
	Ext.getCmp("product_check_items_cancel").setVisible(0);
	Ext.getCmp("product_check_items_more").setDisabled(1);
	var cm = product_check_items_panel.getColumnModel();
	for ( var i = 0; i < product_check_items_col.length; i++) {
		cm.setEditable(i, 0);
	}
	is_newcheckorder = false;
	product_check_items_store.removeAll();
	name_store.load();
}

var product_check_items_cancel = function() { // 盘点单子项取消函数
	check_cancel();
	product_check_table_store.reload();
}

var check_record = function(record) { // 验证输入数据是否合法的函数
	var a = (arguments[1] != undefined) ? 1 : 0;
	if (a == 0)
		var cm = product_in_items_panel.getColumnModel();
	else
		var cm = product_check_items_panel.getColumnModel();
	var count = cm.getColumnCount();
	for ( var i = 1; i < count; i++) {
		var editor = cm.config[i].editor;
		var value = record.data[cm.config[i].dataIndex];
		if (!editor.validateValue(value))
			return false;
	}
	return true;
}

var product_in_table_search = function() { // 进货单查找函数
	if ((Ext.getCmp('product_in_table_check_class').getValue() == "")
			|| (Ext.getCmp('product_in_table_key').getValue() == "")) {
		Ext.apply(product_in_table_store.baseParams, {
			'check_class' : 'create_time',
			'key' : ''
		});
		product_in_table_store.load();
	} else {
		Ext.apply(product_in_table_store.baseParams, {
			'check_class' : Ext.getCmp('product_in_table_check_class')
					.getValue(),
			'key' : Ext.getCmp('product_in_table_key').getValue()
		});
		product_in_table_store.load();
	}
}

var product_check_table_search = function() { // 盘点单查找函数
	if ((Ext.getCmp('product_check_table_check_class').getValue() == "")
			|| (Ext.getCmp('product_check_table_key').getValue() == "")) {
		Ext.apply(product_check_table_store.baseParams, {
			'check_class' : 'create_time',
			'key' : ''
		});
		product_check_table_store.load();
	} else {
		Ext.apply(product_check_table_store.baseParams, {
			'check_class' : Ext.getCmp('product_check_table_check_class')
					.getValue(),
			'key' : Ext.getCmp('product_check_table_key').getValue()
		});
		product_check_table_store.load();
	}
}

var product_in_items_search = function() { // 进货单子项查找函数
	if ((Ext.getCmp('product_in_items_check_class').getValue() == "")
			|| (Ext.getCmp('product_in_items_key').getValue() == "")) {
		Ext.apply(product_in_items_store.baseParams, {
			'check_class' : 'table_item_code',
			'key' : ''
		});
		product_in_items_store.load();
	} else {
		Ext.apply(product_in_items_store.baseParams, {
			'check_class' : Ext.getCmp('product_in_items_check_class')
					.getValue(),
			'key' : Ext.getCmp('product_in_items_key').getValue()
		});
		product_in_items_store.load();
	}
}

var product_check_items_search = function() { // 盘点单子项查找函数
	if ((Ext.getCmp('product_check_items_check_class').getValue() == "")
			|| (Ext.getCmp('product_check_items_key').getValue() == "")) {
		Ext.apply(product_check_items_store.baseParams, {
			'check_class' : 'table_item_code',
			'key' : ''
		});
		product_check_items_store.load();
	} else {
		Ext.apply(product_check_items_store.baseParams, {
			'check_class' : Ext.getCmp('product_check_items_check_class')
					.getValue(),
			'key' : Ext.getCmp('product_check_items_key').getValue()
		});
		product_check_items_store.load();
	}
}

var stock_search = function() { // 库存表查找函数
	if ((Ext.getCmp('stock_check_class').getValue() == "")
			|| (Ext.getCmp('stock_key').getValue() == "")) {
		Ext.apply(stock_store.baseParams, {
			'check_class' : 'product_code',
			'key' : ''
		});
		stock_store.load();
	} else {
		Ext.apply(stock_store.baseParams, {
			'check_class' : Ext.getCmp('stock_check_class').getValue(),
			'key' : Ext.getCmp('stock_key').getValue()
		});
		stock_store.load();
	}
}

var product_check_more_confirm = function() { // 高级界面内的确认按钮
	var catagory = Ext.getCmp("product_check_items_moreselect").getValue();
	var num = Ext.getCmp("product_check_items_morenum").getValue();
	product_check_more_win.hide();
	if (catagory != "") {
		name_store.each(function(e) {
			if (catagory != "全部" && e.data.name_catagoryname != catagory) {
				;
			} else {
				var is_exist = product_check_items_store.findBy(function(re) {
					return re.data.table_item_code == e.data.name_code;
				}, this, 0);
				if (is_exist == -1) {
					var product_check_items_index = [ {
						name : 'table_item_id'
					}, {
						name : 'table_item_code'
					}, {
						name : 'table_item_name'
					}, {
						name : 'table_item_catagoryname'
					}, {
						name : 'table_item_num',
						type : 'float'
					}, {
						name : 'table_item_checknum',
						type : 'float'
					}, {
						name : 'table_item_remark',
						type : 'string'
					} ];
					var product_check_items_record = Ext.data.Record
							.create(product_check_items_index);
					var re = new product_check_items_record({
						table_item_id : -1,
						table_item_code : e.data.name_code,
						table_item_name : e.data.name_name,
						table_item_catagoryname : e.data.name_catagoryname,
						table_item_num : e.data.name_stocknum,
						table_item_checknum : num,
						table_item_remark : ""
					});
					product_check_items_store.insert(0, re);
				}
			}
		})
	}
}