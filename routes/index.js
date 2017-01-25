const express = require('express');

const router = express.Router();

/**
 * GET home page.
 * @type {String}
 */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Express',
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


module.exports = router;
