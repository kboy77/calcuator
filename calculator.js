/* Holds the equation */

let entry='';

/* For parsing the equation */

let lastPos=0;
let subPiece='';

/* For limiting the equation to keep it in the display */

let opCount=0;
let eqCount=0;

/* Toggles to turn buttons on and off */

let opToggle=false;
let btnToggle=true;
let decToggle=true;
let exeToggle=true;
let brktToggle=true;
let brktBlock=false;

/* Array for symbols */

var symArray=['*', '/', '+', '-', '(', ')'];

/* Constants for setting up display */

const displayField=document.querySelector('#display');
const displayContent=document.createElement('div');

displayContent.setAttribute('style', 'height: 100px; margin-top: 20px;');

/* Setting up the buttons for Event Listeners */

const buttons=document.querySelectorAll('.number');
const operator=document.querySelectorAll('.operator');
const clear=document.querySelectorAll('.clear');
const execute=document.querySelectorAll('.execute');
const decimal=document.querySelectorAll('.decimal');
const bracket=document.querySelectorAll('.bracket');
const backspace=document.querySelectorAll('.backspace');

/* functions for number buttons.  Also includes some code to manage the size of the equation for display */

buttons.forEach((button) => {
    button.addEventListener('click', (e) =>{
        opToggle=true;
        if (eqCount==30) {
            btnToggle=false;
        }
        if (eqCount < 7) {
            displayContent.style.fontSize='60px';
        }
        if (btnToggle) {
            entry+=button.textContent;
            if (brktToggle) {
                brktBlock=true;
            }
            display(entry);
            opCount+=1;
            eqCount+=1;
            if (opCount > 7) {
                alert("Please keep input items to 8 digits in size");
                btnToggle=false;
                opCount=0;
            }
        }

    });
});

/* buttons for operations set up */

operator.forEach((operator) => {
    operator.addEventListener('click', (e) =>{
        if (eqCount==29) {
            opToggle=false;
        };
        if (opToggle) {
            entry+=operator.textContent;
            opToggle=false;
            btnToggle=true;
            decToggle=true;
            brktBlock=false;
            opCount=0;
            eqCount+=1;
            display(entry);
        }
    });
});

/* buttons for decimal set up */

decimal.forEach((decimal) => {
    decimal.addEventListener('click', (e) =>{
        if (eqCount==29) {
            decToggle=false;
        };
        if (decToggle) {
            entry+=decimal.textContent;
            opToggle=false;
            decToggle=false;
            eqCount+=1;
            opCount+=1;
            display(entry);
            if (opCount > 7) {
                alert("Please keep input items to 8 digits in size");
                btnToggle=false;
                opCount=0;
            }
        }
    });
});

/* Bracket button set up */

bracket.forEach((bracket) => {
    bracket.addEventListener('click', (e) =>{
        if (!brktBlock) {
           if (brktToggle) {
                entry+="(";
                display(entry);
                brktToggle=false;
            }
            else {
                entry+=")";
                display(entry);
                brktToggle=true;
                brktBlock=true;
            }
        }
    });
});


/* backspace button */

backspace.forEach((backspace) => {
    backspace.addEventListener('click', (e) =>{
        if (entry.charAt(entry.length-1)=='.') {
            decToggle=true;
            btnToggle=true;
            entry=entry.substring(0,entry.length-1);
            display(entry);
        }
        else if (entry.charAt(entry.length-1)=='+' || entry.charAt(entry.length-1)=='/' || entry.charAt(entry.length-1)=='-' || entry.charAt(entry.legnth-1)=='*') {
            opToggle=true;
            btnToggle=true;
            entry=entry.substring(0,entry.length-1);
            display(entry);

            for (i=0; i<symArray.length; i++) {
                if (entry.lastIndexOf(symArray[i]) > lastPos) {
                    lastPos=entry.lastIndexOf(symArray[i]);            
                }
            }

            subPiece=entry.substring(lastPos, entry.length-1);

            if (subPiece.lastIndexOf('.')) {
                decToggle=false;
            }
            else {
                decToggle=true;
            }

        }
        else if (entry.charAt(entry.length-1)==')') {
            brktBlock=false;
            brktToggle=false;
            entry=entry.substring(0,entry.length-1);
        }
        else if (entry.charAt(entry.length-1)=='(') {
            brktToggle=true;
            entry=entry.substring(0,entry.length-1);
        }
        else {
            opToggle=true;
            btnToggle=true;
            entry=entry.substring(0,entry.length-1);
            display(entry);
            for (i=0; i<symArray.length; i++) {
                if (entry.lastIndexOf(symArray[i]) > lastPos) {
                    lastPos=entry.lastIndexOf(symArray[i]);            
                }
            }

            subPiece=entry.substring(lastPos, entry.length-1);
            console.log(subPiece);

            if (subPiece.lastIndexOf('.')!=-1) {
                alert("test");
                decToggle=false;
            }
            else {
                decToggle=true;
            }
        }
    });
});

/* Clear button set up */

clear.forEach((clear) => {
    clear.addEventListener('click', (e) => {
        entry='';
        opCount=0;
        eqCount=0;
        opToggle=false;
        btnToggle=true;
        decToggle=true;
        displayContent.style.fontSize='60px';
        display(entry);
    });
});

