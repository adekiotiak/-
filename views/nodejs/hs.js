const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
var makedr = fs.readFileSync("keijibann/HTML/makedr.html",'utf-8');
const mysql = require('mysql');
const path = require('path');
var name;
const bycycle = fs.readFileSync("views/images/bycycle.jpg");

const coni = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    port: 3306,
    database: 'login'
}

app.use(cookieSession({name: 'express-session', secret: '1887b556dde6f359d6ccc8ce54910f69404af5aae20d1243713b4f1f2cac26f0de302d356f2b41e6123c8b87abc9e314a94b986026080d48395f62704de1016e'}));

app.set("view engine", "ejs");

app.use(express.static('ejs'));

app.listen(port, () => console.log('Example app listening on port ${port}!'));

app.get('/', (req,res) => {
    res.render("login", {message: ""});
});

app.use(express.urlencoded({extended:true}));

app.get('/makedr', (req,res) => res.send(makedr));

//ログイン処理↓↓
app.post('/loginpage/login', function (req,res) {
    let id = req.body.id;
    let pass = req.body.pass;
    let con1;
    try {
        con1 = mysql.createConnection(coni);
        con1.connect();
        const sql = 'SELECT * FROM login WHERE l_id = ? AND l_pass = ?';
        con1.query(sql,[id, pass],(err,result,fields) => {
            const login = result[0];
            if(login) {
                req.session.userId = id;
                req.session.userName = login.l_name;
                res.redirect('/home');
            }
            else {
                res.render('login', {message: 'IDかパスワードが正しくありません。もう一度お試しください。'})
            } 
        });
    } catch(err) {
        console.log(err);
        res.render('login',{message: 'エラーが発生しました。お手数ですが管理者にご連絡ください'})
    }
}); 

//ホーム画面の処理↓↓
app.get('/home', (req, res) => {
    const user = {id:req.session.userId, name:req.session.userName};    // セッションからIDとNameを取り出してuserに保存
    const days = [];                                                 // 注文履歴を保存する用のrecordsを用意
    const names = [];
    let cn;
    try {
        cn = mysql.createConnection(coni);
        cn.connect();
        const sql2 = 'select l_name from login'
        cn.query(sql2, (err,result,fields) => {
            console.log(result);
            for(r of result) {
                names.push(r);
            }
        });
        const sql = 'SELECT m_date FROM makedr WHERE l_name = ?';      // ユーザの注文一覧を抽出するSELECT文
        cn.query(sql, [user.name], (err,result,fields) => {
            for(r of result) {
                days.push(r);                           // recoreds変数に1件分のレコード情報を追加
            }
            console.log(days);
            res.render('home', {user: user, days: days, names:names});
        });
    } catch(err) {
        console.log(err);
    }
    // res.render('home', {user: user, days: days});
});

//日報の処理↓↓
app.post('/makedr/make', function (req,res) {
    let date = req.body.date;
    let maker = req.body.maker;
    let nine = req.body.nine;
    let ten = req.body.ten;
    let eleven = req.body.eleven;
    let twelve = req.body.twelve;
    let thirteen = req.body.thirteen;
    let fourteen = req.body.fourteen;
    let fifteen = req.body.fifteen;
    let sixteen = req.body.sixteen;
    let seventeen = req.body.seventeen;
    const con2 = mysql.createConnection(coni);
    con2.connect(function(err) {
        if(err) throw err;
        const queue = 'select * from makedr where m_date = ?'
        con2.query(queue, [date], (err, result, fields) => {
            if(err) throw err;
            const queueu = 'delete from makedr where m_date = ?'
            const con3 = mysql.createConnection(coni);
            let aru = result[0];
            if(aru) {
                con3.query(queueu, [date]);
            }
        })
        con2.query("insert into makedr values('"+date+"', '"+maker+"', '"+nine+"', '"+ten+"', '"+eleven+"', '"+twelve+"', '"+thirteen+"', '"+fourteen+"', '"+fifteen+"', '"+sixteen+"', '"+seventeen+"')", (err, result2) => {
            if(err) throw err;
            else res.redirect('/home');
        })
    });
});

app.get("/report/date/:dateId/Name/:NameId", (req, res) => {
    console.log(req.params);
    let cn2;
    const drInfo = [];
    try {
        cn2 = mysql.createConnection(coni);
        const sql = 'select * from makedr where m_date = ? and l_name = ?';
        cn2.query(sql, [req.params.dateId,req.params.NameId], (err,result,fields) => {
            for(r of result) {
                drInfo.push(r);
            }
            console.log(drInfo);
            res.render('view', {drInfo: drInfo});
        })
    }
    catch(err) {
        console.log(err);
    }
});

app.get("/report/name/:nameId", (req,res) => {
    const otherName = {name:req.params.nameId};
    const otherdays = [];
    const namesAtOther = [];
    let cn3;
    try {
        cn3 = mysql.createConnection(coni);
        cn3.connect();
        const sql2 = 'select l_name from login'
        cn3.query(sql2, (err,result,fields) => {
            for(r of result) {
                namesAtOther.push(r);
            }
        });
        const sql = 'SELECT m_date FROM makedr WHERE l_name = ?';      // ユーザの注文一覧を抽出するSELECT文
        cn3.query(sql, [otherName.name], (err,result,fields) => {
            for(r of result) {
                otherdays.push(r);                           // recoreds変数に1件分のレコード情報を追加
            }
            console.log(otherdays);
            res.render('others', {otherName: otherName, otherdays: otherdays, namesAtOther:namesAtOther});
        });
    } catch(err) {
        console.log(err);
    }
})

app.get("/images", (req,res) => {
    res.send(bycycle);
})