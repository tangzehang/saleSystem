<?php
class Product_checkController extends Controller{

	public function actionGettable(){
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$stockmanage))
		{
			$head = array("table_id"=>"id","create_time"=>"createdate","confirm_time"=>"confirmdate");//外部表明对应数据库列名。不把数据库列名暴露
			$check_class = "table_id"; //查询的类别


			$sort = 'table_id';         //顺序的类别
			$dir = 'ASC';                 //升序还是降序
			$key = '';                    //查找的关键字
			$start = 0;                   //记录从第几条开始
			$limit = 15;                  //查询几条记录
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
			$sql = "select * from {{product_check_table}} where $check_class like '{$key}%' and cid={$this->cid} order by $sort $dir limit $start,$limit";
			else
			$sql = "select * from {{product_check_table}} where  cid={$this->cid} order by $sort $dir limit $start,$limit";
				
			$tables = Product_check_table::model()->findAllBySql($sql);
			$count = Product_check_table::model()->count(array("condition"=>"cid={$this->cid}"));
			if(count($tables) > 0)
			{
				foreach($tables as $table){
					$id = $table->id;
					$createtiem = $table->createdate;
					$confirmtime = $table->confirmdate;
					$status = $table->status;
					$remark = $table->remark;
					$data[] = array("table_id"=>$id,"create_time"=>$createtiem,"confirm_time"=>$confirmtime,"status"=>$status,"remark"=>$remark);
				}
			}
			$result = array('count'=>$count,'data'=>$data);
			echo CJSON::encode($result);
		}
	}

	public function actionGetitems(){
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$stockmanage))
		{
			$count = 0;
			$data = array();
			$start = 0;
			$limit = 15;
			$id = 0;
			if(isset($_POST['table_id']))
			{
				//var product_check_items_index = [{name:'table_item_id'},{name:'table_item_code'},{name:'table_item_name'},{name:'table_item_catagoryname},{name:'table_item_num'},{name:'table_item_checknum'},{name:'table_item_remark'}];

				$head = array("table_item_catagoryname"=>"catagory.name","table_item_id"=>"t.id","table_item_code"=>"product.code","table_item_name"=>"product.name","table_item_num"=>"t.product_num","table_item_checknum"=>"t.check_num","table_item_remark"=>"t.remark");//外部表明对应数据库列名。不把数据库列名暴露
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
			'condition'=>"table_id = $table_id and $check_class like '{$key}%' and t.cid={$this->cid}",
			'order'=>"$sort $dir",
			'limit'=>"$limit",
			'offset'=>"$start",
				);
				$sql_count = array(
			'condition'=>"table_id = $table_id and $check_class like '{$key}%' and t.cid={$this->cid}",
				);
				//$sql = "select * from {{product_in_items}},{{product}} where table_id = $table_id and $check_class like '$key' order by $sort $dir limit $start,$limit ";
				$items = Product_check_items::model()->with('product','product.catagory')->findAll($sql);
				$count = Product_check_items::model()->with('product','product.catagory')->count($sql_count);
				if(count($items) > 0)
				{
					foreach($items as $item)
					{
						$id++;
						$table_item_id = $item->id;
						$table_item_code = $item->product->code;
						$table_item_name = $item->product->name;
						$table_item_num = $item->product_num;
						$table_item_checknum = $item->check_num;
						$table_item_catagoryname = $item->product->catagory->name;
						$table_item_pstatus = $item->product->status;
						$table_item_remark = $item->remark;
						$data[] = array("table_item_count"=>$id,"table_item_id"=>$table_item_id,"table_item_code"=>$table_item_code,"table_item_name"=>$table_item_name,"table_item_catagoryname"=>$table_item_catagoryname,"table_item_num"=>$table_item_num,"table_item_checknum"=>$table_item_checknum,"table_item_pstatus"=>$table_item_pstatus,"table_item_remark"=>$table_item_remark);

					}
				}

			}
			$result = array('count'=>$count,'data'=>$data);
			echo CJSON::encode($result);
		}
	}

	public function actionRemovetable(){
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$stockmanage))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['table_id']))
			{
				$id = $_POST['table_id'];
				$table = Product_check_table::model()->find("id = $id and cid={$this->cid}");
				if($table != NULL)
				{
					if($table->status == 0)
					{
						$table->delete();
						$result = array("success"=>true,"msg"=>"删除成功");
					}
					else
					{
						$result = array("success"=>false,"msg"=>"盘点单已经确认");
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
	 * 确认进货单
	 */
	public function actionConfirmtable(){
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$stockmanage))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['table_id']))
			{
				$id = $_POST['table_id'];
				$table = Product_check_table::model()->with("items","items.product","items.product.stock")->find("t.id = $id and t.cid={$this->cid}");
				if($table != NULL && $table->status == 0)
				{
					$items = $table->items;
					if(count($items) > 0)
					{
						foreach($items as $item)
						{
							$product = $item->product;
							$stock = $product->stock;
							$stock->quantity += $item->check_num - $item->product_num;
							$stock->available_quantity += $item->check_num - $item->product_num;
							$stock->save();
						}
					}
					$table->confirmdate = date("Y-m-d,H:i:s");
					$table->status = 1;
					$table->user_id = Yii::app()->session['id'];
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
	 * 添加进货单
	 */
	public function actionAddtable()
	{
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$stockmanage))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['data']))
			{
				$datas = CJSON::decode($_POST['data']);
				$table = new Product_check_table();
				$table->cid = $this->cid;
				$table->createdate = date("Y-m-d H:i:s");
				$table->remark = $_POST['remark'];
				$table->user_id = Yii::app()->session['id'];
				$table->save();
				foreach($datas as $data)
				{
					$table_id = $table->id;
					$item = new Product_check_items();
					$code = $data['table_item_code'];
					$product = Product::model()->with("stock")->find("t.status = 1 and t.cid={$this->cid} and t.code = $code and t.id not in(select product_id from {{product_check_items}} where table_id = $table_id)");
					if($product != NULL)
					{
						$item->product_id = $product->id;
						$item->cid = $this->cid;
						$item->product_num = $product->stock->quantity;
						$item->check_num = $data['table_item_checknum'];
						$item->check_date = date("Y-m-d H:i:s");
						$item->table_id = $table->id;
						$item->remark = $data['table_item_remark'];
						$item->user_id = Yii::app()->session['id'];
						$item->save();
					}
				}
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
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$stockmanage))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['data']) && isset($_POST['table_id']))
			{
				$table_id = $_POST['table_id'];
				$table = Product_check_table::model()->find("t.id = $table_id and t.cid={$this->cid}");
				if($table != NULL && !$table->status)
				{
					$datas = CJSON::decode($_POST['data']);
					foreach($datas as $data)
					{
						$id = $data['table_item_id'];
						$item = Product_check_items::model()->find("t.id = $id and t.cid={$this->cid}");
						if($item != NULL)
						{
							$code = $data['table_item_code'];
							$product = Product::model()->with("stock")->find("t.status = 1 and t.cid={$this->cid}  and t.code = $code and t.id not in(select product_id from {{product_check_items}} where table_id = {$table_id} and id != {$id})");
							if($product != NULL)
							{
								$item->product_id = $product->id;
								$item->product_num = $product->stock->quantity;
								$item->check_num = $data['table_item_checknum'];
								$item->remark = $data['table_item_remark'];
								$item->user_id = Yii::app()->session['id'];
								$item->save();
							}
						}else{
							$item = new Product_check_items();
							$item->cid = $this->cid;
							$code = $data['table_item_code'];
							$product = Product::model()->find("t.status = 1 and t.cid={$this->cid} and t.code = {$code} and t.id not in(select product_id from {{product_check_items}} where table_id = {$table_id})");
							if($product != NULL)
							{
								$item->product_id = $product->id;
								$item->product_num = $data['table_item_num'];
								$item->check_num = $data['table_item_checknum'];
								$item->table_id = $_POST['table_id'];
								$item->remark = $data['table_item_remark'];
								$item->user_id = Yii::app()->session['id'];
								$item->save();
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
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$stockmanage))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['item_id']))
			{
				$id = $_POST['item_id'];
				$item = Product_check_items::model()->find("t.id = $id and cid={$this->cid}");
				if($item != NULL && !$item->table->status)
				{
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
	 * 修改进货单备注
	 */
	public function actionChangeremark()
	{
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$stockmanage))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['table_id']) && $_POST['remark'])
			{
				$id = $_POST['table_id'];
				$table = Product_check_table::model()->find("t.id = $id and cid={$this->cid}");
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