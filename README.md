# ssh2-mysql
ssh2 connection mysql

为了网络安全起见，数据库和后端服务一般不会直接部署在同一台机器上，且一般也不允许直接用账户+密码的方式直接连接，通常采取的方案是通过 ssh 的方式进行连接。

## 步骤

1. ssh 建立连接

2. 与 mysql 建立连接

3. 得到 mysql 操作句柄

## 用法

```javascript

const ssh2mysql = require('ssh2-mysql');
const fs = require('fs');

// see config: https://github.com/mscdex/ssh2
const ssh_conf = {
  host: 'xxx.xxx.xx.1',
  port: 22,
  username: 'realzzz',
  privateKey: fs.readFileSync('/path/to/my/key')
};
// see config: https://github.com/sidorares/node-mysql2
const db_conf = {
  host: 'xxx.xxx.xx.2',
  user: 'realzzzdb',
  password: 'qwer123..',
  database: 'mydb'
};

// example sql statement
const sql_statement = 'INSERT INTO book(name, author) VALUES(?, ?)';
const params = ['JavaScript高级程序设计', 'Nicholas C. Zakas'];

ssh2mysql.connect(ssh_conf, db_conf)
  .then(sql => {
    sql.query(sql_statement, params, (err, res) => {
      if (err) {
        console.log(err);
      }
      // success
      console.log(res);
      ssh2mysql.close()
    })
  })

```


