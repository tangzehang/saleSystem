Ext.onReady(function(){
    Ext.QuickTips.init();

    var usermanage = new Ext.grid.EditorGridPanel({
        renderTo:document.body,
        store:store,
        id:'editgrid',
        height:300,
        clicksToEdit:2,
        stripeRows:true,
        sm:new Ext.grid.RowSelectionModel({
            singleSelect:true
        }),
        resizabel:true,
        frame:true,
        tbar:tbar,
        bbar:new Ext.PagingToolbar({
            pageSize: 15,
            store:store,
            displayInfo:true,
            displayMsg:'显示 {0}-{1}条记录，共{2}条',
            emptyMsg:'没有记录'
        }),
        columns:column,
        listeners:{
            click:function(){
                var re = usermanage.getSelectionModel().getSelected();
                if(re)
                {
                    if(Ext.get('remove'))
                        Ext.getCmp('remove').setDisabled(false);
                }
            },
            afteredit:function(a){
                if(usermanage.getStore().modified.length>0){
                    if(Ext.get('save'))
                        Ext.getCmp('save').setDisabled(false);
                }
            }
        }
    });

})