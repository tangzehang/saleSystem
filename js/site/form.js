Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.form.VTypes['nameVal'] = /^[A-Z][A-Za-z\-]+[A-Z][A-Za-z\-]+$/;
    Ext.form.VTypes['nameMask'] = /[A-Za-z\-]/;
    Ext.form.VTypes['nameText'] = 'In-valid Director Name.';
    Ext.form.VTypes['name'] = function(v){
        return Ext.form.VTypes['nameVal'].test(v);
    }
    var genres = new Ext.data.SimpleStore({
        fields:['id','genres'],
        data : [['1','comedy'],['2','Drama'],['3','Action']]
    });
    var movie_form = new Ext.FormPanel({
        allowDomMove:true,
        url: 'myob/index.php/site/put',
        renderTo:document.body,
        frame:true,
        title:'movie',
        width:500,
        items:[

            new Ext.Toolbar({
                allowDomMove:true,
                items:[
                    {
                        xtype:'tbbutton',
                        text:'button',
                        cls:'x-btn-text-icon',
                        icon:'images/female.gif'

                    },
                    '->'
                    ,
                    {
                        xtype:'tbbutton',
                        text:'Menu button',
                        menu:[{
                            text:'better',
                            group:'a',
                            checked:true
                        },
                            {
                                text:'good',
                                group:'a',
                                checked:false
                            },
                            {
                                text:'best',
                                menu:[
                                    {
                                        text:'aa',
                                        group:'a',
                                        checked:false
                                    },
                                    {
                                        text:'bb',
                                        group:'a',
                                        checked:false
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype:'tbsplit',
                        text:'Split Button',
                        menu:[{
                            text:'Item one'
                        },
                            {
                                text:'Item two'
                            },
                            {
                                text:'Item three'
                            }
                        ]
                    }
                ]

            }),

            {
                xtype:'textfield',
                fieldLabel:'Title',
                name:'title',
                vtype:'name',
                allowBlank:false,
                listeners:
                {
                    specialkey:function(f,e){
                        if(e.getKey()==e.ENTER){
                            Ext.get('director').focus();
                        }
                    }

                }

            },
            {
                xtype:'textfield',
                fieldLabel:'Director',
                name:'director',
                id:'director',
            },
            {
                xtype:'datefield',
                fieldLabel:'Released',
                name:'released',
                disabledDays:[1,2,3,4,5],
                id:'released',
            },
            {
                xtype:'timefield',
                fieldLabel:'time',
                name:'time',
                id:'time',
            },
            {
                xtype:'combo',
                fieldLabel:'combo',
                name:'combo',
                mode:'local',
                store:genres,
                displayField:'genres',
                width:120,
                listeners:{
                    select:function(f,r,i){
                        Ext.Msg.alert('内容',r.data.genres);
                    }
                }

            },
            {
                xtype:'radio',
                fieldLabel:'Filmed In',
                name:'filmed_id',
                boxLabel:'color'
            },
            {
                xtype:'radio',
                hideLabel:false,
                labelSeparator:'',
                name:'filmed_id',
                boxLabel:'Black & white'
            },
            {
                xtype:'checkbox',
                fieldLabel:'Bad Movie',
                name:'bad_movie'
            },
            {
                xtype:'htmleditor',
                name:'textarea',
                hideLabel:true,
                labelSeparator:'',
                height:100,
                anchor:'100%'
            }]
        ,
        buttons:[{
            text:'save',
            handler:function(){
                movie_form.getForm().load({
                    url:'?r=site/getdata',
                })
            }

        },
            {
                text:'reset',
                handler:function(){
                    movie_form.getForm().reset();
                }

            }
        ]
    });


})
