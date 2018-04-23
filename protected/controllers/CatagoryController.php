<?php
class CatagoryController extends Controller{
	public function actionIndex(){

	}
	/*
	 * 获取所有的类别
	 */
	public function actionGetList(){
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$goodsmanage))
		{
			$result = array('count'=>0,'data'=>array());
			$data = array();
			$sort = 'id';         //顺序的类别
			$dir = 'ASC';                 //升序还是降序
			if(isset($_POST['sort']))
			$sort = $_POST['sort'];
			if(isset($_POST['dir']))
			$dir = $_POST['dir'];
			$sql = array(
		"condition"=>"status = 1 and cid={$this->cid}",
	    "order"=>"$sort $dir",
			);
			$records = Catagory::model()->findAll($sql);
			$count = Catagory::model()->count(array("condition"=>"cid={$this->cid}"));
			if(count($records) > 0)
			{
				foreach($records as $re)
				{
					$data[] = array('id'=>$re->id,'name'=>$re->name);
				}
			}
			$result = array('count'=>$count,'data'=>$data);
			echo CJSON::encode($result);
		}
	}
	/*
	 * 增加类别
	 */
	public function actionAdd(){
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$goodsmanage))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['catagory_addname']))
			{
				$name = $_POST['catagory_addname'];
				$exist = Catagory::model()->find("name = '$name' and status = 1 and cid={$this->cid}");
				if($exist == NULL)
				{
					$catagory = new Catagory();
					$catagory->cid = $this->cid;
					$catagory->name = $name;
					$catagory->save();
					$result = array("success"=>true,"msg"=>"添加成功");
				}else{
			 	$result = array("success"=>false,"msg"=>"已经存在的分类");
			 	}
			}
		}
			echo CJSON::encode($result);
		
	}

	/*
	 * 删除类别
	 */
	public function actionRemove(){
		$result = array("success"=>false,"msg"=>"未知错误");
		if(myconfig::checkpermission(myconfig::$productmanage, myconfig::$goodsmanage))
		{
			$result = array('success'=>false);
			if(isset($_POST['data']))
			{
				$data = $_POST['data'];
				$records = Catagory::model()->findAll("id in {$data}  and cid={$this->cid}");
				if(count($records) > 0)
				{
					foreach ($records as $re)
					{
						$re->status = 0;
						$re->save();
						$pro = $re->product;
						if(count($pro) > 0)
						{
							foreach ($pro as $p)
							{
								$p->status = 0;
								$p->save();
							}
						}
					}
				}
				$result = array('success'=>true);
			}
		}
			echo CJSON::encode($result);
		
	}
}