<?php

/**
 * This is the model class for table "tbl_menu".
 *
 * The followings are the available columns in table 'tbl_menu':
 * @property string $id
 * @property string $name
 * @property string $parentid
 * @property string $haschild
 */
class Product_check_items extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @return Person the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		Yii::app()->db->tablePrefix = 'tbl_';
		return '{{product_check_items}}';
	}
	
	public function relations(){
		return array(
		'table'=>array(
		self::BELONGS_TO,
		'Product_check_table',
		'table_id',
		'select'=>array("createdate","confirmdate","status","remark"),
		),
		'product'=>array(
		self::BELONGS_TO,
		'Product',
		'product_id',
		'select'=>array("catagoryid","code","name","status"),		
		)
		);
	}
}