const jsondb = require('simple-json-db');
const database = new jsondb('../data/uzivatele.json');

const bcrypt = require('bcryptjs');

if (database.get("nextID") == null) {
    database.set("nextID", 0);
}

exports.OverUzivatele = (jmeno, heslo) => {
    console.log(database.get("1"));


    return false;
}

exports.PridejUzivatele = (jmeno, heslo) => {
    console.log(database.get("nextID"));

    let hash = bcrypt.hashSync(heslo);
    let id = String(database.get("nextID"));

    database.set(id, { jmeno, hash } );

    database.set("nextID", database.get("nextID") + 1);

    console.log(`${jmeno};${heslo}`);
}