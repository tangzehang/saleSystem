var identity = new Ext.data.SimpleStore({
        fields:['id','identity'],
        data:[['0','管理员'],['1','销售员'],['2','仓管员']]
	});
	var content = new Ext.form.FormPanel({
         frame:true,
         method:'post',
         width:300,
         autoHeight:true,
         id:'addform',
         labelAlign:'right',
         url:'/user/adduser',
         items:[
                {
                    name:'username',
                    id:'username',
                    xtype:'textfield',
                    minLength:4,
                    maxLength:16,
                    minLengthText:'最小为4个字符',
                    maxLengthText:'最大为16个字符',
                    emptyText:'只能输入字母或数字',
                    fieldLabel:'用户名',
                    width:150,
                    vtype:'alphanum',
                    allowBlank:false,
                    blankText:'不能为空',
                    vtypeText:'只能输入字母和数字',
                    listeners:{
                    	specialkey:function(file,e)
                    	{
                    		keyfunction(file,e);
                    	}
                    }
                    },
                    {
                        name:'password',
                        id:'password',
                        xtype:'textfield',
                        inputType:'password',
                        width:150,
                        minLength:6,
                        maxLength:16,
                        minLengthText:'最小为6个字符',
                        maxLengthText:'最大为16个字符',
                        fieldLabel:'密码',
                        vtype:'alphanum',
                        allowBlank:false,
                        blankText:'不能为空',
                        vtypeText:'只能输入字母和数字',
                        listeners:{
                        	specialkey:function(file,e)
                        	{
                        		keyfunction(file,e);
                        	}
                        }
                    },
                    {
                        name:'name',
                        id:'name',
                        xtype:'textfield',
                        fieldLabel:'姓名',
                        emptyText:'请输入姓名',
                        width:150,
                        allowBlank:false,
                        blankText:'不能为空',
                        listeners:{
                        	specialkey:function(file,e)
                        	{
                        		keyfunction(file,e);
                        	}
                        }
                    },
                    {
                    	emptyText:'请选择身份',
                        name:'identity1',
                        id:'identity',
                        xtype:'combo',
                        hiddenName:'identity',
                        editable:false,
                        width:150,
                        fieldLabel:'身份',
                        store:identity,
                        mode:'local',
                        displayField:'identity',
                        valueField:'id',
                        allowBlank:false,
                        blankText:'不能为空',
                        selectOnFocus:true,
                        triggerAction:'all' 
                    }
                ],
         buttons:[
                  {
                      text:'提交',
                      handler:function(){
                    	  if(content.getForm().isValid()){
                    	  content.getForm().submit({
                          	  success:function(form,record){
                          		  var re = Ext.decode(record.response.responseText);
                          		  Ext.example.msg('成功',re.msg);
                          		  content.getForm().reset();
                          		  addwin.hide();
                          		  store.reload();
                          	  },
                          	  failure:function(form,record){
                          		  var re = Ext.decode(record.response.responseText);
                          		  Ext.Msg.alert('错误',re.msg);
                          	  }
                            
                          	  
                            });
                    	  }
                    	}
                  },
                  {
                      text:'重置',
                      handler:function(){
                    	  content.getForm().reset();
                      }
                  }
                  ]
		});

	var keyfunction = function(file,e){
		if(e.getKey() == e.ENTER)
		{
			if(content.getForm().isValid()){
          	  content.getForm().submit({
                	  success:function(form,record){
                		  var re = Ext.decode(record.response.responseText);
                		  Ext.Msg.alert('成功',re.msg);
                		  content.getform().reset();
                		  content.hide();
                	  },
                	  failure:function(form,record){
                		  var re = Ext.decode(record.response.responseText);
                		  Ext.Msg.alert('错误',re.msg);
                	  }
                  
                	  
                  });
          	  }
		}
		
	};