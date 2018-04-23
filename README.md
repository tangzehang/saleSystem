# saleSystem
货物销售管理系统
1.把database.sql 以及 value.sql导入mysql中.
2.把代码部署到服务器上面,入口脚本设置为index.php
3.修改protected/config/main.php里面mysql的连接配置
'db'=>array(
			'connectionString' => 'mysql:host=localhost;dbname=store;port=3306',
			'emulatePrepare' => true,
			'username' => 'root',
			'password' => '123456',
			'charset' => 'utf8',
)
修改为自己mysql的配置
