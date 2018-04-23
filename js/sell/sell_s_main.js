Ext.onReady(function(){
    Ext.QuickTips.init();

    var sell_mainpanel = new Ext.grid.EditorGridPanel({
        renderTo:document.body,
        store:sell_main_store,
        id:'editgrid',
        autoWidht:true,
        height:400,
        clicksToEdit:2,
        stripeRows:true,
        sm:sell_main_sm,
        resizabel:true,
        frame:true,
        loadMask:true,
        tbar:sell_main_tbar,
        bbar:sell_main_bbar,
        columns:sell_main_col,
        listeners:{
            render:function(a,b,c,d)
            {
                sell_main_add();
            },
            keydown:function(e)
            {
                if(e.getKey() == e.ENTER || e.getKey() == e.CTRL || e.getKey() == e.ALT)
                {
                    var se = sell_main_sm.getSelected();
                    if(se)
                    {
                        var cm = Ext.getCmp("editgrid").getColumnModel();
                        var su = check_record(se,cm);
                        var row = sell_main_store.indexOf(se);
                        if(su == 0)
                        {
                            if(e.getKey() == e.ENTER)
                                Ext.getCmp("editgrid").startEditing(row,5);
                            else if(e.getKey() == e.CTRL)
                                Ext.getCmp("editgrid").startEditing(row,6);
                            else
                                Ext.getCmp("editgrid").startEditing(row,8);
                        }
                        else
                            Ext.getCmp("editgrid").startEditing(row,su);
                    }
                }
            }
        }
    });

});