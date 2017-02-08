/**
 * 该文件中给出了 async 的例子
 *
 * 路由 / ，是使用回调嵌套方式实现的执行多条 sql
 *
 * 路由 /async_es5， 是 es5 语法的 async.map 的例子
 *
 * 路由 /async，是 es6 语法的 async.map 的例子
 *
 */
const express = require('express');
const async = require('async');
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
          const result = [result1, result2, result3];
          console.log('result: ', result);
          res.render('index', {
            title: 'Home Page',
            list: result,
          });
        });
      });
    });
  });
});


// 使用 async 避免回调嵌套的首页 (e5 语法)
router.get('/async_es5', (req, res) => {
  console.log('req.session: ', req.session);
  console.log('req.cookies: ', req.cookies);
  req.getConnection((errConn, connection) => {
    const sql1 = 'select * from user where uid in (?,?,?)';
    const params1 = [1, 2, 3];
    const sql2 = 'select * from user where uid=? OR uid=?';
    const params2 = [5, 7];
    const sql3 = 'select * from user where uid=?';
    const params3 = [3];
    /**
     * async 传入的是三个参数
     * 分别是：二维数组，函数1，函数2
     *
     *
     * 二维数组其实是即将传递给 函数1 的参数
     * 因为有 3 条 sql 语句，所以数组的第一维有 3 项
     * 每一项又有两个子项，分别是 sql 语句，和 sql 占位符的值
     *
     *
     * 函数1 是执行 sql 的函数
     * 函数1 有两个参数，第一个是上面二维数组传递进来的每一项（共有 3 项）
     * 函数1 会执行三次，因为二维数组有三项。
     * async.map 是并行的，所以 函数1 三次执行是同时进行的。
     * 然后三次执行都是需要时间的，所以哪一次先执行结束，并不能确定
     *
     * 函数1 的第一个参数，就是二维数组的每一项。
     * 如，第一次执行的 params 是 [sql1, params1]。(设为 a)
     *    第二次执行的 params 是 [sql2, params2]。(设为 b)
     *    第三次执行的 params 是 [sql3, params3]。(设为 c)
     * 这三次执行是同步，意思是，a 执行的时候，b、c 也会同时执行；a 是否执行结束，并不影响 b、c。
     *
     *
     * 函数2 有两个参数，分别是 err 和 result
     *
     * err 就是错误消息。也就是，无论某次执行出错，都会返回 err。
     * 如果 a b c 都执行成功，则 err 为 null
     * 然后就可以在 函数2 中判断 err。如果 err 不为 null，就说明某次执行出错了。
     *
     * 第二个参数 result 是执行结果。是一个数组，存放 a b c 的执行结果。
     * 因为 a b c 是并行的，所以 result[0] 可能是 a 的执行结果，也可能是 b 或 c 的执行结果。
     *
     */
    /**
     * async.mao  http://caolan.github.io/async/docs.html#map
     * async.mapSeries   http://caolan.github.io/async/docs.html#mapSeries
     * 上面讲到了 async.map，还有一个类似的方法 async.mapSeries，
     * 它和 map 方法的唯一区别就是，
     * mapSeries 中，三次执行是同步的，也就是 a 执行结束，再执行b，再执行 c。
     * @type {String}
     */
    async.map([[sql1, params1], [sql2, params2], [sql3, params3]], function(params, callback) {
      connection.query(params[0], params[1], (errQuery, resQuery) => {
        if (errQuery) {
          console.log('errQuery: ', errQuery);
          return errQuery;
        }
        console.log('resQuery:', resQuery);
        callback(null, resQuery);
      });
    }, function(err, result) {
      if (err) {
        console.log('err: ', err);
        return false;
      }
      console.log('result: ', result);
      res.render('index', {
        title: 'Home Page',
        list: result,
      });
    });
  });
});


// 使用 async 避免回调嵌套的首页 (e6 语法)
router.get('/async', (req, res) => {
  console.log('req.session: ', req.session);
  console.log('req.cookies: ', req.cookies);
  req.getConnection((errConn, connection) => {
    const sql1 = 'select * from user where uid in (?,?,?)';
    const params1 = [1, 2, 3];
    const sql2 = 'select * from user where uid=? OR uid=?';
    const params2 = [5, 7];
    const sql3 = 'select * from user where uid=?';
    const params3 = [3];
    async.map([[sql1, params1], [sql2, params2], [sql3, params3]], (params, callback) => {
      connection.query(params[0], params[1], (errQuery, resQuery) => {
        if (errQuery) {
          console.log('errQuery: ', errQuery);
          return errQuery;
        }
        console.log('resQuery:', resQuery);
        callback(null, resQuery);
      });
    }, (err, result) => {
      if (err) {
        console.log('err: ', err);
        return false;
      }
      console.log('result: ', result);
      res.render('index', {
        title: 'Home Page',
        list: result,
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
      req.session.user = data;
      req.session.user.uid = result.insertId;
      console.log('req.session: ', req.session);
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
    const userId = req.session.user.uid;
    // req.session.user 存在，说明用户已经登录（或者注册成功。登录成功或注册成功后，都是已登录状态）
    // 接下来就可以取出该登录用户的用户信息，即 req.session.user 的值
    message = `用户已经登录, 用户ID: ${userId}`;
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
