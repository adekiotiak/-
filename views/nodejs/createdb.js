const mysql = require('mysql');

let con = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    port: 3306,
};

function createLogin() {
    conn = mysql.createConnection(con);
    conn.connect(function (err) {
        if (err) throw err;
        console.log('Connected');
        conn.query('drop DATABASE IF EXISTS login', function (err, result) {
            if(err) throw err;
            console.log('database droped')
        })
        conn.query('CREATE DATABASE login', function (err, result) {
            if(err) throw err;
            console.log('database created')
        })
        conn.query('use login', function (err, result) {
            if(err) throw err;
            console.log('enter database')
        })
        conn.query('CREATE TABLE login ( l_id VARCHAR(255) PRIMARY KEY, l_pass VARCHAR(255) NOT NULL, l_name varchar(45))', function (err, result) {
            if(err) throw err;
            console.log('login table created')
        })
        conn.query('CREATE TABLE utilizeLog ( l_id VARCHAR(255) , U_time datetime)', function (err, result) {
            if(err) throw err;
            console.log('utilizeLog table created')
        })
        conn.query("INSERT INTO login(l_id, l_pass, l_name) VALUES('kanri','k3lodis8','滝谷'), ('gagaga','ldso3ihd9s','小林')", function (err, result) {
            if(err) throw err;
            console.log('data inserted to login')
        })
        conn.query('create table makedr (m_date char(10), l_name varchar(45), m_nine varchar(600), m_ten varchar(600), m_ele varchar(600), m_twel varchar(600), m_thir varchar(600), m_four varchar(600), m_fif varchar(600), m_six varchar(600), m_sev varchar(600))', function (err,result) {
            if(err) throw err;
            console.log('makedr table created')
        })
        conn.query("INSERT INTO makedr VALUES('2014-01-02','小林','dd','d','d','d','d','d','d','d','d')", function (err, result) {
            if(err) throw err;
            console.log('data inserted to makedr')
        })
        conn.query("INSERT INTO makedr VALUES('2014-01-04','滝谷','い','ち','が','つ','よ','っ','か','で','す')", function (err, result) {
            if(err) throw err;
            console.log('data inserted to makedr')
        })
    });
}

const l = new createLogin();
