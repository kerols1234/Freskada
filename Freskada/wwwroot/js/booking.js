var dataTable;

$(document).ready(function () {
    loadDataTable();

    document.getElementById('bookingForm').addEventListener('hidden.bs.modal', event => {
        document.getElementById('Id').value = "0";
        document.getElementById('Date').value = "";
        document.getElementById('Note').value = "";
        document.getElementById('UserId').value = "0";

        document.getElementById('formSubmint').innerText = "Create";
        document.getElementById('bookingFormLabel').innerText = "Add Booking";
    })
});

function loadDataTable() {
    dataTable = $('#t_booking').DataTable({
        "ajax": {
            "url": "/Bookings/GetAllBookings/",
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
            { "data": "booking.id" },
            { "data": "booking.doctorName" },
            { "data": "booking.patientName" },
            { "data": "booking.date" },
            {
                "data": "booking",
                "render": function (data) {
                    data.note = data.note ?? "";
                    data.date = data.date ?? "";
                    data.doctorName = data.doctorName ?? "";
                    data.patientName = data.patientName ?? "";
                    data.patientId = data.patientId ?? "";
                    data.doctorId = data.doctorId ?? "";

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

                    editBtn.setAttribute("data-bs-target", "#bookingForm");
                    editBtn.setAttribute("data-bs-toggle", "modal");
                    editBtn.setAttribute("onclick", `modelEditclicked('${obj}')`);

                    infoBtn.setAttribute("data-bs-target", "#bookingsDetails");
                    infoBtn.setAttribute("data-bs-toggle", "modal");
                    infoBtn.setAttribute("onclick", `modelInfoclicked('${obj}')`);

                    a.setAttribute("onclick", `Delete('/Bookings/DeleteBooking?id=${data.id}')`);

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
    let table = document.getElementById("bookingDetails");
    let arrOfTr = table.firstElementChild.children;

    arrOfTr[0].lastElementChild.innerHTML = data.id;
    arrOfTr[1].lastElementChild.innerHTML = data.doctorName;
    arrOfTr[2].lastElementChild.innerHTML = data.patientName;
    arrOfTr[3].lastElementChild.innerHTML = data.date;
    arrOfTr[4].lastElementChild.innerHTML = data.note;
}

function modelEditclicked(obj) {
    let data = JSON.parse(obj);

    document.getElementById('Id').value = data.id;
    document.getElementById('UserId').value = data.userId;
    document.getElementById('DoctorId').value = data.doctorId;
    document.getElementById('PatientId').value = data.patientId;
    document.getElementById('Date').value = convertDateFormat(data.date);
    document.getElementById('Note').value = `${data.note.replaceAll('<br>', '\r\n')}`;

    document.getElementById('formSubmint').innerText = "Update";
    document.getElementById('bookingFormLabel').innerText = "Update Booking";
}