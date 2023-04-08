var dataTable;

$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {
    dataTable = $('#t_purchase').DataTable({
        "ajax": {
            "url": "/Purchases/GetAllPurchases/",
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
            { "data": "purchase.employeeName" },
            { "data": "purchase.date" },
            { "data": "purchase.price" },
            { "data": "purchase.purchaseMaterials" },
            {
                "data": "purchase",
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

                    editBtn.setAttribute("data-bs-target", "#purchaseForm");
                    editBtn.setAttribute("data-bs-toggle", "modal");
                    editBtn.setAttribute("onclick", `modelEditclicked('${obj}')`);

                    infoBtn.setAttribute("data-bs-target", "#purchasesDetails");
                    infoBtn.setAttribute("data-bs-toggle", "modal");
                    infoBtn.setAttribute("onclick", `modelInfoclicked('${obj}')`);

                    a.setAttribute("onclick", `Delete('/Purchases/DeletePurchase?id=${data.id}')`);

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

