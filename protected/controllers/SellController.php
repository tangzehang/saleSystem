<?php
class SellController extends Controller{
	public function actionIndex()
	{

	}
	public function actionManage(){
		if(myconfig::checkpermission(myconfig::$sellmanage, myconfig::$selltable))
		{
			$this->render("Manage");
		}
		else
		{
			echo "<script>alert('没有权限');</script>";
		}
	}
	public function actionSystem(){
		if(myconfig::checkpermission(myconfig::$sellmanage, myconfig::$sellsystem))
		{
			$this->render("System");
		}
		else
		{
			echo "<script>alert('没有权限');</script>";
		}
	}

	public function actionError(){
		echo "错误";
	}

	public function actionConfirm(){
		$result = array("success"=>false,"msg"=>"没有权限");
		if(myconfig::checkpermission(myconfig::$sellmanage, myconfig::$sellsystem))
		{
			$result = array("success"=>false,"msg"=>"未知错误");
			if(isset($_POST['data']))
			{
				$datas = CJSON::decode($_POST['data']);
				$table = new Sell_table();
				$table->cid = $this->cid;
				$table->createdate = date("Y-m-d,H:i:s");
				$table->confirmdate = date("Y-m-d,H:i:s");
				$table->status = 1;
				$table->user_id = Yii::app()->session['id'];//以后销售员ID
				$table->all_get_price = $_POST['get_money'];
				$table->save();
				$all_sell_price = 0;
				$all_in_price = 0;
				foreach($datas as $data)
				{
					$code = $data['product_code'];
					$exist = Product::model()->find("code = '$code' and cid={$this->cid}");
					if($exist == NULL)
					{
						$product = new Product();
						$product->cid = $this->cid;
						$product->catagoryid = 1;
						$product->code = $code;
						$product->name = "临时产品";
						$product->exprice = ($data['product_sellprice']/$data['product_discount']);
						$product->av_inprice = ($data['product_sellprice']/$data['product_discount']);
						$product->last_inprice = ($data['product_sellprice']/$data['product_discount']);
						$product->save();
						$stock = new Stock();
						$stock->cid = $this->cid;
						$stock->product_id = $product->id;
						$stock->save();
						$exist = $product;
					}
					$item = new Sell_items();
					$item->cid = $this->cid;
					$item->product_id = $exist->id;
					$item->table_id = $table->id;
					$item->sell_price = $data['product_sellprice'];
					$item->sell_num = $data['product_sellnum'];
					$item->discount = $data['product_discount'];
					$item->sell_date = date("Y-m-d,H:i:s");
					$item->in_price = $exist->av_inprice;
					$item->profit = $data['product_sellnum'] * ($data['product_sellprice'] - $exist->av_inprice);
					$exist->stock->quantity -= $data['product_sellnum'];
					$exist->stock->available_quantity -= $data['product_sellnum'];
					if($exist->stock->available_quantity < 0 && $exist->stock->has_parent)
					{
						$parent = Product::model()->find("id = '{$exist->stock->parent_id}' and cid={$this->cid}");
						if($parent->id)
						{
							while($exist->stock->available_quantity < 0)
							{
								$exist->stock->quantity += $exist->stock->product_num;
								$exist->stock->available_quantity += $exist->stock->product_num;
								$parent->stock->quantity -= 1;
								$parent->stock->available_quantity -= 1;
							}
							$parent->stock->save();
						}
					}
					$exist->stock->save();
					$item->profit = $data['product_allprice'] - ($exist->av_inprice * $data['product_sellnum']);
					$item->save();
					$all_sell_price += $data['product_allprice'];
					$all_in_price += $exist->av_inprice * $data['product_sellnum'];
				}
				$table->all_in_price = $all_in_price;
				$table->all_sell_price = $all_sell_price;
				$table->save();
				$result = array("success"=>true,"msg"=>"提交成功");
			}
		}
			echo CJSON::encode($result);
		
	}
}