/* Execute button set up - includes a check to ensure not dividing by 0*/

execute.forEach((execute) => {
    execute.addEventListener('click', (e) => {
        for (i=0; i< entry.length; i++) {
            if (entry.charAt(i)=='/' && entry.charAt(i+1)=='0') {
                exeToggle=false;
            }
        }
        if (exeToggle) {
            display(evaluate(entry));
            entry=evaluate(entry);
        }
        else {
            display("CAN'T DIVIDE BY 0!!  START OVER!!!");
            entry='';
            opCount=0;
            eqCount=0;
            opToggle=false;
            btnToggle=true;
            decToggle=true;
            exeToggle=true;
        }
    });
});

/*  Logic for evaluating the expression */

function evaluate (entry) {

    /* variables to parse equation to an array */

    lastPos = 0;
    let subEquationSize=0;
    let operand;

    /* variable to perform calculations and return solution */

    let tempVar;

    /* arrays for manipulating/evaluating equation */

    var equation = [];
    var solution = [];

    /* parses equation into an array for analysis */

    for (i=0; i<entry.length; i++) {
        if (entry.charAt(i)=='+' || entry.charAt(i)=='-' || entry.charAt(i)=='*' || entry.charAt(i)== '/' || entry.charAt(i)=='(' || entry.charAt(i)==')') {
            operand=entry.slice(lastPos, i);
            if (!operand=="") {
                equation.push(operand);
            }  
            equation.push(entry.charAt(i));
            lastPos=i+1;
        }
    }

    operand=entry.slice(lastPos, entry.length);

    if (!operand=="") {
        equation.push(operand);
    }

    /* order of operations - evaluates brackets first and rebuilds equation */

    while (equation.findIndex(testOpBrkt) != -1) {
        var subEquation='';
        for (i=(equation.findIndex(testOpBrkt)+1); i<=(equation.findIndex(testClBrkt)-1); i++) {
            subEquation+=equation[i];
            subEquationSize+=1;
        }
        
        tempVar=evaluate(subEquation);
        lasPos=0;
        
        for (i=0; i<equation.length; i++) {
            if (i==(equation.findIndex(testOpBrkt))){
                solution.push(tempVar);
                i+=subEquationSize+1;
            }
            else {
                solution.push(equation[i]);
            }
        }

        equation=solution;
        solution=[];
        subEquationSize=0;
    }

    /* order of operations - evaluates multiplication first and rebuilds equation */

    while (equation.findIndex(testMult) != -1) {
        tempVar=multiply(Number(equation[equation.findIndex(testMult)-1]), Number(equation[equation.findIndex(testMult)+1]));
        for (i=0; i<equation.length; i++) {
            if (i!=(equation.findIndex(testMult)-1)) {
                solution.push(equation[i]);
            }
            else {
                solution.push(tempVar);
                i+=2;
            }
        }
        equation=solution;
        solution=[];
    }

    /* order of operations - evaluates division second and rebuilds equation - ensures no division by  */

    while (equation.findIndex(testDiv) != -1) {

        if (equation[equation.findIndex(testDiv)+1]=='0') {
            console.log(equation[equation.findIndex(testDiv)+1]);
            return "CAN'T DIVIDE BY 0!! START OVER";
        }

        tempVar=divide(Number(equation[equation.findIndex(testDiv)-1]), Number(equation[equation.findIndex(testDiv)+1]));
        
        for (i=0; i<equation.length; i++) {
            if (i!=(equation.findIndex(testDiv)-1)) {
                solution.push(equation[i]);
            }
            else {
                solution.push(tempVar);
                i+=2;
            }
        }

        equation=solution;
        solution=[];
    
    }

    /* addition and subtraction done in order of appearance */

    tempVar=Number(equation[0]);

    for (i=0; i<equation.length; i++) {
        if (equation[i]=='+') {
            tempVar+=Number(equation[i+1]);
        }
        else if (equation[i]=='-') {
            tempVar-=Number(equation[i+1]);
        }
    }

    /* formatting solution for display */

    tempVar=Number(tempVar);

    if (!Number.isInteger(tempVar)) {
        tempVar=tempVar.toFixed(2);
    }
    else if ((tempVar.toString()).length>8) {
        tempVar=tempVar.toExponential(8);
    }

    return tempVar;
}

/* Functions to find symbols in array */

function testMult (value) {
    return value=='*';
}

function testDiv (value) {
    return value=='\/';
}

function testOpBrkt (value) {
    return value=='(';
}

function testClBrkt (value) {
    return value==')';
}

/* Display function */

function display(entry) {
    if (entry.length > 8) {
        displayContent.setAttribute('style', 'margin-top: 0px');
        displayContent.style.fontSize='40px';
    }
    displayContent.textContent=entry;
    displayField.appendChild(displayContent);
}

/* Math functions */

function add (num1, num2) {
    return Number(num1+num2);
}

function subtract (num1, num2) {
    return Number(num1-num2);
}

function multiply (num1, num2) {
    return Number(num1*num2);
}

function divide (num1, num2) {
    return Number(num1/num2);
}