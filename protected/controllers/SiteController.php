<?php

class SiteController extends Controller
{
	public function actionError()
	{
		echo "error";
	}

	public function actionIndex()
	{
		if(isset(Yii::app()->session['logged']))
		$this->render('Index');
		else
		header("location:/log/login");
	}
	public function actionForm()
	{
		$this->render('Form');
	}
	public function actionGetData(){
		if(isset(Yii::app()->session['logged']))
		echo "{success:true,data:{'id':'1','title':'name'}}";
	}
	public function actionGrid(){
		if(isset(Yii::app()->session['logged']))
		$this->render('Grid');
	}
	public function actionGetTree(){
		if(isset(Yii::app()->session['logged']))
		{
			$id = $_POST['node'];
			$data = array();
			if($id == 'root')
			{
				$id = 0;
			}
			$results = Menu::model()->findAll("parentid = {$id}");
			if(count($results))
			{
				foreach($results as $result)
				{
					if(myconfig::checktree($result->id))
					{
						$leaf = ($result->haschild == 0) ? true : false;
						$action = $result->action;
						$icon = $result->icon;
						$data[] = array('id'=>$result->id,'text'=>$result->name,'leaf'=>$leaf,'action'=>$action,'icon'=>$icon);
					}
				}
			}
			echo CJSON::encode($data);
		}
	}
	public function actionUserManage(){
		if(myconfig::checkpermission(myconfig::$usermanage, myconfig::$usernamemanage))
		{
			$data = array();
			$totalcount = 0;
			$results = User::model()->findAll("status = 1 and cid={$this->cid}");
			$totalcount = count($results);
			if($totalcount > 0)
			{
				foreach($results as $result)
				{
					$id = $result->id;
					$username = $result->username;
					$name = $result->name;
					$root = $result->root;
					$data[] = array("id"=>$id,"username"=>$username,"name"=>$name,"identity"=>$root);
				}
			}
			$results = array("success"=>'true',"count"=>$totalcount,"data"=>$data);
			echo CJSON::encode($results);
		}
	}
}
