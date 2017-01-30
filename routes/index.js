const express = require('express');
const cipher = require('./../helper/cipher');

const router = express.Router();


// 首页
router.get('/', (req, res, next) => {
  console.log('req.session: ', req.session);
  console.log('req.cookies: ', req.cookies);
  req.getConnection((errConn, connection) => {
    const sql1 = 'select * from user where uid in (?,?,?)';
    connection.query(sql1, [1, 2, 3], (errQuery1, result1) => {
      if (errQuery1) {
        return next(errQuery1);
      }

      const sql2 = 'select * from user where uid=? OR uid=?';
      connection.query(sql2, [5, 7], (errQuery2, result2) => {
        if (errQuery2) {
          return next(errQuery2);
        }

        const sql3 = 'select * from user where uid=?';
        connection.query(sql3, [3], (errQuery3, result3) => {
          if (errQuery3) {
            return next(errQuery3);
          }
          console.log('result: ', result3);
          const result = [result1, result2, result3];
          res.render('index', {
            title: 'Home Page',
            list: result,
          });
        });
      });
    });
  });
});


// 登录页面
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'LOGIN',
  });
});


// 登录操作
router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username) {
    return res.json({
      code: 1001,
      message: 'username should not be empty',
    });
  }
  if (!password) {
    return res.json({
      code: 1001,
      message: 'password should not be empty',
    });
  }
  req.getConnection((errConn, connection) => {
    if (errConn) {
      console.error('connection error: ', errConn);
      return res.json({
        code: 1002,
        message: 'connect database error',
      });
    }

    const sql = 'SELECT * FROM user WHERE username=?';
    connection.query(sql, [username], (errQuery, users) => {
      if (errQuery) {
        return res.json({
          code: 1003,
          message: 'select userinfo error',
        });
      }
      if (users.length === 0) {
        return res.json({
          code: 1004,
          message: 'user not found',
        });
      }
      const encrypted = cipher.cipher(password);
      if (encrypted !== users[0].password) {
        return res.json({
          code: 1005,
          message: 'password error',
        });
      }
      req.session.user = users[0];
      return res.json({
        code: 0,
        message: 'login success',
      });
    });
  });
});


// 注册页面
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'REGISTER',
  });
});


// 注册操作
router.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  req.getConnection((errConn, connection) => {
    if (errConn) {
      console.error('connection error: ', errConn);
      return res.json({
        code: 1006,
        message: 'connect database error',
      });
    }

    const sql = 'insert into user set ?';
    const data = {
      username,
      password: cipher.cipher(password),
      register_time: new Date().getTime(),
    };

    connection.query(sql, [data], (errQuery, result) => {
      if (errQuery) {
        console.error('query error: ', errQuery);
        return res.json({
          code: 1007,
          message: 'insert userinfo to database error',
        });
      }
      console.log('result: ', result);
      // 将数据存入 session
      // 直接对 session 赋值就可以啦
      req.session.user = data;
      req.session.user.insertId = result.insertId;
      console.log('req.session: ', req.session);
      /**
      * 下面就是 req.session 的值
      * req.session:  Session {
      * cookie:   // req.session.cookie 是 session 初始化之后就具有的对象
      *  { path: '/',
      *    _expires: null,
      *    originalMaxAge: null,
      *    httpOnly: true },
      * user:   // req.session.user 是第 120 行我们给 req.session 对象赋的值
      *  { username: '12123123123123',
      *    password: 'f84d890a78b927031594dc7cf4a467b7',
      *    register_time: 1485532973072,
      *    insertId: 10 } }
      */
      // 当第 119 行和第 120 行执行结束后，只要是相同客户端（浏览器）发送过来的请求
      // req.session 对象就完全一样
      // 比如我们这里的逻辑是先注册，注册成功之后设置一个 session:  req.session.user（1)
      // 接下来，访问任何一个路由，req.session.user 的值都会和 (1) 的值完全一样
      // 这样就达到了保存用户登录状态的目的（注册成功之后，默认就是已登录状态了）
      // 因为登录成功（注册成功）后，req.session.user 是有值的
      // 所以每次我们只需要判断一下 req.session.user 是否有值，就能知道用户是否登录了
      // 见第 157 行
      return res.json({
        code: 0,
        message: 'register success',
        userId: result.insertId,
      });
    });
  });
});


// 成功信息页面
router.get('/success', (req, res) => {
  console.log('req.session: ', req.session);
  let message = '';
  if (req.session.user) {
    // req.session.user 存在，说明用户已经登录（或者注册成功。登录成功或注册成功后，都是已登录状态）
    // 接下来就可以取出该登录用户的用户信息，即 req.session.user 的值
    message = '用户已经登录';
  } else {
    // req.session.user 不存在，说明用户没有登录
    // 接下来就可以执行一些处理未登录的逻辑。比如用户跳转到登录页面
    message = '用户未登录';
  }
  // const message = decodeURI(req.query.message);
  res.render('success', {
    title: 'success',
    message,
  });
});


module.exports = router;
