<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
<table>
    <tbody>
        <?php if(isset($hTitle) && is_array($hTitle)):?>
            <?php foreach($hTitle as $k=>&$v): ?>
                <tr>
                    <td><?=$k?>:<?=$v?></td>
                </tr>
            <?php endforeach;?>
        <?php endif;?>
    </tbody>
</table>
<table>
    <caption>我的标题</caption>
    <thead style="display:table-header-group;font-weight:bold">
        <tr>
            <?php if(isset($head) && is_array($head)): ?>
                <?php foreach($head as &$v): ?>
            <td <?php if(isset($v['width'])):?>style="width:<?=$v['width']?>px"<?php endif;?>><?= $v['data']?></td>
                <?php endforeach;?>
            <?php endif;?>
        </tr>
    </thead>
    <tfoot style="display:table-footer-group;font-weight:bold">
        <tr>
            <td>表单尾部</td>
        </tr>
    </tfoot>
    <tbody>
    <?php if(isset($table) && is_array($table)): ?>
        <?php foreach($table as &$v): ?>
            <tr>
                <?php foreach($v as &$value):?>
                    <td><?= $value?></td>
                <?php endforeach;?>
            </tr>
        <?php endforeach;?>
    <?php endif;?>
    </tbody>

</table>
</body>
</html>