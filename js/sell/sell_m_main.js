Ext.onReady(function(){
    Ext.QuickTips.init();

    var sell_manage_viewport = new Ext.Viewport({
        layout:'border',
        id:"sell_viewport",
        items:[
            sell_manage_panel,
            sell_manage_items_panel
        ]
    });

});