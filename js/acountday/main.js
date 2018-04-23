Ext.onReady(function(){
    Ext.QuickTips.init();
    var acount_day_viewport = new Ext.Viewport({
        layout:'border',
        id:"sell_viewport",
        items:[
            day_manage_panel,
            day_manage_items_panel
        ]
    });
})