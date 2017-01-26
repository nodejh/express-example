# Express 示例网站

该示例网站的特点：

+ ES6 语法
+ Aribnb ESLint 语法检查
+ MySQL 数据库连接


# Branches

## es6

ES6 语法的基本示例网站。不包数据库等其他配置。

```
$ git clone https://github.com/nodejh/express-example -b es6
$ cd express-example
$ npm install
$ npm start
```

## MySQL

使用 MySQL 数据库的示例网站。连接 MySQL 的包：

+ [mysql](https://www.npmjs.com/package/mysql)
+ [express-myconnection](https://www.npmjs.com/package/express-myconnection)


#### 下载代码

```
$ git clone https://github.com/nodejh/express-example -b mysql
$ cd express-example
```

#### 导入数据库文件

```
$ mysql -uroot -p < express-example/databases/example.sql
```

#### 修改数据库配置

```
// config/config.js
db: {
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'express_example',
},
```

#### 启动

```
$ npm install
$ npm start
```


## BootStrap
