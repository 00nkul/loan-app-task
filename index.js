const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//get method route to serve index.html
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.get('/health', (req, res) => res.send('Server is running fine!'));

// route to handle request for balance sheet
// get the id from the request and return the balance sheet for that id
app.get('/balance-sheet/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    // get balance sheet for id from json file
    const balanceSheet = require('./balancesheets.json');
    const sheet = balanceSheet.filter((sheet) => sheet.accNum == id);
    console.log(sheet);
    if (sheet.length == 0) {
        res.send('No balance sheet found for this account number');
    } else {
        res.send(sheet[0]['balance-sheet']);
    }
});

app.post('/validate-application', (req, res) => {
    const data = req.body;
    
    // get balance sheet for id from json file
    const balanceSheet = require('./balancesheets.json');
    const sheet = balanceSheet.filter((sheet) => sheet.accNum == data.accountnumber);
    console.log(sheet);

    const sheetData = sheet[0]['balance-sheet'];
    let preAssessment = 20;

    // find net profit/loss of last 12 months
    let profitOrLoss = 0;
    for (let i = 0; i < 12; i++) {
        profitOrLoss += parseInt(sheetData[i].profitOrLoss);
    }
    console.log(profitOrLoss , "profit or loss");

    if(profitOrLoss > 0) {
        preAssessment = 60;
    }

    // find average assets value of last 12 months
    let assetsValue = 0;
    for (let i = 0; i < 12; i++) {
        assetsValue += parseInt(sheetData[i].assetsValue);
    }
    assetsValue = assetsValue / 12;
    console.log(assetsValue, 'assets value');

    if(assetsValue > data.amount) {
        preAssessment = 100;
    }

    res.send({preAssessment: preAssessment , name: data.name , YOE : data.YOE , profitOrLoss : profitOrLoss  });
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));