<?php
class AcountController extends Controller{
	public function actionDay(){
		if(myconfig::checkpermission(myconfig::$acountmanage, myconfig::$acount))
		{
			$this->render("Day");
		}
		else
		{
			echo "<script>alert('没有权限');</script>";
		}
	}

	public function actionDayTable()
	{
		if(myconfig::checkpermission(myconfig::$acountmanage, myconfig::$acount))
		{
			$head = array("table_id"=>"id","create_time"=>"createdate","confirm_time"=>"confirmdate","total_sell_price"=>"all_sell_price","total_income_price"=>"all_in_price","total_price"=>"all_price");//外部表明对应数据库列名。不把数据库列名暴露
			$check_class = "table_id"; //查询的类别


			$sort = 'create_time';         //顺序的类别
			$dir = 'DESC';                 //升序还是降序
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


			$check_class = $head[$check_class];
			$sort = $head["$sort"];
			$data = array();
			$count = 0;

			if($key != '')
			{
				$sql = "select * from {{acountday_table}} where $check_class like '$key%' and cid={$this->cid} order by $sort $dir limit $start,$limit";
				$count = Acountday::model()->count("{$check_class} like '{$key}%' and cid={$this->cid}");
			}
			else
			{
				$sql = "select * from {{acountday_table}} where  cid={$this->cid} order by $sort $dir limit $start,$limit";
				$count = Acountday::model()->count("cid={$this->cid}");
			}
			$tables = Acountday::model()->findAllBySql($sql);
			if(count($tables) > 0)
			{
				foreach($tables as $table){
					$id++;
					$table_id = $table->id;
					$createtiem = $table->createdate;
					$confirmtime = $table->confirmdate;
					$totalprice = $table->all_sell_price;
					$totalincomeprice = $table->all_in_price;
					$totalprofit = $table->all_profit;
					$userid = $table->user_id;
					$confirmid = $table->confirm_id;
					$status = $table->status;
					$data[] = array("table_id"=>$table_id,"status"=>$status,"table_count"=>$id,"create_time"=>$createtiem,"confirm_time"=>$confirmtime,"total_profit"=>$totalprofit,"total_sell_price"=>$totalprice,"total_income_price"=>$totalincomeprice,"userid"=>$userid,"confirmid"=>$confirmid);
				}
			}
			$result = array('count'=>$count,'data'=>$data);
			echo CJSON::encode($result);
		}
	}

	public function actionDayitem()
	{
		if(myconfig::checkpermission(myconfig::$acountmanage, myconfig::$acount))
		{
			$count = 0;
			$data = array();
			$offset = 0;
			$limit = 15;
			if(isset($_POST['limit']))
			$limit = $_POST['limit'];
			if(isset($_POST['offset']))
			$offset = $_POST['offset'];
			if(isset($_POST['table_id']))
			{
				$table_id = $_POST['table_id'];
				$sql = array(
			'condition'=>"table_id = $table_id and t.cid={$this->cid}",
			'limit'=>$limit,
			'offset'=>$offset
				);
				$count_sql = array(
			'condition'=>"table_id = $table_id and t.cid={$this->cid}"
				);
				$count = Acountday_item::model()->count($count_sql);
				$re = Acountday_item::model()->with('sell_table')->with('sell_table.items')->with('sell_table.items.product')->findAll($sql);
				if(count($re > 0))
				{
					foreach($re as $r)
					{
						foreach($r->sell_table->items as $item)
						{
							$table_item_id = $item->id;
							$product_name = $item->product->name;
							$product_num = $item->sell_num;
							$product_sell_price = $item->sell_price;
							$product_in_price = $item->in_price;
							$data[] = array("table_item_id"=>$table_item_id,"product_name"=>$product_name,"product_num"=>$product_num,"product_sell_price"=>$product_sell_price,"product_in_price"=>$product_in_price);
						}
					}
				}
			}
			$result = array('count'=>$count,'data'=>$data);
			echo CJSON::encode($result);
		}
	}


