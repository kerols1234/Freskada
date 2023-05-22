var stateOfMaterial = [];
$(document).ready(function () {
    if (document.getElementById("Date").value == '') {
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset() * 60000; // get the timezone offset in milliseconds
        const nowLocal = new Date(now.getTime() - timezoneOffset);
        const formattedDate = nowLocal.toISOString().slice(0, 16);

        document.getElementById("Date").value = formattedDate;
    }

    if (document.getElementById("Id").value != "0") {
        for (let row of document.getElementById("sessionMaterial").rows) {
            if (row.rowIndex != 0) {
                stateOfMaterial.push(row.cells[3].innerText);
            }
        }
    }
});

function CheckSessionMaterialFormValid() {
    let valid = true;

    let date = document.getElementById("Date").value;
    let errorDate = document.getElementById("ErrorDate");

    let price = document.getElementById("Price").value;
    let errorPrice = document.getElementById("ErrorPrice");

    if (date == null || date.trim() == "") {
        errorDate.textContent = "The Date is required.";
        valid = false;
    } else {
        errorDate.textContent = "";
    }

    if (price == null || price <= 0) {
        errorPrice.textContent = "The Price is required.";
        valid = false;
    } else {
        errorPrice.textContent = "";
    }

    return valid;
}

function saveChanges() {
    if (CheckSessionMaterialFormValid()) {
        let table = document.getElementById("sessionMaterial");
        let session = {};
        session.Id = document.getElementById("Id").value;
        session.UserId = document.getElementById("UserId").value;
        session.Date = document.getElementById("Date").value;
        session.Note = document.getElementById("Note").value;
        session.Price = document.getElementById("Price").value;
        session.DoctorId = $("#DoctorId option:selected").val();
        session.PatientId = $("#PatientId option:selected").val();
        session.BookingId = $("#BookingId option:selected").val();
        session.SessionMaterials = [];

        if (session.BookingId == 0) {
            session.BookingId = null;
        }

        for (let row of table.rows) {
            if (row.rowIndex != 0) {
                let cells = row.cells;
                let sessionMaterial = {};

                sessionMaterial.MaterialId = cells[3].innerText;
                sessionMaterial.NumberOfPieces = cells[1].innerText;
                //sessionMaterial.Price = cells[2].innerText;

                if (stateOfMaterial.indexOf(sessionMaterial.MaterialId) != -1) {
                    sessionMaterial.SessionId = document.getElementById("Id").value;
                } else {
                    sessionMaterial.SessionId = 0;
                }

                session.SessionMaterials.push(sessionMaterial);
            }
        }

        for (let item of stateOfMaterial) {

            if (session.SessionMaterials.find(obj => obj.MaterialId == item) === undefined) {
                let sessionMaterial = {};

                sessionMaterial.SessionId = -1;
                sessionMaterial.MaterialId = item;

                session.SessionMaterials.push(sessionMaterial);
            }
        }

        $.ajax({
            type: "POST",
            url: "/Sessions/Upsert",
            data: JSON.stringify(session),
            contentType: "application/json; charset=utf-8",
            traditional: true,
            dataType: "json",
            success: function (data) {
                window.location.href = data.href;
            }
        });
    }
}

function CheckMaterialFormValid() {
    let valid = true;

    let materialName = $("#MaterialId option:selected");
    let numberOfPieces = parseInt(document.getElementById("NumberOfPieces").value);
    //let pricePerPiece = parseFloat(document.getElementById("PricePerPiece").value);
    //let totalPrice = parseFloat(document.getElementById("TotalPrice").value);
    let errorNumberOfPieces = document.getElementById("ErrorNumberOfPieces");
    //let errorPricePerPiece = document.getElementById("ErrorPricePerPiece");
    //let errorTotalPrice = document.getElementById("ErrorTotalPrice");

    if (materialName.length != 1) {
        valid = false;
    }

    //if (!(pricePerPiece >= 0)) {
    //    errorPricePerPiece.textContent = "The Price Per Piece is required.";
    //    valid = false;
    //} else {
    //    errorPricePerPiece.textContent = "";
    //}

    if (!(numberOfPieces > 0)) {
        errorNumberOfPieces.textContent = " Enter Avalid Number Of Pieces.";
        valid = false;
    } else {
        errorNumberOfPieces.textContent = "";
    }

    //if (!(totalPrice >= 0)) {
    //    errorTotalPrice.textContent = "The Total Price is required.";
    //    valid = false;
    //} else {
    //    errorTotalPrice.textContent = "";
    //}
    return valid;
}

