var dataTable;

$(document).ready(function () {
    loadDataTable();

    document.getElementById('materialForm').addEventListener('hidden.bs.modal', event => {
        let name = document.getElementById('Name');
        let price = document.getElementById('Price');
        let errorNameSpan = document.getElementById('Name-error');
        let errorPriceSpan = document.getElementById('Price-error');

        if (errorNameSpan != null) {
            let nameSpan = errorNameSpan.parentNode;

            name.classList.remove("input-validation-error");
            name.classList.add("valid");
            name.setAttribute("aria-invalid", "false");

            nameSpan.removeChild(errorNameSpan);
            nameSpan.classList.remove('field-validation-error');
            nameSpan.classList.add('field-validation-valid');
        }

        if (errorPriceSpan != null) {
            let priceSpan = errorPriceSpan.parentNode;

            price.classList.remove("input-validation-error");
            price.classList.add("valid");
            price.setAttribute("aria-invalid", "false");

            priceSpan.removeChild(errorPriceSpan);
            priceSpan.classList.remove('field-validation-error');
            priceSpan.classList.add('field-validation-valid');
        }

        name.value = "";
        price.value = "0";
        document.getElementById('Id').value = "0";
        document.getElementById('Description').value = "";

        document.getElementById('formSubmint').innerText = "Create";
        document.getElementById('materialFormLabel').innerText = "Add Material";
    })
});

function loadDataTable() {
    dataTable = $('#t_material').DataTable({
        "ajax": {
            "url": "/Materials/GetAllMaterials/",
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
            { "data": "material.name" },
            { "data": "material.price" },
            { "data": "material.quantity" },
            { "data": "material.sessionMaterials" },
            { "data": "material.purchaseMaterials" },
            {
                "data": "material",
                "render": function (data) {
                    data.description = data.description ?? "";
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

                    editBtn.setAttribute("data-bs-target", "#materialForm");
                    editBtn.setAttribute("data-bs-toggle", "modal");
                    editBtn.setAttribute("onclick", `modelEditclicked('${obj}')`);

                    infoBtn.setAttribute("data-bs-target", "#materialsDetails");
                    infoBtn.setAttribute("data-bs-toggle", "modal");
                    //infoBtn.setAttribute("onclick", `modelInfoclicked('${obj}')`);

                    a.setAttribute("onclick", `Delete('/Materials/DeleteMaterial?id=${data.id}')`);

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

function modelEditclicked(obj) {
    let data = JSON.parse(obj);

    document.getElementById('Id').value = data.id;
    document.getElementById('Price').value = data.price;
    document.getElementById('Name').value = data.name;
    document.getElementById('Description').value = `${data.description.replaceAll('<br>', '\r\n')}`;

    document.getElementById('formSubmint').innerText = "Update";
    document.getElementById('materialFormLabel').innerText = "Update Material";
}