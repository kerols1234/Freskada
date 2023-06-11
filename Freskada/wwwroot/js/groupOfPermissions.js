var dataTable;

$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {
    dataTable = $('#t_group_permissions').DataTable({
        "ajax": {
            "url": "/Account/GetAllGroups/",
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
            { "data": "groups.name" },
            { "data": "groups.users" },
            {
                "data": "groups",
                "render": function (data) {
                    if (data.name !== "Admin") {
                        let dev = document.createElement("div");
                        let editBtn = document.createElement("a");
                        let editIcon = document.createElement("i");
                        let deleteIcon = document.createElement("i");
                        let a = document.createElement("a");

                        dev.classList.add("text-center");

                        editBtn.classList.add("btn", "btn-success", "text-white", "btn-circle", "mx-1");

                        a.style.cursor = "pointer";
                        a.classList.add("btn", "btn-danger", "text-white", "btn-circle", "mx-1");

                        editIcon.classList.add("fa", "fa-pencil-alt");
                        deleteIcon.classList.add("fa-solid", "fa-x");

                        editBtn.setAttribute("href", `/Account/UpsertGroupOfPermissions?roleId=${data.id}`);

                        a.setAttribute("onclick", `Delete('/Account/DeleteGroup?id=${data.id}')`);

                        editBtn.appendChild(editIcon);
                        a.appendChild(deleteIcon);
                        dev.appendChild(editBtn);
                        dev.appendChild(a);

                        return dev.outerHTML;
                    }
                    return ``;
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