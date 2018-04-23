<?php
class UserController extends Controller{
	public function actionManage(){
		if(myconfig::checkpermission(myconfig::$usermanage, myconfig::$usernamemanage))
		{
			$this->render('Manage');
		}
		else
		{
			echo "<script>alert('没有权限');</script>";
		}
	}

	/*adduser
	 *
	 */
	public function actionAddUser(){
		$data = array("success"=>false,"msg"=>'没有权限');
		if(myconfig::checkpermission(myconfig::$usermanage, myconfig::$usernamemanage))
		{

			if(isset($_POST['username']) && isset($_POST['name']) && isset($_POST['password']) && isset($_POST['identity']))
			{
				$is_exits = User::model()->find("username = '$_POST[username]' and status = 1 and cid={$this->cid}");
				if($is_exits != null)
				{
					$data = array("success"=>false,"msg"=>"存在用户");
					echo CJSON::encode($data);
					return;
				}
				$user = new User();
				$user->cid = $this->cid;
				$user->username = $_POST['username'];
				$user->name = $_POST['name'];
				$user->password = md5($_POST['password']);
				$user->root = $_POST['identity'];
				$user->save();
				$data = array("success"=>true,"msg"=>'插入成功');
			}
		}
		echo CJSON::encode($data);

	}
	/*
	 * check
	 */
	public function actionCheck(){
		$result = array("success"=>false);
		if(myconfig::checkpermission(myconfig::$usermanage, myconfig::$usernamemanage))
		{

			if(isset($_POST['username']))
			{
				$username = $_POST['username'];
				$user = User::model()->find("username = '$username' and status = 1 and cid={$this->cid}");
				if($user == null)
				{
					$result = array("success"=>true);
				}
			}
		}
		echo CJSON::encode($result);

	}
	/*
	 * save
	 */
	public function actionSave(){

		$result = array("success"=>false);
		if(myconfig::checkpermission(myconfig::$usermanage, myconfig::$usernamemanage))
		{
			if(isset($_POST['data'])){
				$datas = CJSON::decode($_POST['data']);
				foreach($datas as $data){
					$user = User::model()->find("id = $data[id]");
					if($user!=null)
					{
						$user->name = $data['name'];
						$user->username = $data['username'];
						$user->root = $data['identity'];
						$user->save();
					}
				}
				$result = array("success"=>true);
			}
		}
		echo CJSON::encode($result);

	}
	/*
	 * remove
	 */
	public function actionRemove(){
		$result = array("success"=>false);
		if(myconfig::checkpermission(myconfig::$usermanage, myconfig::$usernamemanage))
		{

			if(isset($_POST['data'])){
				$data = CJSON::decode($_POST['data']);
				$user = User::model()->find("id = $data[id] and cid={$this->cid}");
				if($user!=null)
				{
					$user->status = 0;
					$user->save();
				}
					
				$result = array("success"=>true);
			}
		}
		echo CJSON::encode($result);


	}
	/*
	 * checkpwd
	 */
	public function actionCheckPwd(){
		$result = array("success"=>false);
		if(isset(Yii::app()->session['logged']))
		{
				
			if(isset(Yii::app()->session['logged']) && Yii::app()->session['id']==$_POST['id'])
			{
				if(isset($_POST['id']) && isset($_POST['pwd']))
				{
					$id = $_POST['id'];
					$pwd = $_POST['pwd'];
					$user = User::model()->find("id = $id and cid={$this->cid}");
					if($user != NULL)
					{
						$password = $user->password;
						if(md5($pwd) == $password)
						{
							$result = array("success"=>true);
						}
					}

				}
			}
		}
		echo CJSON::encode($result);


	}
	/*
	 * updatepwd
	 */
	public function actionDoUpdatePwd(){
		$result = array("success"=>false);
		if(isset(Yii::app()->session['logged']))
		{
				
			if(isset(Yii::app()->session['logged']) && Yii::app()->session['id']==$_POST['id'])
			{
				if(isset($_POST['username'])){
					$id = $_POST['username'];
					$pwd = $_POST['password'];
					$new_pwd = $_POST['new_password'];
					$user = User::model()->find("id = $id and cid={$this->cid}");
					if($user != null){
						if($user->password == md5($pwd))
						{
							$user->password = md5($new_pwd);
							$user->save();
							$result = array("success"=>true);
						}
					}

				}
			}
		}
		echo CJSON::encode($result);

	}
}
