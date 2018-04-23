# saleSystem
<p><a href="http://hwgl.bestot.cn/" target="_blank" rel="noopener">示例地址</a></p>
<p>货物销售管理系统</p>
<p>1.把database.sql 以及 value.sql导入mysql中.</p>
<p>2.把代码部署到服务器上面,入口脚本设置为index.php</p>
<p>3.修改protected/config/main.php里面mysql的连接配置</p>
<pre>
'db'=>array(
			'connectionString' => 'mysql:host=localhost;dbname=store;port=3306',
			'emulatePrepare' => true,
			'username' => 'root',
			'password' => '123456',
			'charset' => 'utf8',
)
</pre>
