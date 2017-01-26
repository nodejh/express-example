(function($) {

  $('#login')
    .on('click', function() {
      var username = $('#username').val();
      if (!username) {
        return swal('username should not be empty', '', 'error');
      }
      var password = $('#password').val();
      if (!password) {
        return swal('password should not be empty', '', 'error');
      }
      var data = {
        username: username,
        password: password,
      };
      $.post('/login', data, function(res) {
        if (res.code === 0) {
          window.location.href = '/success?message=' + encodeURI('登录成功');
        } else {
          swal(res.message, '', 'error');
        }
      });
    });

})(jQuery);
