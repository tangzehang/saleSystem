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
class Acountday_item extends CActiveRecord
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
		return '{{acountday_item}}';
	}
	
	public function relations()
	{
		return array(
			'sell_table'=>array(
			self::BELONGS_TO,
			'Sell_table',
			'item_table_id'
			),
			'table'=>array(
				self::BELONGS_TO,
				'Acountday',
				'table_id'
			)
		);
	}


}