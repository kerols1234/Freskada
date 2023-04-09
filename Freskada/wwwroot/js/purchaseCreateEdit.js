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
        for (let row of document.getElementById("purchaseMaterial").rows) {
            if (row.rowIndex != 0) {
                stateOfMaterial.push(row.cells[5].innerText);
            }
        }
    }
});

function CheckPurchaseMaterialFormValid() {
    let valid = true;

    let date = document.getElementById("Date").value;
    let errorDate = document.getElementById("ErrorDate");

    let table = document.getElementById("purchaseMaterial");
    let errorPurchaseMaterial = document.getElementById("ErrorPurchaseMaterial");

    if (date == null || date.trim() == "") {
        errorDate.textContent = "The Date is required.";
        valid = false;
    } else {
        errorDate.textContent = "";
    }

    if (table.rows.length <= 1) {
        errorPurchaseMaterial.textContent = "Must add at least one material.";
        valid = false;
    } else {
        errorPurchaseMaterial.textContent = "";
    }

    return valid;
}

function saveChanges() {
    if (CheckPurchaseMaterialFormValid()) {
        let table = document.getElementById("purchaseMaterial");
        let purchase = {};
        purchase.Id = document.getElementById("Id").value;
        purchase.UserId = document.getElementById("UserId").value;
        purchase.Date = document.getElementById("Date").value;
        purchase.Note = document.getElementById("Note").value;
        purchase.PurchaseMaterials = [];

        for (let row of table.rows) {
            if (row.rowIndex != 0) {
                let cells = row.cells;
                let purchaseMaterial = {};

                purchaseMaterial.MaterialId = cells[5].innerText;
                purchaseMaterial.NumberOfPieces = cells[1].innerText;
                purchaseMaterial.Price = cells[2].innerText;

                if (stateOfMaterial.indexOf(purchaseMaterial.MaterialId) != -1) {
                    purchaseMaterial.PurchaseId = document.getElementById("Id").value;
                } else {
                    purchaseMaterial.PurchaseId = 0;
                }

                purchase.PurchaseMaterials.push(purchaseMaterial);
            }
        }

        for (let item of stateOfMaterial) {

            if (purchase.PurchaseMaterials.find(obj => obj.MaterialId == item) === undefined) {
                let purchaseMaterial = {};

                purchaseMaterial.PurchaseId = -1;
                purchaseMaterial.MaterialId = item;

                purchase.PurchaseMaterials.push(purchaseMaterial);
            }
        }

        $.ajax({
            type: "POST",
            url: "/Purchases/Upsert",
            data: JSON.stringify(purchase),
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
    let pricePerPiece = parseFloat(document.getElementById("PricePerPiece").value);
    let totalPrice = parseFloat(document.getElementById("TotalPrice").value);
    let errorNumberOfPieces = document.getElementById("ErrorNumberOfPieces");
    let errorPricePerPiece = document.getElementById("ErrorPricePerPiece");
    let errorTotalPrice = document.getElementById("ErrorTotalPrice");

    if (materialName.length != 1) {
        valid = false;
    }

    if (!(pricePerPiece >= 0)) {
        errorPricePerPiece.textContent = "The Price Per Piece is required.";
        valid = false;
    } else {
        errorPricePerPiece.textContent = "";
    }

    if (!(numberOfPieces > 0)) {
        errorNumberOfPieces.textContent = " Enter Avalid Number Of Pieces.";
        valid = false;
    } else {
        errorNumberOfPieces.textContent = "";
    }

    if (!(totalPrice >= 0)) {
        errorTotalPrice.textContent = "The Total Price is required.";
        valid = false;
    } else {
        errorTotalPrice.textContent = "";
    }
    return valid;
}

function CreateMaterial() {
    if (CheckMaterialFormValid() == true) {
        let materialName = $("#MaterialId option:selected");
        let numberOfPieces = document.getElementById("NumberOfPieces");
        let pricePerPiece = document.getElementById("PricePerPiece");
        let totalPrice = document.getElementById("TotalPrice");

        let table = document.getElementById("purchaseMaterial");

        let row = table.insertRow(-1);

        let c0 = row.insertCell(0);
        let c1 = row.insertCell(1);
        let c2 = row.insertCell(2);
        let c3 = row.insertCell(3);
        let c4 = row.insertCell(4);
        let c5 = row.insertCell(5);

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
        c2.innerText = pricePerPiece.value;
        c3.innerText = totalPrice.value;
        c4.appendChild(dev);
        c5.innerText = materialName.val();

        c5.setAttribute("hidden", "");

        document.getElementById("ErrorNumberOfPieces").textContent = "";
        document.getElementById("ErrorPricePerPiece").textContent = "";
        document.getElementById("ErrorTotalPrice").textContent = "";

        numberOfPieces.value = "";
        pricePerPiece.value = "";
        totalPrice.value = "";

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
    let pricePerPiece = parseFloat(document.getElementById("PricePerPiece").value);
    let totalPrice = parseFloat(document.getElementById("TotalPrice").value);
    let errorNumberOfPieces = document.getElementById("ErrorNumberOfPieces");

    if (!(numberOfPieces > 0)) {
        errorNumberOfPieces.textContent = " Enter Avalid Number Of Pieces.";
    } else {
        if (pricePerPiece >= 0) {
            ChangePricePerPiece();
        } else if (totalPrice >= 0) {
            ChangeTotalPrice();
        }
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
            let table = $('#purchaseMaterial')[0];
            let select = document.getElementById("MaterialId");

            let option = document.createElement("option");

            option.innerText = row[0].children[0].innerText;
            option.setAttribute("value", row[0].children[5].innerText);

            select.appendChild(option);

            table.deleteRow(row[0].rowIndex);
        }
    });
};

function ShowPurchaseMaterialForm() {
    if ($("#MaterialId option").length != 0) {
        $('#materialForm').modal('show');
    } else {
        toastr.error("There is no material left");
    }
}