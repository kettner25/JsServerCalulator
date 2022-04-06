const jsondb = require('simple-json-db');
const database = new jsondb('../data/uzivatele.json');

const bcrypt = require('bcryptjs');

if (database.get("nextID") == null) {
    database.set("nextID", 0);
}

exports.OverUzivatele = (jmeno, heslo) => {
    
    return false;
}

exports.PridejUzivatele = (jmeno, heslo) => {
    database.set(String(database.get(nextID), {
        jmeno: jmeno, heslo: bcrypt.hashSync(heslo)
    }));
}