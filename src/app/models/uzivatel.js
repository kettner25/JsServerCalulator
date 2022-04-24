const jsondb = require('simple-json-db');
const database = new jsondb('../data/uzivatele.json');

const bcrypt = require('bcryptjs');

if (database.get("nextID") == null) {
    database.set("nextID", 0);
}

function DBToArray() {
    let data = new Array();

    let id = 0;
    while (database.has(""+id)) {
        data.push(database.get(""+id));
        id++;
    }

    console.log(data);
    return data;
}

exports.OverUzivatele = (jmeno, heslo) => {
    if (jmeno == "" && heslo == "")
        return false;

    let data = DBToArray();

    console.log(data.map(u => u.jmeno));

    if (data.map(u => u.jmeno).indexOf(jmeno) < 0)
        return false;

    let uzivatel = data[data.map(u => u.jmeno).indexOf(jmeno)];

    console.log(uzivatel);

    if (!bcrypt.compareSync(heslo, uzivatel.hash)) 
        return false;

    return true;
}

exports.OverJmenoUzivatele = (jmeno) => {
    let data = DBToArray();

    if (data.map(u => u.jmeno).indexOf(jmeno) >= 0)
        return true;

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