	public function actionPrintDayitem()
	{
		if(myconfig::checkpermission(myconfig::$acountmanage, myconfig::$acount))
		{
			$count = 0;
			$data = array();
			if(isset($_GET['table_id']))
			{
				$table_id = $_GET['table_id'];
				$sql = array(
					'condition'=>"t.table_id = $table_id and t.cid={$this->cid}"
				);
				$re = Acountday_item::model()->with('sell_table')->with('table')->with('sell_table.items')->with('sell_table.items.product')->findAll($sql);
				$all_price = 0;
				$all_count = 0;
				$all_inprice = 0;
				$all_profit = 0;
				if(count($re > 0))
				{
					foreach($re as $r)
					{
						foreach($r->sell_table->items as $item)
						{
							$product_name = $item->product->name;
							$product_num = $item->sell_num;
							$all_count += $item->sell_num;
							$all_price += $item->sell_price;
							$product_sell_price = $item->sell_price;
							$product_in_price = $item->in_price;
							$profit = $item->sell_price - $item->in_price;
							$all_inprice += $item->in_price;
							$data[] = array("product_name"=>$product_name,"product_num"=>$product_num,"product_sell_price"=>$product_sell_price,"product_in_price"=>$product_in_price,"profit"=>$profit);
						}
					}
					$createtiem = $r->table->createdate;
					$confirmtime = $r->table->confirmdate;

				}
				$all_profit = $all_price - $all_inprice;
				$data[] = array("总计",$all_count,$all_price,$all_inprice,$all_profit);
				$title = array("打印时间"=>date("Y-m-d H:i:s",time()),"结算单日期"=>$createtiem,"确认日期"=>$confirmtime);
				$head = array(
					array("width"=>120,"data"=>"名称"),
					array("width"=>50,"data"=>"数量"),
					array("width"=>70,"data"=>"售出价格"),
					array("width"=>70,"data"=>"进货价"),
					array("width"=>50,"data"=>"利润")
				);
				$result = array("head"=>$head,"table"=>$data,"hTitle"=>$title,'ti'=>"结算单详情");
				$this->printPage($result);
			}

		}
	}

	public function actionDayTableAdd()
	{
		$result = array("success"=>false,"msg"=>"未知错误");
		if(myconfig::checkpermission(myconfig::$acountmanage, myconfig::$acount))
		{
			$daytable = new Acountday();
			$daytable->cid = $this->cid;
			$daytable->createdate = date("Y-m-d H:i:s");
			$daytable->user_id = Yii::app()->session['id']; //以后修改的id
			$daytable->confirm_id = Yii::app()->session['id'] ;//以后修改id
			$sql = array(
			"condition"=>"status = 1 and cid={$this->cid}",
			"select"=>"id,all_in_price,all_sell_price,status"
			);
			$results = Sell_table::model()->findAll($sql);
			if(count($results) > 0)
			{
				$all_sell_price = 0;
				$all_in_price = 0;
				$daytable->save();
				$id = $daytable->id;
				foreach($results as $r)
				{
					$item = new Acountday_item;
					$item->table_id = $id;
					$item->cid = $this->cid;
					$item->item_table_id = $r->id;
					$item->save();
					$r->status = 2;
					$r->save();
					$all_sell_price += $r->all_sell_price;
					$all_in_price += $r->all_in_price;
				}
				$daytable->all_sell_price = $all_sell_price;
				$daytable->all_in_price = $all_in_price;
				$daytable->all_profit = $all_sell_price - $all_in_price;
				$daytable->save();
				$result = array("success"=>true,"msg"=>"创建清点单成功");
			}
			else
			{
				$result = array("success"=>false,"msg"=>"距离上一次清点没有销售单");
			}
		}
		echo CJSON::encode($result);

	}

	public function actionConfirm()
	{
		$result = array("success"=>false,"msg"=>"未知错误");
		if(myconfig::checkpermission(myconfig::$acountmanage, myconfig::$acount))
		{
			if(isset($_POST['id']))
			{
				$table_id = $_POST['id'];
				$acountable = Acountday::model()->find("id = $table_id and cid={$this->cid}");
				if($acountable != null)
				{
					$acountable->status = 1;
					$acountable->confirmdate = date("Y-m-d H:i:s");
					$acountable->confirm_id = Yii::app()->session['id'];
					$acountable->save();
					$result = array("success"=>true,"msg"=>"确认成功");
				}
				else
				{
					$result = array("success"=>false,"msg"=>"没有存在清点单");
				}
			}
			else
			{
				$result = array("success"=>false,"msg"=>"没有选中表单");
			}
		}
		echo CJSON::encode($result);


	}
}