<?php
class Product_inController extends Controller{

	/*
	 * 获取进货单
	 */
	public function actionGettable(){
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$stockmanage))
		{
			$head = array("table_id"=>"id","create_time"=>"createdate","confirm_time"=>"confirmdate","total_price"=>"totalprice");//外部表明对应数据库列名。不把数据库列名暴露
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
				$sql = "select * from {{product_in_table}} where $check_class like '{$key}%'  and cid={$this->cid} order by $sort $dir limit $start,$limit";
				$count = Product_in_table::model()->count("$check_class like '{$key}%'  and cid={$this->cid}");
			}
			else
			{
				$sql = "select * from {{product_in_table}} where cid={$this->cid} order by $sort $dir limit $start,$limit";
				$count = Product_in_table::model()->count("cid={$this->cid}");
			}
			$tables = Product_in_table::model()->findAllBySql($sql);
			if(count($tables) > 0)
			{
				foreach($tables as $table){
					$id++;
					$table_id = $table->id;
					$createtiem = $table->createdate;
					$confirmtime = $table->confirmdate;
					$totalprice = $table->totalprice;
					$remark = $table->remark;
					$status = $table->status;
					$data[] = array("table_id"=>$table_id,"status"=>$status,"table_count"=>$id,"create_time"=>$createtiem,"confirm_time"=>$confirmtime,"total_price"=>$totalprice,"remark"=>$remark,"");
				}
			}
			$result = array('count'=>$count,'data'=>$data);
			echo CJSON::encode($result);
		}
	}

	/*
	 * 获取进货单的子项
	 */
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
				//var product_in_items_index = [{name:'table_item_id'},{name:'table_item_code'},{name:'table_item_name'},{name:'table_item_num',type:'float'},{name:'table_item_price',type:'float'},{name:'table_item_remark',type:'string'}];

				$head = array("table_item_catagoryname"=>"catagory.name","table_item_id"=>"t.id","table_item_code"=>"product.code","table_item_name"=>"product.name","table_item_num"=>"t.product_num","table_item_price"=>"t.product_price","table_item_remark"=>"t.remark");//外部表明对应数据库列名。不把数据库列名暴露
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
			'condition'=>"table_id = {$table_id} and {$check_class} like '{$key}%' and t.cid={$this->cid}",
			'order'=>"$sort $dir",
			'limit'=>"$limit",
			'offset'=>"$start",
				);
				$sql_count = array(
			'condition'=>"table_id = {$table_id} and {$check_class} like '{$key}%' and t.cid={$this->cid}",
				);
				//$sql = "select * from {{product_in_items}},{{product}} where table_id = $table_id and $check_class like '$key' order by $sort $dir limit $start,$limit ";
				$items = Product_in_items::model()->with('product','product.catagory')->findAll($sql);
				$count = Product_in_items::model()->with('product','product.catagory')->count($sql_count);
				if(count($items) > 0)
				{
					foreach($items as $item)
					{
						//var product_in_items_index = [{name:'table_item_id'},{name:'table_item_code'},{name:'table_item_name'},{name:'table_item_num'},{name:'table_item_price'},{name:'table_item_remark'}];
						$id++;
						$table_item_id = $item->id;
						$table_item_code = $item->product->code;
						$table_item_name = $item->product->name;
						$table_item_num = $item->product_num;
						$table_item_price = $item->product_price;
						$table_item_catagoryname = $item->product->catagory->name;
						$table_item_pstatus = $item->product->status;
						$table_item_remark = $item->remark;
						$data[] = array("table_item_count"=>$id,"table_item_id"=>$table_item_id,"table_item_code"=>$table_item_code,"table_item_name"=>$table_item_name,"table_item_catagoryname"=>$table_item_catagoryname,"table_item_num"=>$table_item_num,"table_item_price"=>$table_item_price,"table_item_pstatus"=>$table_item_pstatus,"table_item_remark"=>$table_item_remark);

					}
				}

			}
			$result = array('count'=>$count,'data'=>$data);
			echo CJSON::encode($result);
		}
	}
	/*
	 * 删除进货单
	 */
	public function actionRemovetable(){
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$stockmanage))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['table_id']))
			{
				$id = $_POST['table_id'];
				$table = Product_in_table::model()->find("id = $id and cid={$this->cid}");
				if($table != NULL)
				{
					if($table->status == 0)
					{
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
				$table = Product_in_table::model()->find("id = $id and cid={$this->cid}");
				if($table != NULL && $table->status == 0)
				{
					$items = $table->items;
					if(count($items) > 0)
					{
						foreach($items as $item)
						{
							$product = $item->product;
							$product->last_inprice = $item->product_price;
							$stock = $product->stock;
							$allprice = $product->av_inprice * $stock->quantity;
							$allprice += $item->product_num * $item->product_price;
							$stock->quantity += $item->product_num;
							$stock->available_quantity += $item->product_num;
							$stock->save();
							$product->av_inprice = $allprice/$stock->quantity;
							$product->save();
						}
					}
					$table->confirmdate = date("Y-m-d,H:i:s");
					$table->user_id = Yii::app()->session['id'];
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
				$table = new Product_in_table();
				$table->createdate = date("Y-m-d H:i:s");
				$table->remark = $_POST['remark'];
				$table->cid = $this->cid;
				$table->user_id = Yii::app()->session['id'];
				$table->save();
				foreach($datas as $data)
				{
					$item = new Product_in_items();
					$code = $data['table_item_code'];
					$product = Product::model()->find("status = 1 and code = {$code} and cid={$this->cid}");
					if($product != NULL)
					{
						$item->product_id = $product->id;
						$item->cid = $this->cid;
						$item->product_num = $data['table_item_num'];
						$item->product_price = $data['table_item_price'];
						$item->table_id = $table->id;
						$item->user_id = Yii::app()->session['id'];
						$item->remark = $data['table_item_remark'];
						$item->save();
						$D_value = $item->product_num * $item->product_price;
						$table->totalprice += $D_value;
						$table->save();
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
				$table = Product_in_table::model()->find("id = $table_id and cid={$this->cid}");
				if($table != NULL && !$table->status)
				{
					$datas = CJSON::decode($_POST['data']);
					foreach($datas as $data)
					{
						$id = $data['table_item_id'];
						$item = Product_in_items::model()->find("id = $id and cid={$this->cid}");
						if($item != NULL)
						{
							$code = $data['table_item_code'];
							$product = Product::model()->find("status = 1 and code = {$code} and cid={$this->cid}");
							if($product != NULL)
							{
								$item->product_id = $product->id;
								$D_value = $item->product_num * $item->product_price;
								$item->product_num = $data['table_item_num'];
								$item->product_price = $data['table_item_price'];
								$item->remark = $data['table_item_remark'];
								$item->save();
								$D_value -= $item->product_num * $item->product_price;
								$item->table->totalprice -= $D_value;
								$item->table->save();
							}
						}
						else
						{
							$item = new Product_in_items();
							$code = $data['table_item_code'];
							$product = Product::model()->find("status = 1 and code = {$code} and cid={$this->cid}");
							if($product != NULL)
							{
								$item->product_id = $product->id;
								$item->cid = $this->cid;
								$item->product_num = $data['table_item_num'];
								$item->product_price = $data['table_item_price'];
								$item->table_id = $_POST['table_id'];
								$item->remark = $data['table_item_remark'];
								$item->save();
								$D_value = $item->product_num * $item->product_price;
								$item->table->totalprice += $D_value;
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
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$stockmanage))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['item_id']))
			{
				$id = $_POST['item_id'];
				$item = Product_in_items::model()->find("id = {$id} and cid={$this->cid}");
				if($item != NULL && !$item->table->status)
				{
					$item->table->totalprice -= $item->product_num * $item->product_price;
					$item->table->save();
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
				$table = Product_in_table::model()->find("id = {$id} and cid={$this->cid}");
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