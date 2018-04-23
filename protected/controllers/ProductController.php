<?php
class ProductController extends Controller{
	public function actionIndex(){

	}

	public function actionList(){
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$goodsmanage))
		{
			$this->render('List');
		}
		else
		{
			echo "<script>alert('没有权限');</script>";
		}
	}

	public function actionStock(){
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$stockmanage))
		{
			$this->render('Stock');
		}
		else
		{
			echo "<script>alert('没有权限');</script>";
		}
	}

	/*
	 * getproducts
	 */
	public function actionGetProducts(){
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$goodsmanage))
		{
			$head = array("product_id"=>"t.id","product_catagory"=>"t.catagoryid","product_catagoryname"=>"catagory.name","product_code"=>"t.code","product_name"=>"t.name","product_avinprice"=>"t.av_inprice","product_lastinprice"=>"t.last_inprice","product_exprice"=>"t.exprice","product_standard"=>"t.standard","product_unit"=>"t.unit");//外部表明对应数据库列名。不把数据库列名暴露
			$check_class = "product_id"; //查询的类别


			$sort = 'product_id';         //顺序的类别
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

			if(($check_class == "product_avinprice") || ($check_class == "product_exprice") || ($check_class == "product_lastinprice"))
			{
				//$sql = "select * from {{product}} where $check_class = $key order by $sort $dir limit $start,$limit";
				$sql = array(
		    "condition"=>"{$check_class} = {$key} and t.status = 1 and t.cid={$this->cid}",
		    "order"=>"$sort $dir",
		    "limit"=>"$limit",
		    "offset"=>"$start",
				);
				$sql_count = array(
		    "condition"=>"$check_class = $key and t.status = 1 and t.cid={$this->cid}",
				);
			}
			else
			{
				//$sql = "select * from {{product}} where $check_class like '$key%' order by $sort $dir limit $start,$limit";
				$sql = array(
		    "condition"=>"$check_class like '$key%' and t.status = 1 and t.cid={$this->cid}",
		    "order"=>"$sort $dir",
		    "limit"=>"$limit",
		    "offset"=>"$start",
				);
				$sql_count = array(
		    "condition"=>"$check_class like '$key%' and t.status = 1 and t.cid={$this->cid}",
				);
			}
			$product = Product::model()->with("catagory")->findAll($sql);
			$count = Product::model()->with("catagory")->count($sql_count);
			if(count($product) > 0)
			{
				foreach($product as $pro){
					$id = $pro->id;
					$catagory = $pro->catagoryid;
					$code = $pro->code;
					$name = $pro->name;
					$avinprice = $pro->av_inprice;
					$lastinprice = $pro->last_inprice;
					$exprice = $pro->exprice;
					$standard = $pro->standard;
					$unit = $pro->unit;
					$data[] = array("product_id"=>$id,"product_code"=>$code,"product_catagory"=>$catagory,"product_name"=>$name,"product_avinprice"=>$avinprice,"product_lastinprice"=>$lastinprice,"product_exprice"=>$exprice,"product_standard"=>$standard,"product_unit"=>$unit);
				}
			}
			$result = array('count'=>$count,'data'=>$data);
			echo CJSON::encode($result);
		}
	}

	/*
	 * getproducts
	 */
	public function actionPrint(){
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$goodsmanage))
		{
			$head = array("product_id"=>"t.id","product_catagory"=>"t.catagoryid","product_catagoryname"=>"catagory.name","product_code"=>"t.code","product_name"=>"t.name","product_avinprice"=>"t.av_inprice","product_lastinprice"=>"t.last_inprice","product_exprice"=>"t.exprice","product_standard"=>"t.standard","product_unit"=>"t.unit");//外部表明对应数据库列名。不把数据库列名暴露
			$check_class = "product_id"; //查询的类别

			$key = '';                    //查找的关键字
			if(isset($_GET['key']) && $_GET['key'] != "" && $_GET['check_class'] != "")
				$key = $_GET['key'];
			if(isset($_GET['check_class']) && $_GET['check_class'] != "")
				$check_class = $_GET['check_class'];


			$check_class = $head[$check_class];
			$data = array();

			if(($check_class == "product_avinprice") || ($check_class == "product_exprice") || ($check_class == "product_lastinprice"))
			{
				//$sql = "select * from {{product}} where $check_class = $key order by $sort $dir limit $start,$limit";
				$sql = array(
					"condition"=>"{$check_class} = {$key} and t.status = 1 and t.cid={$this->cid}",
				);
			}
			else
			{
				//$sql = "select * from {{product}} where $check_class like '$key%' order by $sort $dir limit $start,$limit";
				$sql = array(
					"condition"=>"$check_class like '$key%' and t.status = 1 and t.cid={$this->cid}",
				);
			}
			$product = Product::model()->with("catagory")->findAll($sql);
			if(count($product) > 0)
			{
				foreach($product as $pro){
					$catagory = $pro->catagory->name;
					$code = $pro->code;
					$name = $pro->name;
					$avinprice = $pro->av_inprice;
					$lastinprice = $pro->last_inprice;
					$exprice = $pro->exprice;
					$standard = $pro->standard;
					$unit = $pro->unit;
					$data[] = array("product_code"=>$code,"product_name"=>$name,"product_catagory"=>$catagory,"product_unit"=>$unit,"product_standard"=>$standard,"product_lastinprice"=>$lastinprice,"product_avinprice"=>$avinprice,"product_exprice"=>$exprice);
				}
			}
			$title = array("打印时间"=>date("Y-m-d H:i:s",time()));
			$head = array(
				array("width"=>150,"data"=>"产品编码/条码"),
				array("width"=>100,"data"=>"产品名称"),
				array("width"=>70,"data"=>"产品类别"),
				array("width"=>70,"data"=>"产品单位"),
				array("width"=>70,"data"=>"产品规格"),
				array("width"=>85,"data"=>"最新进货价"),
				array("width"=>85,"data"=>"平均进货价"),
				array("width"=>85,"data"=>"产品销售价")
			);
			$result = array("head"=>$head,"table"=>$data,"hTitle"=>$title,'ti'=>"产品信息");
			$this->printPage($result);
		}
	}


	/*
	 * 保存的操作
	 */
	public function actionSave()
	{
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$goodsmanage))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			$msg = "";
			if(isset($_POST['data']))
			{
				$datas = CJSON::decode($_POST['data']);
				foreach($datas as $data)
				{
					$record = Product::model()->find("status = 1 and cid={$this->cid} and id = ".$data['product_id']);
					if($record != NULL)
					{
						$exist_code = Product::model()->find("code = '".$data['product_code']."' and status = 1 and cid={$this->cid}");
						if($exist_code == NULL || $exist_code->id == $data['product_id'])
						{
							$record->catagoryid = $data['product_catagory'];
							$record->code = $data['product_code'];
							$record->name = $data['product_name'];
							$record->av_inprice = $data['product_avinprice'];
							$record->last_inprice = $data['product_lastinprice'];
							$record->exprice = $data['product_exprice'];
							$record->standard = $data['product_standard'];
							$record->unit = $data['product_unit'];
							$record->save();
						}
						else
						{
							$msg = $msg."产品序号为".$data['product_id']."的编码".$data['product_code']."已经存在于序号为".$exist_code->id."的产品中\n";
						}
					}
					else
					{
						$result = array("success"=>false,"msg"=>"不存在此ID的产品");
					}

				}
				if($msg == "")
				{
					$result = array("success"=>true);
				}
				else
				{
					$result = array("success"=>false,"msg"=>$msg);
				}
			}
		}
			echo CJSON::encode($result);
		

	}

	/*
	 * 删除的操作
	 */

	public function actionRemove()
	{
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$goodsmanage))
		{
			$result = array('success'=>false);
			if(isset($_POST['data']))
			{
				$data = $_POST['data'];
				$records = Product::model()->findAll("id in".$data." and cid={$this->cid}");
				if(count($records) > 0)
				{
					foreach ($records as $re)
					{
						$re->status = 0;
						$re->save();
						$items = Stock::model()->findAll("parent_id = {$re->id} and cid={$this->cid}");
						if(count($items) > 0)
						{
							foreach($items as $it)
							{
								$it->parent_id = -1;
								$it->product_num = 0;
								$it->has_parent = 0;
								$it->save();
							}
						}
					}
				}
				$result = array('success'=>true);
			}
		}
			echo CJSON::encode($result);
		
	}

	/*
	 * 添加的操作
	 */
	 
	public function actionAdd()
	{
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$goodsmanage))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['product_code']))
			{
				$code = $_POST['product_code'];
				$isexist = Product::model()->find("code = '$code' and status = 1 and cid={$this->cid}");
				if($isexist != NULL)
				{
					$result = array("success"=>false,"msg"=>"存在此编码的产品");
				}
				else
				{
					$product = new Product();
					$product->code = $code;
					$product->cid = $this->cid;
					$product->name = $_POST['product_name'];
					$product->catagoryid = $_POST['product_catagoryid'];
					$product->unit = $_POST['product_unit'];
					$product->standard = $_POST['product_standard'];
					$product->last_inprice = $_POST['product_inprice'];
					$product->av_inprice = $_POST['product_inprice'];
					$product->exprice = $_POST['product_exprice'];
					$product->save();
					$stock = new Stock();
					$stock->product_id = $product->id;
					$stock->save();
					$result = array("success"=>true);
				}
				 
			}
		}
			echo CJSON::encode($result);
		
	}
}

