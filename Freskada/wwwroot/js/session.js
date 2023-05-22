var dataTable;

$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {
    dataTable = $('#t_session').DataTable({
        "ajax": {
            "url": "/Sessions/GetAllSessions/",
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
            { "data": "session.doctorName" },
            { "data": "session.patientName" },
            { "data": "session.date" },
            { "data": "session.price" },
            { "data": "session.sessionMaterials" },
            { "data": "session.isBooked" },
            {
                "data": "session",
                "render": function (data) {
                    let obj = JSON.stringify(data);
                    obj = obj.replace("'", "\\'");
                    obj = obj.replaceAll("\\r\\n", "<br>");

                    let dev = document.createElement("div");
                    let infoLink = document.createElement("a");
                    let infoIcon = document.createElement("i");
                    let deleteIcon = document.createElement("i");
                    let deleteLink = document.createElement("a");

                    dev.classList.add("text-center");

                    infoLink.classList.add("btn", "btn-info", "text-white", "btn-circle", "mx-1");
                    infoLink.style.cursor = "pointer";

                    deleteLink.style.cursor = "pointer";
                    deleteLink.classList.add("btn", "btn-danger", "text-white", "btn-circle", "mx-1");

                    infoIcon.classList.add("fa", "fa-book");
                    deleteIcon.classList.add("fa-solid", "fa-x");

                    infoLink.setAttribute("href", `https://localhost:44385/Sessions/Upsert?id=${data.id}`);

                    deleteLink.setAttribute("onclick", `Delete('/Sessions/DeleteSession?id=${data.id}')`);

                    infoLink.appendChild(infoIcon);
                    deleteLink.appendChild(deleteIcon);
                    dev.appendChild(infoLink);
                    dev.appendChild(deleteLink);

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

