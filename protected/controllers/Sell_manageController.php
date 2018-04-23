<?php
class Sell_manageController extends Controller{

	/*
	 * 获取销售单
	 */
	public function actionGettable(){
		if(myconfig::checkpermission(myconfig::$sellmanage, myconfig::$selltable))
		{
			$head = array("table_id"=>"id","create_time"=>"createdate","confirm_time"=>"confirmdate","total_price"=>"all_sell_price","get_money"=>"all_get_price");//外部表明对应数据库列名。不把数据库列名暴露
			$check_class = "table_id"; //查询的类别


			$sort = 'table_id';         //顺序的类别
			$dir = 'ASC';                 //升序还是降序
			$key = '';                    //查找的关键字
			$start = 0;                   //记录从第几条开始
			$limit = 15;                  //查询几条记录
			$id = 0;                     //产品序号
			if(isset($_POST['sort']))
			$sort = $_POST['sort'];
			if(isset($_POST['dir']))
			$dir = $_POST['dir'];
			if(isset($_POST['start']))
			$start = $_POST['start'];
			if(isset($_POST['limit']))
			$limit = $_POST['limit'];
			if(isset($_POST['key']) && $_POST['key'] != "" && $_POST['check_class'] != "")
			$key = $_POST['key'];
			if(isset($_POST['check_class']) && $_POST['check_class'] != "")
			$check_class = $_POST['check_class'];


			$check_class = $head["$check_class"];
			$sort = $head["$sort"];
			$data = array();
			$count = 0;

			if($key != '')
			{
				$sql = "select * from {{sell_table}} where $check_class like '$key%' and cid={$this->cid} order by $sort $dir limit $start,$limit";
				$count = Sell_table::model()->count("$check_class like '$key%' and cid={$this->cid}");
			}
			else
			{
				$sql = "select * from {{sell_table}} where cid={$this->cid} order by $sort $dir limit $start,$limit";
				$count = Sell_table::model()->count("cid={$this->cid}");
			}
			$tables = Sell_table::model()->findAllBySql($sql);
			if(count($tables) > 0)
			{
				foreach($tables as $table){
					$id++;
					$table_id = $table->id;
					$createtiem = $table->createdate;
					$confirmtime = $table->confirmdate;
					$totalprice = $table->all_sell_price;
					$get_money = $table->all_get_price;
					$remark = $table->remark;
					$status = $table->status;
					$data[] = array("table_id"=>$table_id,"status"=>$status,"table_count"=>$id,"create_time"=>$createtiem,"confirm_time"=>$confirmtime,"total_price"=>$totalprice,"get_money"=>$get_money,"remark"=>$remark,"");
				}
			}
			$result = array('count'=>$count,'data'=>$data);
			echo CJSON::encode($result);
		}
	}
	/*
	 * 打印销售单
	 */
	public function actionPrinttable(){
		if(myconfig::checkpermission(myconfig::$sellmanage, myconfig::$selltable))
		{
			$head = array("table_id"=>"id","create_time"=>"createdate","confirm_time"=>"confirmdate","total_price"=>"all_sell_price","get_money"=>"all_get_price");//外部表明对应数据库列名。不把数据库列名暴露
			$check_class = "table_id"; //查询的类别



			$key = '';                    //查找的关键字

			if(isset($_GET['key']) && $_GET['key'] != "" && $_GET['check_class'] != "")
				$key = $_GET['key'];
			if(isset($_GET['check_class']) && $_GET['check_class'] != "")
				$check_class = $_GET['check_class'];


			$check_class = $head[$check_class];
			$data = array();
			if($key != '')
			{
				$sql = "select * from {{sell_table}} where $check_class like '$key%' and cid={$this->cid}";
			}
			else
			{
				$sql = "select * from {{sell_table}} where cid={$this->cid}";
			}
			$tables = Sell_table::model()->findAllBySql($sql);
			$all_money = 0;
			$all_get_money = 0;
			if(count($tables) > 0)
			{
				foreach($tables as $table){
					$createtiem = $table->createdate;
					$confirmtime = $table->confirmdate;
					$totalprice = $table->all_sell_price;
					$all_money += $totalprice;
					$get_money = $table->all_get_price;
					$all_get_money += $get_money;
					$remark = $table->remark;
					$data[] = array("create_time"=>$createtiem,"confirm_time"=>$confirmtime,"total_price"=>$totalprice,"get_money"=>$get_money,"remark"=>$remark);
				}
				$data [] = array("总计","",round($all_money,2),round($all_get_money,2),"");
			}
			$title = array("打印时间"=>date("Y-m-d H:i:s",time()));
			$head = array(
				array("width"=>170,"data"=>"创建日期"),
				array("width"=>170,"data"=>"确认日期"),
				array("width"=>70,"data"=>"总金额"),
				array("width"=>70,"data"=>"收的金额"),
				array("width"=>70,"data"=>"备注")
			);
			$result = array("head"=>$head,"table"=>$data,"hTitle"=>$title,'ti'=>"销售单");
			$this->printPage($result);

		}
	}
	/*
	 * 获取销售单的子项
	 */
	public function actionGetitems(){
		if(myconfig::checkpermission(myconfig::$sellmanage, myconfig::$selltable))
		{
			$count = 0;
			$data = array();
			$start = 0;
			$limit = 15;
			$id = 0;
			if(isset($_POST['table_id']))
			{
				//var product_in_items_index = [{name:'table_item_id'},{name:'table_item_code'},{name:'table_item_name'},{name:'table_item_num',type:'float'},{name:'table_item_price',type:'float'},{name:'table_item_remark',type:'string'}];

				$head = array("table_item_catagoryname"=>"catagory.name","table_item_id"=>"t.id","table_item_code"=>"product.code","table_item_name"=>"product.name","table_item_num"=>"t.sell_num","table_item_price"=>"t.sell_price","table_item_discount"=>"discount","table_item_remark"=>"t.remark");//外部表明对应数据库列名。不把数据库列名暴露
				$check_class = "table_item_id"; //查询的类别


				$sort = 'table_item_id';         //顺序的类别
				$dir = 'ASC';                 //升序还是降序
				$key = '';                    //查找的关键字
				$start = 0;                   //记录从第几条开始
				$limit = 15;                  //查询几条记录
				$id = 0;                     //产品序号
				if(isset($_POST['sort']))
				$sort = $_POST['sort'];
				if(isset($_POST['dir']))
				$dir = $_POST['dir'];
				if(isset($_POST['start']))
				$start = $_POST['start'];
				if(isset($_POST['limit']))
				$limit = $_POST['limit'];
				if(isset($_POST['key']) && $_POST['key'] != "" && $_POST['check_class'] != "")
				$key = $_POST['key'];
				if(isset($_POST['check_class']) && $_POST['check_class'] != "")
				$check_class = $_POST['check_class'];


				$check_class = $head["$check_class"];
				$sort = $head["$sort"];

				$table_id = $_POST['table_id'];
				$sql = array(
					'condition'=>"table_id = $table_id and $check_class like '$key%' and t.cid={$this->cid}",
					'order'=>"$sort $dir",
					'limit'=>"$limit",
					'offset'=>"$start",
				);
				$sql_count = array(
					'condition'=>"table_id = $table_id and $check_class like '$key%' and t.cid={$this->cid}",
				);
				//$sql = "select * from {{product_in_items}},{{product}} where table_id = $table_id and $check_class like '$key' order by $sort $dir limit $start,$limit ";
				$items = Sell_items::model()->with('product','product.catagory')->findAll($sql);
				$count = Sell_items::model()->with('product','product.catagory')->count($sql_count);
				if(count($items) > 0)
				{
					foreach($items as $item)
					{
						//var product_in_items_index = [{name:'table_item_id'},{name:'table_item_code'},{name:'table_item_name'},{name:'table_item_num'},{name:'table_item_price'},{name:'table_item_remark'}];
						$id++;
						$table_item_id = $item->id;
						$table_item_code = $item->product->code;
						$table_item_name = $item->product->name;
						$table_item_num = $item->sell_num;
						$table_item_price = $item->sell_price;
						$table_item_catagoryname = $item->product->catagory->name;
						$table_item_discount = $item->discount;
						$table_item_pstatus = $item->product->status;
						$table_item_remark = $item->remark;
						$data[] = array("table_item_count"=>$id,"table_item_id"=>$table_item_id,"table_item_code"=>$table_item_code,"table_item_name"=>$table_item_name,"table_item_catagoryname"=>$table_item_catagoryname,"table_item_num"=>$table_item_num,"table_item_price"=>$table_item_price,"table_item_pstatus"=>$table_item_pstatus,"table_item_discount"=>$table_item_discount,"table_item_remark"=>$table_item_remark);

					}
				}

			}
			$result = array('count'=>$count,'data'=>$data);
			echo CJSON::encode($result);
		}
	}


