<?php
class myconfig
{
	public  static $rootarray = array("0"=>array("100001","100002","100003","100004","200001","300001","300002","400001","400002","500001"),
									  "1"=>array("100003","400001","400002"),
									  "2"=>array("100002","300001","300002")
										);
	
	public	static $usermanage = 0;
	public	static $usernamemanage = 0;
	
	public	static $productmanage = 1;
	public	static $goodsmanage = 0;
	public	static $stockmanage = 1;
	
	public	static $sellmanage = 2;
	public	static $sellsystem = 0;
	public	static $selltable = 1;
	
	public static $acountmanage = 3;
	public static $acount=0;
	
	public static function checkpermission($group_id,$sub_id)
	{
		if(isset(Yii::app()->session['logged']) && isset(Yii::app()->session['power'][$group_id]))
		{
			return Yii::app()->session['power'][$group_id][$sub_id];
		}
		else
		{
			return false;
		}
	}
	
	public static function nopower()
	{
		header("Content-Type:text/html; charset=utf-8");
		echo "<script>alert('错误，没有权限');";
	}
	
	public static function checktree($id)
	{
		if(isset(Yii::app()->session['logged']))
		{
			$root = Yii::app()->session['root'];
			if(in_array($id, myconfig::$rootarray[$root]))
			{
				return true;
			}
		}
		else
		{
			return false;
		}
	}
}