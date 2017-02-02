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



## session

使用 session 主要有两步：

+ 初始化 session，详见 `app.js` 第 9 行、第 27 行和第 46 行
+ 使用 session，详见 `routes/index.js` 第 117 行

session 主要用到了 [express-session](https://github.com/expressjs/session) 这个包。

+ [英文文档](https://github.com/expressjs/session)
+ [中文文档](https://www.xgllseo.com/?p=5162)
+ [关于 session 和 cookie 的讲解](https://github.com/alsotang/node-lessons/tree/master/lesson16)


