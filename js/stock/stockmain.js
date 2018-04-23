Ext.onReady(function(){
    Ext.QuickTips.init();

    var usermanage = new Ext.grid.EditorGridPanel({
        renderTo:document.body,
        store:stock_store,
        id:'editgrid',
        autoWidht:true,
        height:400,
        clicksToEdit:2,
        stripeRows:true,
        sm:stock_sm,
        resizabel:true,
        frame:true,
        loadMask:true,
        tbar:stock_tbar,
        bbar:new Ext.PagingToolbar({
            pageSize: 15,
            store:stock_store,
            displayInfo:true,
            displayMsg:'显示 {0}-{1}条记录，共{2}条',
            emptyMsg:'没有记录'
        }),
        columns:stock_col
    });



})