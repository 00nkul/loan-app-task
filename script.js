// function handle form submit
const form = document.getElementById("my-form-id");
const progress = document.getElementById("progress");
const submitButton = document.getElementById("submit-btn");
const assementDetails = document.getElementById("assesment-details");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log(data);

    // set  progress text to "Uploading..."
    progress.innerText = "Requesting balance sheet ...";

    // send request to server to get balance sheet
    fetch(`http://localhost:3000/balance-sheet/${data.accountnumber}`)
        .then(response => response.text())
        .then(data => {
            console.log(data);
            // set progress text to response from server
            if (data == "No balance sheet found for this account number") {
                progress.innerText = data;
                submitButton.disabled = true;
                return;
            }
            progress.innerText = "Balance sheet found !!!";

            // display balance sheet in balance-sheet div in tabular format
            const balanceSheet = JSON.parse(data);
            console.log(balanceSheet);
            const table = document.getElementById("balance-sheet");
            table.innerHTML = "";
            // insert header row
            const header = table.createTHead();
            const row = header.insertRow();
            const cell1 = row.insertCell();
            const cell2 = row.insertCell();
            const cell3 = row.insertCell();
            const cell4 = row.insertCell();

            cell1.innerText = "Year";
            cell2.innerText = "Month";
            cell3.innerText = "Profit/Loss";
            cell4.innerText = "Assets Value";

            for (let i = 0; i < balanceSheet.length; i++) {
                const row = table.insertRow();
                const cell1 = row.insertCell();
                const cell2 = row.insertCell();
                const cell3 = row.insertCell();
                const cell4 = row.insertCell();

                cell1.innerText = balanceSheet[i].year;
                cell2.innerText = balanceSheet[i].month;
                cell3.innerText = balanceSheet[i].profitOrLoss;
                cell4.innerText = balanceSheet[i].assetsValue;
            }
            submitButton.disabled = false;
        }
        );
});

// function to handle click on submit button
submitButton.addEventListener("click", () => {
    // set progress text to "Uploading..."
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log(data);
    progress.innerText = "Validating Your Application...";

    // send request to server to validate application
    fetch(`http://localhost:3000/validate-application`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            data = JSON.parse(data);

            progress.innerText = "";
            
            let header = document.createElement("h2");
            header.innerText = "Assessment Details";
            assementDetails.appendChild(header);

            let para = document.createElement("p");
            para.innerText = `Pre-assessment score: ${data.preAssessment} 
            Name: ${data.name} 
            Years of experience: ${data.YOE} 
            Profit/Loss: ${data.profitOrLoss}`;
            assementDetails.appendChild(para);

            progress.innerText = "Your application has been submitted successfully and sent to the descision engine for further evaluation. We will get back to you soon.";
        });
});