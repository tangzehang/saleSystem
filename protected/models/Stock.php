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
class Stock extends CActiveRecord
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
	
	public function primaryKey()
	{
		return 'product_id';
	}
	
	
	public function tableName()
	{
		Yii::app()->db->tablePrefix = 'tbl_';
		return '{{stock}}';
	}
	
    public function relations()
	{
		return array(
		'product'=>array(
		self::BELONGS_TO,
		'Product',
		'parent_id',
		'select'=>array('name'),
		),
		);
		
	}
}