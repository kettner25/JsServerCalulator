const session = require('express-session');
const express = require("express");
const app = express();

const uzivatele = require(".\\models\\uzivatel");

app.set('view engine', 'ejs');
app.set("views", "app/views");

app.use(express.static('app/static'));

app.use(session({
    secret: "hfsakjfhkjsahfsakhfhsafhs5454ahfsahkfh&#×÷kjfhkjhfhsakjfhsakjhfkjsah",
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: 'strict',
        expires: 60000 * 10,
    }
}));

app.use(express.urlencoded({
    extended: false
}));

app.get("/", (req, res) => {
    res.render("index", {
        prihlasen: req.session != undefined && req.session.Uzivatel != null && req.session.Uzivatel != ""
    });
});

app.get("/kalkulacka", (req, res) => {
    if (req.session == undefined || req.session.Uzivatel == null || req.session.Uzivatel == "") {
        return res.redirect("/login");
    }
    
    res.render("kalkulacka", {
        prihlasen: true
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});
app.post("/login", (req, res) => {
    let jmeno = req.body.jmeno;
    let heslo = req.body.heslo;

    if (jmeno == null && heslo == null) {
        return res.redirect("/login");
    }

    if (!uzivatele.OverUzivatele(jmeno, heslo)){
        return res.redirect("/login");
    }

    req.session.Uzivatel = ""+jmeno;

    res.redirect("/kalkulacka");
});

app.get("/logout", (req, res) => {
    if (req.session != null)
        req.session.Uzivatel == "";

    res.redirect("/");
});

app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", (req, res) => {
    let jmeno = req.body.jmeno;
    let heslo = req.body.heslo;
    let kontrola = req.body.kontrolniHeslo;

    if (jmeno == "" || heslo == "" || heslo != kontrola){
        console.log("heslo != heslo");
        return res.redirect("/register");
    }
    if (uzivatele.OverJmenoUzivatele(jmeno))
        return res.redirect("/register");

    uzivatele.PridejUzivatele(jmeno, heslo);

    res.redirect("/login");
});

app.post("/SendStat", (req, res) => {
    let cislo = req.url.split("=")[1];

    console.log(cislo);

    if (req.session.Uzivatel == null || req.session.Uzivatel == "")
        res.end();

    uzivatele.ZmenStatistiku(req.session.Uzivatel, cislo);

    res.end();
});

app.post("/ResetStat", (req, res) => {
    if (req.session.Uzivatel == null || req.session.Uzivatel == "")
        res.end();

    uzivatele.ZmenStatistiku(req.session.Uzivatel, 0, true);

    res.end();
});

app.post("/VratStat", (req, res) => {
    console.log(req.session.Uzivatel);

    if (req.session.Uzivatel == null || req.session.Uzivatel == "")
        res.send();
    
    let statistika = uzivatele.VratStatistiku(req.session.Uzivatel);

    res.send(JSON.stringify(statistika));
});

app.listen(8000, "localhost", () => {
    console.log("Server is running on port 8000");
});