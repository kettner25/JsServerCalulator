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

    let statistika = "";

    for (let i = 0; i < 9; i++)
        statistika += "0;"

    statistika+="0";

    database.set(id, { jmeno, hash, statistika } );

    database.set("nextID", database.get("nextID") + 1);

    console.log(`${jmeno};${heslo}`);
}

exports.ZmenStatistiku = (jmeno, cislo) => {
    let data = DBToArray();

    if (data.map(u => u.jmeno).indexOf(jmeno) < 0)
        return;

    let index = data.map(u => u.jmeno).indexOf(jmeno);

    let stat = data[index].statistika;
    let hash = data[index].hash;

    let cisla = stat.split(";");
    cisla[cislo] = "" + (Number(cisla[cislo]) + 1);

    let statistika = "";

    for (let i = 0; i < 9; i++)
        statistika += cisla[i]+";";

    statistika += cisla[9];

    console.log(index, statistika);

    database.set(""+index, { jmeno, hash, statistika });
}

exports.VratStatistiku = (jmeno) => {

}