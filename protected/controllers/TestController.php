<?php
class TestController extends Controller{
	public function actionIndex()
	{
		$data = array();
		$title = array("创建时间"=>"2015-01-01","备注"=>"测试备注");
		$head = array(array("width"=>100,"data"=>"id"),array("width"=>100,"data"=>"name"));
		for($i = 0;$i < 100; $i++)
		{
			$data[] = array($i,"name{$i}");
		}
		$result = array("head"=>$head,"table"=>$data,"hTitle"=>$title,'ti'=>"测试表格");
		$this->renderPartial("//layouts/print",$result);
	}

	public function actionGetData()
	{

	}
}