	/*
	 * 获取销售单的子项
	 */
	public function actionPrintitems(){
		if(myconfig::checkpermission(myconfig::$sellmanage, myconfig::$selltable))
		{
			$data = array();
			if(isset($_GET['table_id']))
			{
				//var product_in_items_index = [{name:'table_item_id'},{name:'table_item_code'},{name:'table_item_name'},{name:'table_item_num',type:'float'},{name:'table_item_price',type:'float'},{name:'table_item_remark',type:'string'}];

				$head = array("table_item_catagoryname"=>"catagory.name","table_item_id"=>"t.id","table_item_code"=>"product.code","table_item_name"=>"product.name","table_item_num"=>"t.sell_num","table_item_price"=>"t.sell_price","table_item_discount"=>"discount","table_item_remark"=>"t.remark");//外部表明对应数据库列名。不把数据库列名暴露
				$check_class = "table_item_id"; //查询的类别


				$key = '';
				if(isset($_GET['key']) && $_GET['key'] != "" && $_GET['check_class'] != "")
					$key = $_GET['key'];
				if(isset($_GET['check_class']) && $_GET['check_class'] != "")
					$check_class = $_GET['check_class'];


				$check_class = $head[$check_class];
				$table_id = $_GET['table_id'];
				$sql = array(
					'condition'=>"table_id = $table_id and $check_class like '$key%' and t.cid={$this->cid}"
				);
				$items = Sell_items::model()->with('product','product.catagory','table')->findAll($sql);
				$all_price = 0;
				$all_count = 0;
				if(count($items) > 0)
				{
					foreach($items as $item)
					{
						//var product_in_items_index = [{name:'table_item_id'},{name:'table_item_code'},{name:'table_item_name'},{name:'table_item_num'},{name:'table_item_price'},{name:'table_item_remark'}];;
						$table_item_code = $item->product->code;
						$table_item_name = $item->product->name;
						$table_item_num = $item->sell_num;
						$all_count += $item->sell_num;
						$table_item_price = $item->sell_price;
						$all_price += $item->sell_price;
						$table_item_catagoryname = $item->product->catagory->name;
						$table_item_discount = round($item->discount,2);
						$table_item_remark = $item->remark;
						$data[] = array("table_item_code"=>$table_item_code,"table_item_name"=>$table_item_name,"table_item_catagoryname"=>$table_item_catagoryname,"table_item_num"=>$table_item_num,"table_item_price"=>$table_item_price,"table_item_discount"=>$table_item_discount,"table_item_remark"=>$table_item_remark);
					}
					$createtiem = $item->table->createdate;
					$confirmtime = $item->table->confirmdate;
					$data[] = array("总计","","",$all_count,$all_price,"","");
					$title = array("打印时间"=>date("Y-m-d H:i:s",time()),"销售单日期"=>$createtiem,"确认日期"=>$confirmtime);
					$head = array(
						array("width"=>170,"data"=>"编号"),
						array("width"=>120,"data"=>"名称"),
						array("width"=>70,"data"=>"分类名"),
						array("width"=>50,"data"=>"数量"),
						array("width"=>70,"data"=>"售出价格"),
						array("width"=>50,"data"=>"折扣"),
						array("witdh"=>50,"data"=>"备注")
					);
					$result = array("head"=>$head,"table"=>$data,"hTitle"=>$title,'ti'=>"销售单详情");
					$this->printPage($result);
				}

			}
		}
	}


