<script type="text/javascript">
    window.user = '<?php echo Yii::app()->session['name'];?>';
</script>
<script src = "<?php echo Yii::app()->request->baseUrl; ?>/js/site/index.js"></script>
<iframe id='cf' name='contentIframe' style='height:100%;width:100%' frameborder="no"></iframe>