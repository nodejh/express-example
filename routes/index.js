const express = require('express');
const cipher = require('./../helper/cipher');

const router = express.Router();

/**
 * GET home page.
 * @type {String}
 */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home Page',
  });
});


router.get('/register', (req, res) => {
  res.render('register', {
    title: 'REGISTER',
  });
});


router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  req.getConnection((errConn, connection) => {
    if (errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }

    const sql = 'insert into user set ?';
    const data = {
      username,
      password,
      register_time: new Date().getTime(),
    };

    connection.query(sql, [data], (errQuery, result) => {
      if (errQuery) {
        console.error('query error: ', errConn);
        return next(errQuery);
      }
      res.render('success', {
        title: 'REGISTER SUCCESS',
        insertId: result.insertId,
      });
    });
  });
});


router.get('/login', (req, res) => {
  res.render('login', {
    title: 'LOGIN',
  });
});


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

    const sql = 'SELECT password FROM user WHERE username=?';
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
      return res.json({
        code: 0,
        message: 'login success',
      });
    });
  });
});


module.exports = router;
