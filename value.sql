insert into tbl_menu(id,name,parentid,haschild,action,icon) VALUES(100001,'用户管理',0,1,' ','/images/icon/Userm.png'),
                                                                                         (200001,'账户管理',100001,0,'user/manage','/images/icon/User.png'),
                                                             (100002,'产品管理',0,1,' ','/images/icon/Producem.png'),
															                             (300001,'货物管理',100002,0,'product/list','/images/icon/produces.png'),
																						 (300002,'库存管理',100002,0,'product/stock','/images/icon/Stock.png'),
															 (100003,'销售管理',0,1,' ','/images/icon/Salem.png'),
																						 (400001,'销售系统',100003,0,'sell/system','/images/icon/Sys.png'),
																						 (400002,'售货管理',100003,0,'sell/manage','/images/icon/Salem.png'),
															 (100004,'结算管理',0,1,' ','/images/icon/Sum.png'),
																						 (500001,'销售结算',100004,0,'acount/day','/images/icon/Sales.png');
																						 /*,
																						 (500002,'月销售结算',100004,0,'acount/month'),
																						 (500003,'年销售结算',100004,0,'acount/year'),
															 (100005,'业绩管理',0,1,' '),
																						 (600001,'销售员业绩',100005,0,'score/seller'),
															 (100006,'工资管理',0,1,' '),
																						 (700001,'基本设置',100006,0,'salary/set'),
																						 (700002,'工资查看',100006,0,'salary/check');
																						 */
insert into tbl_user(username,name,password,root,cid) values('test','测试',md5('123456'),0,0),('test1','测试1',md5('123456'),0,1);


insert into tbl_catagory(name) values('临时分类'),('饮料'),('香烟');
insert into tbl_catagory(name,cid) values('临时分类1',1),('饮料1',1),('香烟1',1);


insert into tbl_product(catagoryid,code,name,av_inprice,last_inprice,exprice,standard,unit) values(2,'111','可口可乐',48,48,52,'1*24','件'),
                                                                                                  (2,'222','百事可乐',48,48,52,'1*24','件'),
																								  (3,'333','芙蓉王',205,205,221,'1*10','条'),
																								  (3,'444','五叶神',98,98,110,'1*10','条');
insert into tbl_product(catagoryid,code,name,av_inprice,last_inprice,exprice,standard,unit,cid) values(5,'111','可口可乐1',48,48,52,'1*24','件',1),
                                                                                                  (5,'222','百事可乐1',48,48,52,'1*24','件',1),
																								  (6,'333','芙蓉王1',205,205,221,'1*10','条',1),
																								  (6,'444','五叶神1',98,98,110,'1*10','条',1);



insert into tbl_stock(product_id) values(1),(2),(3),(4);

insert into tbl_stock(product_id,cid) values(5,1),(6,1),(7,1),(8,1);


insert into tbl_product_in_table(createdate,confirmdate,status,totalprice) values('2013-11-11,00:00:00',null,0,72),
                                                                                 ('2013-11-12,00:00:00','2013-11-12,11:11:11',1,80);

insert into tbl_product_in_table(createdate,confirmdate,status,totalprice,cid) values('2013-11-11,00:00:00',null,0,72,1),
                                                                                 ('2013-11-12,00:00:00','2013-11-12,11:11:11',1,80,1);


insert into tbl_product_check_table(createdate,confirmdate,status) value('2013-11-11,00:00:00',null,0),
																		('2013-11-11,11:11:11','2013-11-11,12:00:00',1);

insert into tbl_product_check_table(createdate,confirmdate,status,cid) value('2013-11-11,00:00:00',null,0,1),
																		('2013-11-11,11:11:11','2013-11-11,12:00:00',1,1);
insert into tbl_product_in_items(table_id,product_id,product_num,product_price) values(1,1,1,10),
                                                                                      (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,1,1,10),
																					  (1,2,4,10.5),
																					  (2,1,4,10),
																					  (2,2,4,10);
																					  
insert into tbl_product_check_items(table_id,product_id,product_num,check_num,check_date) values(1,1,1,1,'2013-11-11'),
																								(2,2,1,1,'2013-11-12');	

insert into tbl_permission2role(role_id,group_id,mask) value (0,0,'1'),
															 (0,1,'11'),
															 (0,2,'11'),
															 (0,3,'1'),
															 (1,2,'11'),
															 (2,1,'11');