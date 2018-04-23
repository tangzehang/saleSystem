Ext.onReady(function(){
    var store = new Ext.data.Store({
        data:[
            [
                1,
                "office space",
                "mike judege",
                "1999-02-19",
                1,
                "work sucks",
                "19.95",
                1
            ],
            [
                3,
                "super troopers",
                "jay chandrasekhar",
                "2002-02-15",
                1,
                "altered state police",
                "14.95",
                1
            ]
        ],
        reader:new Ext.data.ArrayReader({id:'id'},[
                'id',
                'title',
                'director',
                {name:'released',type:'date',dateFormat:'Y-m-d'},
                'genre',
                'tagline',
                'price',
                'available'
            ]
        )
    })
    var grid = new Ext.grid.GridPanel({
        renderTo:document.body,
        frame:true,
        title:'Movie database',
        height:200,
        width:500,
        store:store,
        columns:[
            {header:'Title',dataIndex:'title'},
            {header:'Director',dataIndex:'director'},
            {header:'Release',dataIndex:'released',
                renderer:Ext.util.Format.dateRenderer('m/d/Y')},
            {header:'Genre',dataIndex:'genre'},
            {header:'Tagline',dataIndex:'tagline'}
        ]
    })


})