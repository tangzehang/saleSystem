drop database if exists `store`;
create database `store`;
use store
/*
创建产品表
*/
create table `tbl_catagory`(
`id`     int(10)          not null auto_increment,
`name`   varchar(255) not null,    /*分类名*/
`status` int(2)       not null default 1,/*状态，0表示删除，1表示正常*/
`cid`      int(10) not null default 0,          /*公司id*/
`updatetime` timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP ,
primary key(id),
key (cid)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;



create table  `tbl_product`(
`id`       int(10)      not null auto_increment,   
`catagoryid` int(10)      not null,                  /*产品分类*/
`code`     varchar(255)  not null,                 /*商品条码*/
`name`     varchar(255)  not null,                 /*商品名称*/
`last_inprice`  decimal(20,2) not null default 0,       /*最新进货价*/
`av_inprice` decimal(20,2) not null default 0,     /*平均进货价*/
`exprice`  decimal(20,2) not null default 0,       /*出售价*/
`standard` varchar(255)  null,                     /*规格*/
`unit`     varchar(10)   null,                    /*单位*/
`cid`      int(10) not null default 0,          /*公司id*/
`status`   int(2)       not null default 1,/*状态，1表示可用，0表示删除*/
`updatetime` timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP ,
primary key(`id`),
key (cid)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
/*
创建用户表
*/

create table `tbl_user`(
`id`            int(10)     unsigned not null  auto_increment,
`username`      varchar(255) not null,    /*用户名(登陆）*/
`name`          varchar(255) not null,    /*名字*/
`password`      varchar(255) not null,    /*密码*/
`root`          int(10) not null default 0,/*身份*/
`cid`      int(10) not null default 0,          /*公司id*/
`status`        int(2)  not null default 1,/*状态，1表示正常，0表示删除*/
`updatetime` timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP ,
primary key(`id`),
key (cid)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

/*
权限表
*/
create table `tbl_permission2role`(
`id`			int(10)		unsigned not null auto_increment,
`role_id`		int(10)		not null,
`group_id`		int(10)		not null,
`mask`			varchar(15)	not null,
primary key(id),
key(`role_id`),
key(`group_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

/*
创建菜单表
*/
create table `tbl_menu`(
`id`          int(10)        not null,
`name`        varchar(255)   not null,    /*菜单名字*/
`parentid`    int(10)        not null default 0,/*首菜单ID*/
`haschild`    bool           not null default 0,/*是否有子菜单*/
`icon`        varchar(255)  not null default '/images/disk.png',/*图标*/
`action`      varchar(255)  not null default '#',              /*活动的url*/
primary key(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
/*
创建存货表
*/
create table `tbl_stock`(
`product_id`         int(11) not null,     /*产品的id*/
`quantity`           int(11) not null default 0,/*数量*/
`available_quantity` int(11) not null default 0,/*可用数量*/
`has_parent`         int(1)  not null default 0,/*是否散装产品*/
`parent_id`          int(11) not null default -1,/*整装产品的ID*/
`product_num`        int(11) not null default 0,/*散装数量 */
`cid`      int(10) not null default 0,
`updatetime` timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP ,
primary key(`product_id`),
key (cid)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE tbl_stock ADD FOREIGN KEY(`product_id`) REFERENCES tbl_product(`id`) ON DELETE CASCADE;

/*
创建进货单
*/
create table `tbl_product_in_table`(
`id`               int(11) not null auto_increment,
`createdate`       datetime    not null,   /*创建时间*/
`confirmdate`       datetime    null,       /*确认时间*/
`status`           int(2)  not null default 0,/*进货单状态，0表示未确定，1表示已经确认*/
`totalprice`       decimal(20,2) not null default 0,/*总金额*/
`user_id`    int(11) null,/*最后操作者的用户id*/
`remark`           text    null,
`cid`      int(10) not null default 0,
`updatetime` timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP ,
primary key(`id`),
key (cid)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*
创建进货子项表
*/
create table `tbl_product_in_items`(
`id`              int(11) not null auto_increment,
`table_id`        int(11) not null,/*订单的ID*/
`product_id`      int(11) not null,/*产品的ID*/
`product_num`     decimal(20,2) not null default 0,/*产品的数量*/
`product_price`   decimal(20,2) not null default 0,/*产品的价格*/
`user_id`    int(11) null,/*最后操作者的用户id*/
`remark`          text   null,/*备注*/
`cid`      int(10) not null default 0,
`updatetime` timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP ,
primary key(`id`),
key (cid)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE tbl_product_in_items ADD FOREIGN KEY(`product_id`) REFERENCES tbl_product(`id`) ON DELETE CASCADE;
ALTER TABLE tbl_product_in_items ADD FOREIGN KEY(`table_id`)   REFERENCES tbl_product_in_table(`id`) ON DELETE CASCADE;
/*
创建盘点单
*/
create table `tbl_product_check_table`(
`id`            int(11)  not null auto_increment,
`createdate`    datetime     not null ,/*创建日期*/
`confirmdate`   datetime     null    ,/*确认日期*/
`status`        int(2)   not null default 0,/*状态，0表示未确认，1表示确认*/
`user_id`    int(11) null,/*最后操作者的用户id*/
`remark`        text     null,/*备注*/
`cid`      int(10) not null default 0,
`updatetime` timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP ,
primary key(`id`),
key (cid)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*
创建盘点子项表
*/
create table `tbl_product_check_items`(
`id`           int(11) not null auto_increment,
`table_id`     int(11) not null,/*盘点单ID*/
`product_id`   int(11) not null,/*产品的ID*/
`product_num`  decimal(20,2) not null default 0,/*产品的数量*/
`check_num`    decimal(20,2) not null default 0,/*盘点的数量*/
`check_date`   datetime  not null,/*盘点的日期*/
`user_id`    int(11) null,/*最后操作者的用户id*/
`remark`       text, /*备注*/
`cid`      int(10) not null default 0,
`updatetime` timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP ,
primary key(`id`),
key (cid)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE tbl_product_check_items ADD FOREIGN KEY(`table_id`) REFERENCES tbl_product_check_table(`id`) ON DELETE CASCADE;
ALTER TABLE tbl_product_check_items ADD FOREIGN KEY(`product_id`) REFERENCES tbl_product(`id`) ON DELETE CASCADE;
/*
创建销售单
*/
create table `tbl_sell_table`(
`id`         int(11) not null auto_increment,
`createdate` datetime not null ,/*创建日期*/
`confirmdate` datetime  null,/*确认日期*/
`status`     int(2)  not null default 0,/*状态，0表示未确定，1表示已经确认，2表示已经清点过*/
`acount_id`  int(11) not null default 0,/*结算表的id*/
`all_in_price` decimal(20,2) not null default 0,/*所有产品的进货总价*/
`all_sell_price` decimal(20,2) not null default 0,/*所有产品的售货价*/
`all_get_price` decimal(20,2) not null default 0,/*收的钱数*/
`all_payback` decimal(20,2) not null default 0,/*找回的钱数*/
`user_id`    int(11) null,/*销售员id*/
`remark`         text,/*备注*/
`cid`      int(10) not null default 0,
`updatetime` timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP ,
primary key(`id`),
key (cid)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*
创建销售子项表
*/
create table `tbl_sell_items`(
`id`         int(11) not null auto_increment,
`sell_date`  datetime not null,/*出售时间*/
`product_id` int(11) not null,/*销售产品的ID*/
`table_id`   int(11) not null,/*销售表的ID*/
`sell_price` decimal(11,2) not null,/*销售价*/
`in_price`   decimal(11,2) not null,/*此时的进货价*/
`sell_num`   decimal(20,2) default 1.0,/*销售的数量*/
`profit`     decimal(20,2) default 0.0,/*利润*/
`discount`   decimal(5,4) default 1,/*折扣*/
`remark`     text,/*备注*/
`cid`      int(10) not null default 0,
`updatetime` timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP ,
primary key(`id`),
key (cid)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE tbl_sell_items ADD FOREIGN KEY(`table_id`) REFERENCES tbl_sell_table(`id`) ON DELETE CASCADE;
/*
创建日结算表
*/
create table `tbl_acountday_table`(
`id`       int(11) not null auto_increment,
`createdate` datetime not null,/*创建的日期*/
`confirmdate` datetime null,/*确认日期*/
`all_sell_price` decimal(20,2) not null default 0,/*总的销售额*/
`all_in_price`   decimal(20,2) not null default 0,/*总的进货价*/
`all_profit`     decimal(20,2) not null default 0,/*总利润*/
`status`    int(2) not null default 0,/*表单状态*/
`user_id`      int(11) not null,/*结算者的ID*/
`confirm_id`   int(11) not null,/*确认者的ID*/
`cid`      int(10) not null default 0,
`updatetime` timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP ,
primary key(`id`),
key (cid)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*
创建日结算表关联项
*/
create table `tbl_acountday_item`(
`id`		int(11)	not null auto_increment,
`table_id`	int(11) not null ,
`item_table_id`	int(11) not null ,
`cid`      int(10) not null default 0,
`updatetime` timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP ,
primary key(`id`),
key (cid)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE tbl_acountday_item add FOREIGN KEY(`item_table_id`) REFERENCES tbl_sell_table(`id`) ON DELETE CASCADE;
ALTER TABLE tbl_acountday_item add FOREIGN KEY(`table_id`) REFERENCES tbl_acountday_table(`id`) ON DELETE CASCADE;