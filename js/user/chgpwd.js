var pwd_store = new Ext.data.Store({
		reader:new Ext.data.JsonReader({
			id:'id',
			root:'data',
			totalProperty:'count'
		},['id','username']),
		url:'/site/usermanage',
		autoLoad:true,
	});
	var pwdform = new Ext.form.FormPanel({
           frame:true,
           width:300,
           autoHeight:true,
           labelAlign:'right', 
           items:[
                  {
                      xtype:'combo',
                      id:'id',
                      name:'id',
                      hiddenName:'username',
                      fieldLabel:'选择用户名',
                      store:pwd_store,
                      allowBlank:false,
                      editable:false,
                      displayField:'username',
                      valueField:'id',
                      mode	:'local',
                      blankText:'不能为空'
                   },
                   {
                  	 name:'password',
                       id:'old_password',
                       xtype:'textfield',
                       inputType:'password',
                       width:150,
                       minLength:6,
                       maxLength:16,
                       minLengthText:'最小为6个字符',
                       maxLengthText:'最大为16个字符',
                       fieldLabel:'原密码',
                       vtype:'alphanum',
                       allowBlank:false,
                       blankText:'不能为空',
                       vtypeText:'只能输入字母和数字',                     
                       listeners:{
                            change:function(field,val){
                                var id = Ext.getCmp('id').getValue();
                                if(id == '')
                                {
                              	  Ext.getCmp('password').setValue('');
                                    Ext.Msg.alert('错误','请先选择用户名');
                                    return;
                                }
                                Ext.Ajax.request({
                                    url:'/user/checkpwd',
                                    params:{
                                           id:id,
                                           pwd:val
                                        },
                                    method:'post',
                                    success:function(response,re){
                                       var rec = Ext.decode(response.responseText);
                                       if(!rec.success)
                                       {
                                       Ext.getCmp('password').setValue('');
                                       Ext.Msg.alert('错误','密码错误');
                                        }
      
                                        }
                                    });
                           }}
                   },
                   {
                  	 name:'new_password',
                       id:'new_password',
                       xtype:'textfield',
                       inputType:'password',
                       width:150,
                       minLength:6,
                       maxLength:16,
                       minLengthText:'最小为6个字符',
                       maxLengthText:'最大为16个字符',
                       fieldLabel:'新密码',                        
                       vtype:'alphanum',
                       allowBlank:false,
                       blankText:'不能为空',
                       vtypeText:'只能输入字母和数字'
                   },
                   {
                       id:'check_password',
                       xtype:'textfield',
                       inputType:'password',
                       width:150,
                       minLength:6,
                       maxLength:16,
                       minLengthText:'最小为6个字符',
                       maxLengthText:'最大为16个字符',
                       fieldLabel:'确认密码',
                       vtype:'alphanum',
                       allowBlank:false,
                       blankText:'不能为空',
                       vtypeText:'只能输入字母和数字',
                       
                       listeners:{
                             change:function(v){
                                 var new_pwd = Ext.getCmp('new_password').getValue();
                                 if(v.getValue() != new_pwd)
                                 {
                                     Ext.Msg.alert('错误','密码不一致');
                                     v.setValue('');
                                 }
                                 },
                                 specialkey:function(field,e){
                                         if(e.getKey() == e.ENTER)
                                         {
                                        formsubmit();
                                          }
                                     }
                           }
                   }

                  ],
                  buttons:[
                             {
                                 text:'提交',
                                 handler:function(){
                                     formsubmit();
                                     }
                             },
                             {
                                 text:'重置',
                                 handler:function(){
                                    pwdform.getForm().reset();
                                     }
                             }
                             ]
		})
	var pwdwin = new Ext.Window({
         frame:true,
         modal:true,
         resizable:false,
         closeAction:'hide',
         items:[pwdform]
         
		});

	var formsubmit = function(){
		if(pwdform.getForm().isValid()){
			
		pwdform.getForm().submit({
			loadMask: true,
            url:'/user/doupdatepwd',
            method:'post',
            success:function(response,re){
               Ext.example.msg('OK','修改密码成功');
               pwdform.getForm().reset();
               pwdwin.hide();
               
                },
            failure:function(response,re){
               Ext.Msg.alert('错误','修改失败');
                }
		})
		}
	}