function CreateMaterial() {
    if (CheckMaterialFormValid() == true) {
        let materialName = $("#MaterialId option:selected");
        let numberOfPieces = document.getElementById("NumberOfPieces");
        //let pricePerPiece = document.getElementById("PricePerPiece");
        //let totalPrice = document.getElementById("TotalPrice");

        let table = document.getElementById("sessionMaterial");

        let row = table.insertRow(-1);

        let c0 = row.insertCell(0);
        let c1 = row.insertCell(1);
        let c2 = row.insertCell(2);
        let c3 = row.insertCell(3);
        // let c4 = row.insertCell(4);
        //let c5 = row.insertCell(5);

        let dev = document.createElement("div");
        let deleteBtn = document.createElement("button");
        let deleteIcon = document.createElement("i");

        dev.classList.add("text-center");
        deleteBtn.classList.add("btn", "btn-danger", "text-white", "btn-circle", "mx-1");
        deleteIcon.classList.add("fa-solid", "fa-x");
        deleteBtn.setAttribute("onclick", "RemoveRow(this)");
        deleteBtn.appendChild(deleteIcon);
        dev.appendChild(deleteBtn);

        c0.innerText = materialName.text();
        c1.innerText = numberOfPieces.value;
        //c2.innerText = pricePerPiece.value;
        //c3.innerText = totalPrice.value;
        c2.appendChild(dev);
        c3.innerText = materialName.val();

        c3.setAttribute("hidden", "");

        document.getElementById("ErrorNumberOfPieces").textContent = "";
        // document.getElementById("ErrorPricePerPiece").textContent = "";
        // document.getElementById("ErrorTotalPrice").textContent = "";

        numberOfPieces.value = "";
        // pricePerPiece.value = "";
        // totalPrice.value = "";

        materialName.remove()

        $('#materialForm').modal('hide');
    }
}

function ChangeTotalPrice() {
    let numberOfPieces = parseInt(document.getElementById("NumberOfPieces").value);
    let totalPrice = parseFloat(document.getElementById("TotalPrice").value);
    let pricePerPiece = document.getElementById("PricePerPiece");

    if (numberOfPieces > 0 && totalPrice >= 0) {
        document.getElementById("ErrorPricePerPiece").textContent = "";
        document.getElementById("ErrorTotalPrice").textContent = "";
        pricePerPiece.value = totalPrice / numberOfPieces;
    }
}

function ChangePricePerPiece() {
    let numberOfPieces = parseInt(document.getElementById("NumberOfPieces").value);
    let pricePerPiece = parseFloat(document.getElementById("PricePerPiece").value);
    let totalPrice = document.getElementById("TotalPrice");

    if (numberOfPieces > 0 && pricePerPiece >= 0) {
        document.getElementById("ErrorPricePerPiece").textContent = "";
        document.getElementById("ErrorTotalPrice").textContent = "";
        totalPrice.value = pricePerPiece * numberOfPieces;
    }
}

function ChangeNumberOfPieces() {
    let numberOfPieces = parseInt(document.getElementById("NumberOfPieces").value);
    //let pricePerPiece = parseFloat(document.getElementById("PricePerPiece").value);
    //let totalPrice = parseFloat(document.getElementById("TotalPrice").value);
    let errorNumberOfPieces = document.getElementById("ErrorNumberOfPieces");

    if (!(numberOfPieces > 0)) {
        errorNumberOfPieces.textContent = " Enter Avalid Number Of Pieces.";
    } else {
        //if (pricePerPiece >= 0) {
        //    ChangePricePerPiece();
        //} else if (totalPrice >= 0) {
        //    ChangeTotalPrice();
        //}
        errorNumberOfPieces.textContent = "";
    }
}

function RemoveRow(button) {
    Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.value) {
            let row = $(button).closest("TR");
            let table = $('#sessionMaterial')[0];
            let select = document.getElementById("MaterialId");

            let option = document.createElement("option");

            option.innerText = row[0].children[0].innerText;
            option.setAttribute("value", row[0].children[3].innerText);

            select.appendChild(option);

            table.deleteRow(row[0].rowIndex);
        }
    });
};

function ShowSessionMaterialForm() {
    if ($("#MaterialId option").length != 0) {
        $('#materialForm').modal('show');
    } else {
        toastr.error("There is no material left");
    }
}