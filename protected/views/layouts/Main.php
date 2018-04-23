<?php /* @var $this Controller */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<link rel="shortcut icon" href="/favicon.ico" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />
	 <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/ext/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/icon.css"/>
     <script src = "<?php echo Yii::app()->request->baseUrl; ?>/ext/adapter/ext/ext-base.js"></script>
    <script src = "<?php echo Yii::app()->request->baseUrl; ?>/ext/ext-all.js"></script>
     <script src = "<?php echo Yii::app()->request->baseUrl; ?>/js/normal.js"></script>
	<!-- blueprint CSS framework -->
	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<?php //<body   onload="window.open(document.location,'_blank','fullscreen=1');opener=null;window.close()">?>
<body>

<div class="container" id="page">
	<?php echo $content; ?>
</div><!-- page -->

</body>
</html>
