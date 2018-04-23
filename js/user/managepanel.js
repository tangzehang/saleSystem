	var store = new Ext.data.Store({
		reader:new Ext.data.JsonReader({
			id:'id',
			root:'data',
			totalProperty:'count'
		},['id','username','name','identity']),
		url:'/site/usermanage',
		autoLoad:true,
		listeners:{
			beforeload:function(){
				store.rejectChanges();
				if(Ext.get('save'))
				Ext.getCmp('save').setDisabled(true);
				if(Ext.get('remove'))
				Ext.getCmp('remove').setDisabled(true);
			}
		}
	});
	
	var column  = [{header:'用户名',dataIndex:'username',width:130,editor:new Ext.form.TextField(
			{
				allowBlank:false, 
				blankText:'不能为空', 
				emptyText:'请输入姓名',
				minLengthText:'最小为6个字符',
                maxLengthText:'最大为16个字符',
                vtype:'alphanum',
                vtypeText:'只能输入字母和数字',
                minLength:4,
                maxLength:16,
                listeners:{
                	change:function(field,e){
                		var va = field.value;
                		Ext.Ajax.request({
                			url:"/user/check",
                			method:'post',
                			params:{
                				username:e
                			},
                			success:function(response,re){
                				var re = Ext.decode(response.responseText)
                				if(re.success)
                					{
                					;
                					}
                				else
                					{
                					Ext.Msg.alert('错误','用户名存在');
                					Ext.getCmp('editgrid').getSelectionModel().getSelected().reject();
                					}
                			}
                		})
                	}
                }
                })},
			         
                {header:'名字',dataIndex:'name',width:130,editable:true,editor:new Ext.form.TextField({
			        	emptyText:'请输入姓名',
                        width:150,
                        allowBlank:false,
                        blankText:'不能为空'
			         })},
			         
			    {header:'身份',dataIndex:'identity',width:130,editable:true,renderer:function(r){
			        	 if(r==0)return '管理员';
			        	 if(r==1)return '销售员';
			        	 if(r==2)return '仓管员';
			        	 else return '其他';
			         },
			         editor:new Ext.form.ComboBox({
			        	    editable:false,
	                        store:identity,
	                        mode:'local',
	                        displayField:'identity',
	                        valueField:'id',
	                        allowBlank:false,
	                        blankText:'不能为空',
	                        shadow:true,
	                        triggerAction:'all' 
	                        
			         })}
			         ];
	var tbar = [{
        text:'新增',
        iconCls:'add',
        id:'addbutton',
        handler:function(){	
            addwin.show(Ext.get('addbutton'));
			Ext.getCmp('username').focus(true,500);
        }
			},
			{
				text:'保存',
				iconCls:'option',
				id:'save',
				disabled:true,
				handler:function(){
					var re = store.modified;
					if(re.length>0)
						{
						var data = [];
						Ext.each(store.modified,function(e){
							data.push(e.data);
						})
						Ext.Ajax.request({
							url:'/user/save',
							method:'post',
							params:{
								data:Ext.encode(data)
							},
							success:function(response,re){
								var re = Ext.decode(response.responseText)
								if(re.success)
									{
									store.reload();
									}
								else
									{
									Ext.Msg.alert("出错","请检查数据");
									}
						
							},
							failure:function(response,re){
								Ext.Msg.alert("出错","服务器出错");
							}
							
						})
						}
				}
				
			},
			{
        text:'删除',
        iconCls:'remove',
        id:'remove',
        disabled:true,
        handler:function(){
        	var select = Ext.getCmp('editgrid').getSelectionModel().getSelected();
        	if(select)
        		{
        		Ext.Msg.confirm('注意','确认要删除'+select.data.username+'?',function(fn){
        			if(fn == 'yes')
        				{
        				Ext.Ajax.request({
							url:'/user/remove',
							method:'post',
							params:{
								data:Ext.encode(select.data)
							},
							success:function(response,re){
								var re = Ext.decode(response.responseText)
								if(re.success)
									{
									store.reload();
									}
								else
									{
									Ext.Msg.alert("出错","未知错误");
									}
						
							},
							failure:function(response,re){
								Ext.Msg.alert("出错","服务器出错");
							}
							
						})
        				}
        		})
        		}
        	else
        		{
        		Ext.Msg.alert("错误","请选择一条记录");
        		}
        }
				},
				{
					text:'修改密码',
					iconCls:'change',
					id:'change',
					handler:function()
					{
						pwdwin.show(Ext.get('change'));
					}
				}];
