var dataTable;

$(document).ready(function () {
    loadDataTable();

    document.getElementById('patientForm').addEventListener('hidden.bs.modal', event => {
        let name = document.getElementById('Name');
        let errorNameSpan = document.getElementById('Name-error');

        if (errorNameSpan != null) {
            let nameSpan = errorNameSpan.parentNode;

            name.classList.remove("input-validation-error");
            name.classList.add("valid");
            name.setAttribute("aria-invalid", "false");

            nameSpan.removeChild(errorNameSpan);
            nameSpan.classList.remove('field-validation-error');
            nameSpan.classList.add('field-validation-valid');
        }

        name.value = "";  
        document.getElementById('Id').value = "0";
        document.getElementById('Address').value = "";
        document.getElementById('PhoneNumber').value = "";
        document.getElementById('BirthDate').value = "";
        document.getElementById('HealthStatus').value = "";
        
        document.getElementById('formSubmint').innerText = "Create";
        document.getElementById('patientFormLabel').innerText = "Add Patient";
    })
});

function loadDataTable() {
    dataTable = $('#t_patient').DataTable({
        "ajax": {
            "url": "/Patients/GetAllPatients/",
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
            { "data": "patient.name" },
            { "data": "patient.birthDate" },
            { "data": "patient.phoneNumber" },
            { "data": "patient.address" },
            { "data": "patient.sessions" },
            { "data": "patient.bookings" },
            {
                "data": "patient",
                "render": function (data) {
                    data.healthStatus = data.healthStatus ?? "";
                    data.birthDate = data.birthDate ?? "";
                    data.phoneNumber = data.phoneNumber ?? "";
                    data.address = data.address ?? "";
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

                    editBtn.setAttribute("data-bs-target", "#patientForm");
                    editBtn.setAttribute("data-bs-toggle", "modal");
                    editBtn.setAttribute("onclick", `modelEditclicked('${obj}')`);

                    infoBtn.setAttribute("data-bs-target", "#patientsDetails");
                    infoBtn.setAttribute("data-bs-toggle", "modal");
                    infoBtn.setAttribute("onclick", `modelInfoclicked('${obj}')`);

                    a.setAttribute("onclick", `Delete('/Patients/DeletePatient?id=${data.id}')`);

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
    let table = document.getElementById("patientDetails");
    let arrOfTr = table.firstElementChild.children;

    arrOfTr[0].lastElementChild.innerHTML = data.name;
    arrOfTr[1].lastElementChild.innerHTML = data.birthDate;
    arrOfTr[2].lastElementChild.innerHTML = data.phoneNumber;
    arrOfTr[3].lastElementChild.innerHTML = data.address;
    arrOfTr[4].lastElementChild.innerHTML = data.sessions;
    arrOfTr[5].lastElementChild.innerHTML = data.bookings;
    arrOfTr[6].lastElementChild.innerHTML = data.healthStatus;
}

function modelEditclicked(obj) {
    let data = JSON.parse(obj);

    document.getElementById('Id').value = data.id;
    document.getElementById('Address').value = data.address;
    document.getElementById('PhoneNumber').value = data.phoneNumber;
    document.getElementById('BirthDate').value = data.birthDate;
    document.getElementById('Name').value = data.name;
    document.getElementById('HealthStatus').value = `${data.healthStatus.replaceAll('<br>', '\r\n')}`;

    document.getElementById('formSubmint').innerText = "Update";
    document.getElementById('patientFormLabel').innerText = "Update Patient";
}