	/*
	 * 删除销售单
	 */
	public function actionRemovetable(){
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$sellmanage, myconfig::$selltable))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['table_id']))
			{
				$id = $_POST['table_id'];
				$table = Sell_table::model()->find("id = $id and cid={$this->cid}");
				if($table != NULL)
				{
					if($table->status == 0)
					{
						$items = $table->items;
						if(count($items) > 0)
						{
							foreach ($items as $item)
							{
								$item->product->stock->available_quantity += $item->sell_num;
								$item->product->stock->save();
							}
						}
						$table->delete();
						$result = array("success"=>true,"msg"=>"删除成功");
					}
					else
					{
						$result = array("success"=>false,"msg"=>"进货单已经确认");
					}
				}
				else
				{
					$result = array("success"=>false,"msg"=>"无此ID表单");
				}

			}
			else
			{
				$result = array("success"=>false,"msg"=>"错误访问");
			}
		}
			echo CJSON::encode($result);
		
	}
	/*
	 * 确认销售单
	 */
	public function actionConfirmtable(){
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$sellmanage, myconfig::$selltable))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['table_id']))
			{
				$id = $_POST['table_id'];
				$get_money = $_POST['get_money'];
				$table = Sell_table::model()->find("id = $id and cid={$this->cid}");
				if($table != NULL && $table->status == 0)
				{
					$items = $table->items;
					if(count($items) > 0)
					{
						foreach($items as $item)
						{
							$product = $item->product;
							$stock = $product->stock;
							$stock->quantity -= $item->sell_num;
							//$stock->available_quantity -= $item->sell_num;
							$stock->save();
						}
					}
					$table->confirmdate = date("Y-m-d,H:i:s");
					$table->all_get_price = $get_money;

					$table->status = 1;
					$table->save();
					$result = array("success"=>true,"msg"=>"确认成功");
				}
				else
				{
					$result = array("success"=>false,"msg"=>"无此ID表单或表单已经确认");
				}

			}
			else
			{
				$result = array("success"=>false,"msg"=>"错误访问");
			}
		}
			echo CJSON::encode($result);
		
	}
	/*
	 * 添加销售单
	 */
	public function actionAddtable()
	{
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$sellmanage, myconfig::$selltable))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['data']))
			{
				$datas = CJSON::decode($_POST['data']);
				$table = new Sell_table();
				$table->createdate = date("Y-m-d H:i:s");
				$table->remark = $_POST['remark'];
				$table->cid = $this->cid;
				$table->user_id = Yii::app()->session['id'];//*******以后输入销售员ID
				$table->save();
				foreach($datas as $data)
				{
					$item = new Sell_items();
					$item->cid = $this->cid;
					$code = $data['table_item_code'];
					$product = Product::model()->find("status = 1 and code = $code and cid={$this->cid}");
					if($product != NULL)
					{
						$item->product_id = $product->id;
						$item->sell_num = $data['table_item_num'];
						$item->sell_date = date("Y-m-d,H:i:s");
						$item->sell_price = $data['table_item_price'];
						$item->in_price = $product->av_inprice;
						$item->profit = ($data['table_item_price'] - $product->av_inprice) * $data['table_item_num'];
						$item->table_id = $table->id;
						$item->discount = $data['table_item_discount'];
						$item->remark = $data['table_item_remark'];
						$product->stock->available_quantity -= $data['table_item_num'];
						$product->stock->save();
						$item->save();
						$D_value = $item->sell_num * $item->sell_price;
						$I_value = $item->sell_num * $product->av_inprice;
						$table->all_sell_price += $D_value;
						$table->all_in_price += $I_value;
					}
				}
				$table->save();
				$result = array("success"=>true,"msg"=>"添加成功");
			}
			else
			{
				$result = array("success"=>false,"msg"=>"错误访问");
			}
		}
			echo CJSON::encode($result);
		
	}
	/*
	 * 确认表单子项
	 */
	public function actionConfirmitems()
	{
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$sellmanage, myconfig::$selltable))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['data']) && isset($_POST['table_id']))
			{
				$table_id = $_POST['table_id'];
				$table = Sell_table::model()->find("id = $table_id and cid={$this->cid}");
				if($table != NULL && !$table->status)
				{
					$datas = CJSON::decode($_POST['data']);
					foreach($datas as $data)
					{
						$id = $data['table_item_id'];
						$item = Sell_items::model()->find("id = $id and cid={$this->cid}");
						if($item != NULL)
						{
							$code = $data['table_item_code'];
							$product = Product::model()->find("status = 1 and code = $code and cid={$this->cid}");
							if($product != NULL)
							{
								$item->product_id = $product->id;
								$I_value = $item->sell_num * $item->in_price;
								$D_value = $item->sell_num * $item->sell_price;
								$item->product->stock->available_quantity += $item->sell_num;
								$item->product->stock->save();
								$item->sell_date = date("Y-m-d,H:i:s");
								$item->sell_num = $data['table_item_num'];
								$item->sell_price = $data['table_item_price'];
								$item->in_price = $product->av_inprice;
								$item->profit = ($data['table_item_price'] - $product->av_inprice) * $data['table_item_num'];
								$item->discount = $data['table_item_discount'];
								$item->remark = $data['table_item_remark'];
								$item->save();
								$product->stock->available_quantity -= $item->sell_num;
								$product->stock->save();
								$D_value -= $item->sell_num * $item->sell_price;
								$I_value -= $item->sell_num * $item->in_price;
								$item->table->all_sell_price -= $D_value;
								$item->table->all_in_price -= $I_value;
								$item->table->save();
							}
						}
						else
						{
							$item = new Sell_items();
							$item->cid = $this->cid;
							$code = $data['table_item_code'];
							$product = Product::model()->find("status = 1 and code = $code and cid={$this->cid}");
							if($product != NULL)
							{
								$item->product_id = $product->id;
								$item->sell_date = date("Y-m-d,H:i:s");
								$item->sell_num = $data['table_item_num'];
								$item->sell_price = $data['table_item_price'];
								$item->in_price = $product->av_inprice;
								$item->profit = ($data['table_item_price'] - $product->av_inprice) * $data['table_item_num'];
								$item->discount = $data['table_item_dicount'];
								$item->table_id = $_POST['table_id'];
								$item->remark = $data['table_item_remark'];
								$item->save();
								$product->stock->available_quantity -= $item->sell_num;
								$product->stock->save();
								$I_value = $item->sell_num * $product->av_inprice;
								$D_value = $item->sell_num * $item->sell_price;
								$item->table->all_sell_price += $D_value;
								$item->table->all_in_price += $I_value;
								$item->table->save();
							}
						}
					}
					$result = array("success"=>true,"msg"=>"修改成功");
				}
				else
				{
					$result = array("success"=>false,"msg"=>"不存在此进货单或进货单已经确认");
				}
			}
			else
			{
				$result = array("success"=>false,"msg"=>"错误访问");
			}
		}
			echo CJSON::encode($result);
		
	}

	/*
	 * 删除表单子项
	 */
	public function actionRemoveitems(){
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$sellmanage, myconfig::$selltable))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['item_id']))
			{
				$id = $_POST['item_id'];
				$item = Sell_items::model()->find("id = $id and cid={$this->cid}");
				if($item != NULL && !$item->table->status)
				{
					$item->table->all_sell_price -= $item->sell_num * $item->sell_price;
					$item->table->all_in_price -= $item->sell_num * $item->in_price;
					$item->table->save();
					$item->product->stock->available_quantity += $item->sell_num;
					$item->product->stock->save();
					$item->delete();
					$result = array("success"=>true,"msg"=>"删除成功");
				}
				else
				{
					$result = array("success"=>false,"msg"=>"无此ID子项或此进货单已经确认");
				}

			}
			else
			{
				$result = array("success"=>false,"msg"=>"错误访问");
			}
		}
			echo CJSON::encode($result);
		
	}
	/*
	 * 修改销售单备注
	 */
	public function actionChangeremark()
	{
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$sellmanage, myconfig::$selltable))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['table_id']) && $_POST['remark'])
			{
				$id = $_POST['table_id'];
				$table = Sell_table::model()->find("id = $id and cid={$this->cid}");
				if($table != NULL)
				{
					$table->remark = $_POST['remark'];
					$table->save();
					$result = array("success"=>true,"msg"=>"修改成功");
				}
				else
				{
					$result = array("success"=>false,"msg"=>"无此ID进货单");
				}
			}
			else
			{
				$result = array("success"=>false,"msg"=>"错误访问");
			}
		}
			echo CJSON::encode($result);
		
	}
}