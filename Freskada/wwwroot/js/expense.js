var dataTable;

$(document).ready(function () {
    loadDataTable();

    document.getElementById('expenseForm').addEventListener('hidden.bs.modal', event => {
        let money = document.getElementById('AmountOfMoney');
        let description = document.getElementById('Description');
        let errorMoneySpan = document.getElementById('AmountOfMoney-error');
        let errorDescriptionSpan = document.getElementById('Description-error');

        if (errorMoneySpan != null) {
            let moneySpan = errorMoneySpan.parentNode;

            money.classList.remove("input-validation-error");
            money.classList.add("valid");
            money.setAttribute("aria-invalid", "false");

            moneySpan.removeChild(errorMoneySpan);
            moneySpan.classList.remove('field-validation-error');
            moneySpan.classList.add('field-validation-valid');
        }


        if (errorDescriptionSpan != null) {
            let descriptionSpan = errorDescriptionSpan.parentNode;

            description.classList.remove("input-validation-error");
            description.classList.add("valid");
            description.setAttribute("aria-invalid", "false");

            descriptionSpan.removeChild(errorDescriptionSpan);
            descriptionSpan.classList.remove('field-validation-error');
            descriptionSpan.classList.add('field-validation-valid');
        }

        money.value = "0";
        description.value = "";
        document.getElementById('Id').value = "0";
        document.getElementById('UserId').value = "0";
        document.getElementById('Date').value = "";

        document.getElementById('formSubmint').innerText = "Create";
        document.getElementById('expenseFormLabel').innerText = "Add Expense";
    })
});

function loadDataTable() {
    dataTable = $('#t_expense').DataTable({
        "ajax": {
            "url": "/Expenses/GetAllExpenses/",
            "type": "GET",
            "datatype": "json"
        },
        "stateSave": true,
        "stateSaveCallback": function (settings, data) {
            localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data))
        },
        "stateLoadCallback": function (settings) {
            return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance))
        },
        "lengthChange": false,
        "autoWidth": true,
        "columns": [
            { "data": "expense.id" },
            { "data": "expense.employeeName" },
            { "data": "expense.amountOfMoney" },
            { "data": "expense.date" },
            {
                "data": "expense",
                "render": function (data) {
                    let obj = JSON.stringify(data);
                    obj = obj.replace("'", "\\'");
                    obj = obj.replaceAll("\\r\\n", "<br>");

                    let dev = document.createElement("div");
                    let infoBtn = document.createElement("button");
                    let editBtn = document.createElement("button");
                    let editIcon = document.createElement("i");
                    let infoIcon = document.createElement("i");
                    let deleteIcon = document.createElement("i");
                    let a = document.createElement("a");

                    dev.classList.add("text-center");

                    editBtn.classList.add("btn", "btn-success", "text-white", "btn-circle", "mx-1");
                    infoBtn.classList.add("btn", "btn-info", "text-white", "btn-circle", "mx-1");

                    a.style.cursor = "pointer";
                    a.classList.add("btn", "btn-danger", "text-white", "btn-circle", "mx-1");

                    editIcon.classList.add("fa", "fa-pencil-alt");
                    infoIcon.classList.add("fa", "fa-book");
                    deleteIcon.classList.add("fa-solid", "fa-x");

                    editBtn.setAttribute("data-bs-target", "#expenseForm");
                    editBtn.setAttribute("data-bs-toggle", "modal");
                    editBtn.setAttribute("onclick", `modelEditclicked('${obj}')`);

                    infoBtn.setAttribute("data-bs-target", "#expensesDetails");
                    infoBtn.setAttribute("data-bs-toggle", "modal");
                    infoBtn.setAttribute("onclick", `modelInfoclicked('${obj}')`);

                    a.setAttribute("onclick", `Delete('/Expenses/DeleteExpense?id=${data.id}')`);

                    editBtn.appendChild(editIcon);
                    infoBtn.appendChild(infoIcon);
                    a.appendChild(deleteIcon);
                    dev.appendChild(editBtn);
                    dev.appendChild(infoBtn);
                    dev.appendChild(a);

                    return dev.outerHTML;
                }
            }
        ],
        "language": {
            "emptyTable": "no data found"
        },
        "width": "100%"
    });
}

function Delete(url) {
    Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: "DELETE",
                url: url,
                success: function (data) {
                    if (data.success) {
                        toastr.success(data.message);
                        dataTable.ajax.reload();
                    }
                    else {
                        toastr.error(data.message);
                    }
                }
            });
        }
    });
}

function modelInfoclicked(obj) {
    let data = JSON.parse(obj);
    let table = document.getElementById("expenseDetails");
    let arrOfTr = table.firstElementChild.children;

    arrOfTr[0].lastElementChild.innerHTML = data.id;
    arrOfTr[1].lastElementChild.innerHTML = data.employeeName;
    arrOfTr[2].lastElementChild.innerHTML = data.amountOfMoney;
    arrOfTr[3].lastElementChild.innerHTML = data.date;
}

function modelEditclicked(obj) {
    let data = JSON.parse(obj);

    document.getElementById('Id').value = data.id;
    document.getElementById('UserId').value = data.userId;
    document.getElementById('AmountOfMoney').value = data.amountOfMoney;
    document.getElementById('Date').value = convertDateFormat(data.date);
    document.getElementById('Description').value = `${data.description.replaceAll('<br>', '\r\n')}`;

    document.getElementById('formSubmint').innerText = "Update";
    document.getElementById('expenseFormLabel').innerText = "Update Expense";
}