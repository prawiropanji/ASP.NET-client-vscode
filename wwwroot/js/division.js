console.log("dari divion js...")


let table = null;


$(document).ready(function () {
    table = $('#divisionTable').DataTable({
        ajax: {
            url: 'https://localhost:7002/api/division',
            dataSrc: 'data'

        },
        columns: [
            {
                data: "name",
                render: (data, type, row, meta) => {
                    return data;
                }
            },
            {
                data: "id",
                render: (data) => {
                    return `
                    <a class="btn btn-primary text-light" data-bs-toggle="modal" data-bs-target="#divisionEditModal" onclick="showEdit(${data})">Edit</a> |
                    <a class="btn btn-info text-light" data-bs-toggle="modal" data-bs-target="#divisionDetailsModal" onclick="showDetail(${data})">Details</a> |
                    <a class="btn btn-danger text-light"  onclick="showDelete(${data})">Delete</a>
         


        `;
                }
            }
        ],
        dom: 'Bfrtip',
        buttons: {
            buttons: [
                {
                    extend: 'copy',
                    className: 'btn-secondary',
                    exportOptions: {
                        columns: [0]
                    }
                },
                {
                    extend: 'colvis',
                    className: 'btn-secondary',
                    exportOptions: {
                        columns: [0]
                    }
                },
                {
                    extend: 'pdf',
                    className: 'btn-secondary',
                    exportOptions: {
                        columns: [0]
                    }
                },
                {
                    extend: 'excel',
                    className: 'btn-secondary',
                    exportOptions: {
                        columns: [0]
                    }
                }
            ],
            dom: {
                button: {
                    className: 'btn'
                }
            }
        }

    })

 

   table.buttons().container().addClass("mb-3 me-3")


})


function showDetail(divisionId) {


    $.ajax({
        url: `https://localhost:7002/api/division/${divisionId}`,
        type: "GET"
    }).done(res => {
        console.log(res)

        let temp = '';


        $('#modalDetail').html(`
    
    <div class=" row my-2">
      <div class="col-4 text-end text-dark fw-semibold">
          ID :
      </div>
      <div class="col-8">
           <input class="form-control form-control-sm" type="text" value="${res.data.id}" aria-label="readonly input example" readonly>
      </div>
    </div>
    
    <div class="row my-2">
      <div class="col-4 text-end text-dark fw-semibold">
          Division Name :
      </div>
      <div class="col-8 text-capitalize">
          <input class="form-control form-control-sm" type="text" value="${res.data.name}" aria-label="readonly input example" readonly>
      </div>
    </div>
    
    
                `)
    }).fail(err => {
        console.log(err)
    })
}



function showEdit(divisionId) {


    $.ajax({
        url: `https://localhost:7002/api/division/${divisionId}`,
        type: "GET"
    }).done(res => {
        document.querySelector('#divisionNameInput').value = res.data.name


        const submitButtonEl = document.querySelector('#modalEdit').parentElement.querySelector('button[type="submit"]');

        submitButtonEl.id = divisionId;

        submitButtonEl.addEventListener('click', sendEdit);


    })
}


function sendEdit() {
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
    }).then((result) => {
        if (result.isConfirmed) {

            const enteredDivisionName = document.querySelector('#divisionNameInput').value;
            const divisionId = document.querySelector('#modalEdit').parentElement.querySelector('button[type="submit"]').id;

            const data = {
                id: divisionId,
                name: enteredDivisionName

            }

            console.log(data);

            $('#divisionEditModal').modal('hide');

            //update row table value
            let rowData = table.row((num, rowVal) => rowVal.id == divisionId).data()


            rowData.name = enteredDivisionName;
            table.row((num, rowVal) => rowVal.id == divisionId).data(rowData).draw()


            //console.log(table.row((num, rowVal) => rowVal.id == departementId))
            //console.log(rowData)


            $.ajax({
                url: 'https://localhost:7002/api/division',
                type: 'PUT',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(data)
            }).done(res => {
                console.log(res);



            })
        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
    })




}


function showDelete(divisionId) {

    const deleteSwalAlert = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    deleteSwalAlert.fire({
        title: 'Are you sure?',
        text: "this action may result in data loss",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {

        if (result.isConfirmed) {
            deleteData(divisionId);

            deleteSwalAlert.fire(
                'Deleted!',
                'row has been deleted.',
                'success'
            )
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            deleteSwalAlert.fire(
                'Cancelled',
                'Your row is safe :)',
                'error'
            )
        }
    })


    //const deleteButtonEl = document.querySelector('#divisionDeleteModal .modal-footer button:last-of-type')
    //deleteButtonEl.id = divisionId
    //deleteButtonEl.addEventListener('click', deleteData)


}

function deleteData(divisionId) {

    //const divisionId = document.querySelector('#divisionDeleteModal .modal-footer button:last-of-type').id

    table.row((num, rowVal) => rowVal.id == divisionId).remove().draw()

    $.ajax({
        url: `https://localhost:7002/api/division/?id=${divisionId}`,
        type: "DELETE"
    }).done(res => {
        console.log(res)

    })
}