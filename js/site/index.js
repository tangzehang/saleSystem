Ext.onReady(function(){
    var rootNode = new Ext.tree.AsyncTreeNode({
        expanded:true,
        text:'Root',
        id:'root'
    });
    var tree =  new Ext.tree.TreePanel({
        rootVisible:false,
        dataUrl:'/site/gettree',
        title:'菜单',
        root:rootNode,
        useArrows:true,
        singleExpand:true,
        trackMouseOver:true,
        region:'west',
        frame:true,
        collapsible: true,
        titleCollapse:true,
        width:150
    });
    tree.on({
        'click':function(node){
            if(node.leaf)
            {
                centerpanel.setTitle(node.text);
                if(node.attributes.action != "" )
                {
                    Ext.getDom('cf').src ='/'+node.attributes.action;
                }
                centerpanel.doLayout();
            }
        }
    });
    var centerpanel = new Ext.Panel({
        region:'center',
        title:'内容',
        collapsible: true,
        frame:true,
        bodyStyle: '',
        titleCollapse:true,
        collapseMode:'mini',
        contentEl : 'cf'
        //html:"<iframe id = 'cf' style='height:100%;width:100%' frameborder='0' scrolling='auto'></iframe>"
    });
    new Ext.Viewport({
        layout:'border',
        items:[
            tree,
            centerpanel,
            {
                id:'toppanel',
                collapsible: true,
                collapsed :false ,
                region:'north',
                title:'标题栏',
                html:"<b>Hello,Welcome!"+window.user+"<a style='float:right' href='/log/logout'><font color='red'>注销</font></a>",
                height:60,
                frame:true,
                titleCollapse:true
            }

        ]
    });
});