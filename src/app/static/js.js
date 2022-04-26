const display = document.getElementById("display");
const historie = document.getElementById("historie");
const operatory = ["+", "-", "×", "÷"];
const fce = ["1/x", "x^2", "2√x", "%", "CE", "C", "back", "+/-", "="]; /* zlomek, mocnina, odmocnina, procento, vymaz display, vymaz priklad, vymaz znam, *-1, rovná se */

var DelHistorii = false;
var operator = "";
var uplatnenyOperator = "";
var prvniCislo = 0;

var zobrazStat = false;

setInterval(ZiskejData, 500);

$(document).ready(function () {
    $(".button").click(function () {
        const button = $(this).text();
        
        ProvedPrikaz(button);
    }); 
});

function ProvedPrikaz(button) {
    //button = button.replace("2√x", "√");
    //button = button.replace("x^2", "P");

    if (DelHistorii) {
        historie.innerHTML = "";
        DelHistorii = false;
    }

    for (let i = 0; i < 10; i++){
        if ("" + i == button) {
            if (operator != ""){
                if (prvniCislo != 0) {
                    ProvedOperaci();
                    display.innerHTML = 0;
                }
                else {
                    console.log(1);
                    prvniCislo = parseFloat(display.innerHTML);
                    display.innerHTML = 0;
                    uplatnenyOperator = operator;
                }
                operator = "";
            }
            
            pridat(button);
            display.innerHTML = display.innerHTML == "0" ? "" + i : display.innerHTML + "" + i;
            break;
        }
    }
    
    if (button == "," && display.innerHTML.indexOf(".") <= -1){
        display.innerHTML += ".";
    }
    if (button == "="){
        
    }

    if (fce.indexOf(button) > -1){
        ProvedFci(button);
    }

    for (let i = 0; i < operatory.length; i++){
        if (button == operatory[i]){
            if (operator == ""){
                historie.innerHTML += display.innerHTML + button;
                
                operator = button;
                break;
            }
            else {
                operator = button;
                historie.innerHTML = historie.innerHTML.slice(0, -1) + button;
            }
        }
    }
}
function ProvedFci(button) {
    /* zlomek, mocnina, odmocnina, procento, vymaz display, vymaz priklad, vymaz znak, *-1, rovná se 
        0         1         2          3            4              5            6        7      8    */
    switch (button) {
        case fce[0]:
            display.innerHTML = 1 / display.innerHTML;
            break;
        case fce[1]:
            display.innerHTML = Math.pow(parseFloat(display.innerHTML), 2);
            break;
        case fce[2]:
            display.innerHTML = Math.pow(parseFloat(display.innerHTML), 1/2);
            break;
        case fce[3]:
            display.innerHTML /= 100;
            break;
        case fce[4]:
            display.innerHTML = 0;
            break;
        case fce[5]:
            display.innerHTML = 0;
            historie.innerHTML = "";
            prvniCislo = 0;
            break;
        case fce[6]:
            display.innerHTML = display.innerHTML.slice(0, -1);
            display.innerHTML = display.innerHTML == "" || display.innerHTML == "-" ? 0 : display.innerHTML;
            break;
        case fce[7]:
            display.innerHTML *= -1;
            break;
        case fce[8]:
            ProvedOperaci();
            historie.innerHTML += display.innerHTML + " =";
            display.innerHTML = prvniCislo;
            DelHistorii = true;
            prvniCislo = 0;
            break;
    }
}

function ProvedOperaci() {
    switch (uplatnenyOperator) {
        case "+":
            prvniCislo += parseFloat(display.innerHTML); 
            break;
        case "-":
            prvniCislo -= display.innerHTML;
            break;
        case "×":
            prvniCislo *= display.innerHTML;
            break;
        case "÷":
            prvniCislo /= display.innerHTML;
            break;
    }
    console.log(prvniCislo, uplatnenyOperator, operator);
    uplatnenyOperator = operator;
}


function pridat(cislice) {
    fetch(`/SendStat?cislo=${cislice}`, {
        method: "POST"
    });
}

function reset() {
    fetch(`/ResetStat`, {
        method: "POST"
    });
}

function statistika() {
    zobrazStat = !zobrazStat;

    if (zobrazStat) {
        document.getElementById("statistika").style.display = "grid";
    }
    else {
        document.getElementById("statistika").style.display = "";
    }
}

function ZiskejData() {
    fetch(`/VratStat`, {
        method: "POST"
    }).then(response => response.json())
    .then(data => VykresliStat(data));
}
function VykresliStat(data) {
    let pocet = document.getElementsByClassName("pocet");

    data = data.split(";");

    for (let i = 0; i < data.length; i++) {
        pocet[i].innerHTML = data[i];
    }
}