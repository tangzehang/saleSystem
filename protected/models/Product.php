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
class Product extends CActiveRecord
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
		return '{{product}}';
	}
	
	public function primaryKey()
	{
		return 'id';
	}
	
	public function relations()
	{
		return array(
		'stock'=>array(
		self::HAS_ONE,
		'Stock',
		'product_id',
		'select'=>array('quantity','available_quantity','has_parent','parent_id','product_num'),
		),
		'catagory'=>array(
		self::BELONGS_TO,
		'Catagory',
		'catagoryid',
		'select'=>array('name'),
		),
		);
		
	}
}