<?php
class StockController extends Controller{

	/*
	 * 获取所有库存的数据
	 */
	public function actionGetlist(){
		//var stock_index = [{name:'product_id'},{name:'product_code'},{name:'product_name'},{name:'product_catagoryname'},{name:'product_stock'},{name:'product_availablestock'},{name:'has_parent'},{name:'parent_name'},{name:'child_num'}];//库存的store名
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$stockmanage))
		{
			$head = array("product_id"=>"t.id","product_code"=>"t.code","product_name"=>"t.name","product_catagoryname"=>"catagory.name","product_stock"=>"stock.quantity","product_availablestock"=>"stock.available_quantity","has_parent"=>"stock.has_parent","child_num"=>"stock.product_num");//外部表明对应数据库列名。不把数据库列名暴露
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

			$sql = array(
			'condition'=>"$check_class like '{$key}%' and t.status = 1 and t.cid={$this->cid}",
			'order'=>"$sort $dir",
			'limit'=>"$limit",
			'offset'=>"$start",
			);
			$sql_count = array(
			'condition'=>"$check_class like '{$key}%' and t.status = 1 and t.cid={$this->cid}",
			);
			//$sql = "select * from {{product}} where $check_class like '$key%' order by $sort $dir limit $start,$limit";

			$product = Product::model()->with('stock','stock.product','catagory')->findAll($sql);
			$count = Product::model()->with('stock','catagory')->count($sql_count);
			if(count($product) > 0)
			{
				foreach($product as $pro){
					$id = $pro->id;
					$catagoryname = $pro->catagory->name;
					$code = $pro->code;
					$name = $pro->name;
					$unit = $pro->unit;
					$stock_quantity = $pro->stock->quantity;
					$stock_availablequantity = $pro->stock->available_quantity;
					$has_parent = $pro->stock->has_parent;
					if($has_parent)
						$parent_name =  $pro->stock->product->name;
					else
						$parent_name = "";
					$product_num = $pro->stock->product_num;
					$data[] = array("product_id"=>$id,"product_code"=>$code,"product_catagoryname"=>$catagoryname,"product_name"=>$name,"product_unit"=>$unit,'product_stock'=>$stock_quantity,'product_availablestock'=>$stock_availablequantity,'has_parent'=>$has_parent,'parent_name'=>$parent_name,'child_num'=>$product_num);
				}
			}
			$result = array('count'=>$count,'data'=>$data);
			echo CJSON::encode($result);
		}
	}

	public function actionPrint(){
		//var stock_index = [{name:'product_id'},{name:'product_code'},{name:'product_name'},{name:'product_catagoryname'},{name:'product_stock'},{name:'product_availablestock'},{name:'has_parent'},{name:'parent_name'},{name:'child_num'}];//库存的store名
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$stockmanage))
		{
			$head = array("product_id"=>"t.id","product_code"=>"t.code","product_name"=>"t.name","product_catagoryname"=>"catagory.name","product_stock"=>"stock.quantity","product_availablestock"=>"stock.available_quantity","has_parent"=>"stock.has_parent","child_num"=>"stock.product_num");//外部表明对应数据库列名。不把数据库列名暴露
			$check_class = "product_id"; //查询的类别
			$key = '';
			if(isset($_GET['key']) && $_GET['key'] != "" && $_GET['check_class'] != "")
				$key = $_GET['key'];
			if(isset($_GET['check_class']) && $_GET['check_class'] != "")
				$check_class = $_GET['check_class'];


			$check_class = $head[$check_class];
			$data = array();

			$sql = array(
				'condition'=>"$check_class like '{$key}%' and t.status = 1 and t.cid={$this->cid}"
			);

			$product = Product::model()->with('stock','stock.product','catagory')->findAll($sql);
			if(count($product) > 0)
			{
				foreach($product as $pro){
					$id = $pro->id;
					$catagoryname = $pro->catagory->name;
					$code = $pro->code;
					$name = $pro->name;
					$unit = $pro->unit;
					$stock_quantity = $pro->stock->quantity;
					$stock_availablequantity = $pro->stock->available_quantity;
					$has_parent = $pro->stock->has_parent;
					if($has_parent)
						$parent_name =  $pro->stock->product->name;
					else
						$parent_name = "";
					$product_num = $pro->stock->product_num;
					$data[] = array("product_code"=>$code,"product_name"=>$name,"product_catagoryname"=>$catagoryname,'product_stock'=>$stock_quantity,'product_availablestock'=>$stock_availablequantity);
				}
			}
			$title = array("打印时间"=>date("Y-m-d H:i:s",time()));
			$head = array(
				array("width"=>150,"data"=>"产品编码/条码"),
				array("width"=>100,"data"=>"产品名称"),
				array("width"=>70,"data"=>"产品类别"),
				array("width"=>70,"data"=>"产品库存"),
				array("width"=>70,"data"=>"可用库存")
			);
			$result = array("head"=>$head,"table"=>$data,"hTitle"=>$title,'ti'=>"库存信息");
			$this->printPage($result);
		}
	}
	/*
	 * 获取所有产品的名字
	 */
	public function actionGetname(){
		if(isset(Yii::app()->session['logged']))
		{
			$count = 0;
			$data = array();
			$table_id = -1;
			$records = Product::model()->findAll("status = 1 and cid={$this->cid}");
			if(count($records) > 0)
			{
				$count = count($records);
				foreach($records as $re)
				{
					$data[] = array("name_code"=>$re->code,"name_name"=>$re->name,"name_catagoryname"=>$re->catagory->name,"name_stocknum"=>$re->stock->quantity,"name_standard"=>$re->standard,"name_sellprice"=>$re->exprice);
				}
			}
			$result = array('count'=>$count,'data'=>$data);
			echo CJSON::encode($result);
		}
	}
	/*
	 * 父子产品关系的处理函数
	 */
	public function actionRelation(){
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$goodsmanage))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['parent_name']) && isset($_POST['child_name']))
			{
				$child_code = $_POST['child_code'];
				$parent_code = $_POST['parent_code'];
				$num = $_POST['product_num'];
				$child_product = Product::model()->find("code = '$child_code' and cid={$this->cid}");
				$parent_product = Product::model()->find("code = '$parent_code' and cid={$this->cid}");
				if($child_product !=NULL && $parent_product != NULL && $child_code != $parent_code)
				{
					if($parent_product->stock->parent_id == $child_product->id)
					{
						$result = array("success"=>false,"msg"=>"错误，自身产品设置矛盾");
					}else{
						$child_stock = $child_product->stock;
						$child_stock->has_parent = 1;
						$child_stock->parent_id = $parent_product->id;
						$child_stock->product_num = $num;
						$child_stock->save();
						$result = array("success"=>true,"msg"=>"保存成功");
					}
				}
				else
				{
					$result = array("success"=>false,"msg"=>"错误的信息");
				}
			}
		}
			echo CJSON::encode($result);
		
	}
	/*
	 * 清空父子产品关系
	 */
	function actionClearsub(){
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$goodsmanage))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['id']))
			{
				$id = $_POST['id'];
				$stock = Stock::model()->find("product_id = $id and cid={$this->cid}");
				if($stock != NULL)
				{
					$stock->parent_id = -1;
					$stock->product_num = 0;
					$stock->has_parent = 0;
					$stock->save();
					$result = array("success"=>true,"msg"=>"删除成功");
				}
				else
				{
					$result = array("success"=>false,"msg"=>"无此ID产品");
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