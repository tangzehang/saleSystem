var content = new Ext.form.FormPanel({
         method:'post',
         width:250,
        columnWidth:0.55,
         //autoHeight:true,
        height:160,
        border:false,
        labelWidth: 65,

        id:'addform',
         labelAlign:'right',
         url:'/log/index',
         items:[
                {
                    labelStyle :"height:31px;font-size:17px;",
                    style:"font-size:17px;",
                    height:35,
                    width:200,
                    name:'username',
                    id:'username',
                    xtype:'textfield',
                    minLength:4,
                    maxLength:16,
                    minLengthText:'最小为4个字符',
                    maxLengthText:'最大为16个字符',
                    emptyText:'只能输入字母或数字',
                    fieldLabel:'用户名',

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
                    {height:25,width:200},
                    {
                        labelStyle :"height:31px;font-size:17px;",
                        style:"font-size:17px;",
                        height:35,
                        width:200,
                        name:'password',
                        id:'password',
                        xtype:'textfield',
                        inputType:'password',
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
                    }
                ]
		});
var container = new Ext.Panel({
    frame:true,
    layout:'column',
    width:550,
    //autoHeight:true,
    height:280,
    buttonAlign:"center",
    items:[
        {columnWidth:0.45,height:230,style:"background-image:url('/images/timg.png');background-size:100% 100%;"},
        {columnWidth:0.45,height:65},
        content,
    ],
    buttons:[
        {
            text:'登陆',
            width:100,
            height:40,
            handler:function(){
                if(content.getForm().isValid()){
                    content.getForm().submit({
                        success:function(form,record){
                            var re = Ext.decode(record.response.responseText);
                            window.location.href=re.msg;
                        },
                        failure:function(form,record){
                            var re = Ext.decode(record.response.responseText);
                            Ext.Msg.alert('错误',re.msg);
                        }
                    });
                }
            }
        },
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        {
            text:'重置',
            width:100,
            height:40,
            handler:function(){
                Ext.getCmp("username").setValue();
                Ext.getCmp("password").setValue();
                Ext.getCmp('username').focus(true,100);
            }
        }
    ]
});
var logwin = new Ext.Window({
		 title:"登陆",
         frame:true,
         resizabel:false,
         modal:false,
         draggable:false,
         shadow:"drop",
         shadowOffset:10,
         id:'logwin',
         autoWidth:true,
         autoHeight:true,
         closable:false,
         items:[container]
		});
logwin.show();
Ext.getCmp('username').focus(true,500);
var keyfunction = function(file,e){
    console.log(file);
	if(e.getKey() == e.ENTER)
	{
		if(content.getForm().isValid()){
      	  content.getForm().submit({
          	  success:function(form,record){
          		  var re = Ext.decode(record.response.responseText);
          		window.location.href=re.msg;
          	  },
          	  failure:function(form,record){
          		  var re = Ext.decode(record.response.responseText);
          		  Ext.Msg.alert('错误',re.msg);
          	  }
            });
      	  }
	}
};
