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

module.exports = router;
