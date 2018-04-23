<?php
class LogController extends Controller
{
	public function actionIndex()
	{
		$result = array("success"=>false,"msg"=>"");
		$username = $_POST['username'];
		$password = md5($_POST['password']);
		$where = array(
		"condition"=>"username='{$username}' and password='{$password}'",
		);
		$user = User::model()->find($where);
		if(count($user) < 1)
		{
			$result = array("success"=>false,"msg"=>"账号或密码错误");
		}
		else
		{
			Yii::app()->session['id'] = $user->id;
			Yii::app()->session['logged'] = 1;
			Yii::app()->session['name']=$user->name;
			Yii::app()->session['root']=$user->root;
			Yii::app()->session['cid']=$user->cid;
			$power = array();
			$where = array(
			'condition'=>"role_id={$user->root}",
			);
			$root = Permission2role::model()->findAll($where);
			if(count($root) > 0)
			{
				foreach($root as $r)
				{
					$power["$r->group_id"] = $r->mask;
				}
			}
			$result = array("success"=>true,"msg"=>"/site/index");
			Yii::app()->session['power'] = $power;
		}
		echo CJSON::encode($result);
	}
	
	public function actionLogin()
	{
		if(isset(Yii::app()->session['logged']))
		header("location:/site/index");
		else
		$this->render('Login');
	}
	
	public function actionLogout()
	{
		Yii::app()->session->clear();
		Yii::app()->session->destroy();
		header("location:/log/login");
	}
}
