const express = require('express');
const cors = require('cors');

//建立一個Express伺服器
const app = express();

//告訴server聽取3000這個Port
app.listen(3000, function () {
  console.log('demo-express is running on port 3000!');}
);

app.use(cors());
app.use(express.json());

// login
app.post('/rest/management/login', function(req, res) {
	console.log('POST /login');
	const account = req.body.account;
	const pwd = req.body.pwd;
	console.log('User[' + account + '] login!');
	res.json({
		errorCode: 0,
		errorMessage: 'success',
		data: {
			accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJKV1RUb2tlbiIsInVzZXJfaWQiOjIwMCwiaXNzIjoiRG9jRm9ybSIsImZvciI6MiwidHlwZSI6MSwiZXhwIjoxNTUzODQ5NDEzfQ.N6on70jAAMZTDluibLq0egRegVxDOgtoH1I9hK3A3WI',
			refreshToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJKV1RUb2tlbiIsInVzZXJfaWQiOjIwMCwiaXNzIjoiRG9jRm9ybSIsImZvciI6MiwidHlwZSI6MiwiZXhwIjoxNTUzODUwMzEzfQ.QIcZS5HD-19f_zBEJ_sDfXQamPGYG9ycxFptHI8IeaI',
			expiresIn: 900,
			tokenType: 'Bearer',
			scope: [
				{ permissionName: 'CG_Page1', permissionClass: 'User' },
				{ permissionName: 'CG_Page3', permissionClass: 'User' }
			],
			userInfo: {
				userId: 200,
				userName: 'admin',
				cname: 'Administrator'
			}
		}
	});
});

// refresh
app.post('/rest/management/refresh', function(req, res) {
	console.log('POST /refresh');
	console.log('Refresh!');
  // res.sendStatus(400);
	res.json({
		errorCode: 0,
		errorMessage: 'success',
		data: {
			accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJKV1RUb2tlbiIsInVzZXJfaWQiOjIwMCwiaXNzIjoiRG9jRm9ybSIsImZvciI6MiwidHlwZSI6MiwiZXhwIjoxNTUzODUwMzEzfQ.QIcZS5HD-19f_zBEJ_sDfXQamPGYG9ycxFptHI8IeaI',
			refreshToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJKV1RUb2tlbiIsInVzZXJfaWQiOjIwMCwiaXNzIjoiRG9jRm9ybSIsImZvciI6MiwidHlwZSI6MiwiZXhwIjoxNTUzODUwMzEzfQ.QIcZS5HD-19f_zBEJ_sDfXQamPGYG9ycxFptHI8IeaI',
			expiresIn: 900,
			tokenType: 'Bearer',
			scope: [
				{ permissionName: 'CG_Page1', permissionClass: 'User' },
        { permissionName: 'CG_Page3', permissionClass: 'User' }
			]
		}
	});
});

// logout
app.post('/rest/management/logout', function(req, res) {
  console.log('POST /logout');
  res.json({
		errorCode: 0,
		errorMessage: 'success',
		data: {
			logoutUrl: 'https://google.com'
		}
	});
});

// get user list
app.get('/rest/management/user/list', function(req, res) {
  console.log('GET /user/list');
  res.json({
		errorCode: 0,
		errorMessage: 'success',
		data: {
			amount: 3,
      result: [
        { userId: 200, userName: 'doreen' },
        { userId: 201, userName: 'jessica' },
        { userId: 202, userName: 'christy' }
      ]
		}
	});
});

var i = 0;

// get user list
app.get('/rest/management/user/list/fail', function(req, res) {
  console.log('GET /user/list/fail');
  i++;
  if (i%2 != 0) {
    res.sendStatus(401);
  } else {
    res.json({
      errorCode: 0,
      errorMessage: 'success',
      data: {
        amount: 3,
        result: [
          { userId: 200, userName: 'doreen' },
          { userId: 201, userName: 'jessica' },
          { userId: 202, userName: 'christy' }
        ]
      }
    });
  }
});
