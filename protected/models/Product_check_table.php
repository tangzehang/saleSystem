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
class Product_check_table extends CActiveRecord
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
		return '{{product_check_table}}';
	}
	
	public function relations()
	{
		return array(
		'items'=>array(
		self::HAS_MANY,
		'Product_check_items',
		'table_id',
		'index'=>'id'
		),
		);
	}
}