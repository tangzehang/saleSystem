# saleSystem
<p><a href="http://bestot.cn/2018/04/20/%E8%B4%A7%E7%89%A9%E9%94%80%E5%94%AE%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F/" target="_blank" rel="noopener">示例地址</a></p>
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
