let table = null;

$(document).ready(function () {
    table = $('#departementTable').DataTable({
        ajax: {
            url: 'https://localhost:7002/api/departement',
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
                data: 'divisionId',
                render: (data) => {
                    return data;
                }
            },
            {
                data: "id",
                render: (data) => {
                    return `
                    <a class="btn btn-primary text-light" data-bs-toggle="modal" data-bs-target="#departementEditModal" onclick="showEdit(${data})" >Edit</a> |
                    <a class="btn btn-info text-light" data-bs-toggle="modal" data-bs-target="#departementDetailsModal" onclick="showDetail(${data})">Details</a> |
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
                    className: 'btn btn-secondary',
                    exportOptions: {
                        columns: [0, 1]
                    }
                },
                { extend: 'colvis', className: 'btn btn-secondary' },
                {
                    extend: 'pdf',
                    className: 'btn btn-secondary',
                    exportOptions: {
                        columns: [0,1]
                    }
                },
                {
                    extend: 'excel',
                    className: 'btn btn-secondary',
                    exportOptions: {
                        columns: [0, 1]
                    }
                }
            ],
            dom: {
                button: {
                    className: 'btn'
                }
            }
        }

    }

    )

    table.buttons().container().addClass("mb-3 me-3")

})


function showDetail(departementId) {
    $.ajax({
        url: `https://localhost:7002/api/departement/${departementId}`,
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
          Nama :
      </div>
      <div class="col-8 text-capitalize">
          <input class="form-control form-control-sm" type="text" value="${res.data.name}" aria-label="readonly input example" readonly>
      </div>
    </div>
    
    <div class="row my-2">
      <div class="col-4 text-end text-dark fw-semibold">
          Division ID :
      </div>
      <div class="col">
           <input class="form-control form-control-sm" type="text" value="${res.data.divisionId}" aria-label="readonly input example" readonly>
      </div>
    </div>
    
                `)
    }).fail(err => {
        console.log(err)
    })
}

function showEdit(departementId) {
    //populated division options
    $.ajax({
        url: "https://localhost:7002/api/division",
        type: "GET"
    }).done(res => {
        console.log(res.data.length);

        let temp = '';


        res.data.forEach(data => {
            temp += `<option id="option-${data.id}" value="${data.id}">${data.name}</option>`;
        })

        $('#divisionSelect').html(temp)

    }).fail(err => {
        console.log(err)
    })

    //get detail departement name and selectd appropriate option
    $.ajax({
        url: `https://localhost:7002/api/departement/${departementId}`,
        type: "GET"
    }).done(res => {
        document.querySelector('#departNameInput').value = res.data.name



        let selectedOption = document.querySelector(`#option-${res.data.divisionId}`)


        selectedOption.selected = true;


        const submitButtonEl = document.querySelector('#modalEdit').parentElement.querySelector('button[type="submit"]');

        submitButtonEl.id = departementId;

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
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {


            const enteredDepartName = document.querySelector('#departNameInput').value;
            const enteredDivisionId = document.querySelector('#divisionSelect').value
            const departementId = document.querySelector('#modalEdit').parentElement.querySelector('button[type="submit"]').id;

            const data = {
                id: departementId,
                name: enteredDepartName,
                divisionId: enteredDivisionId
            }

            console.log(data);


            $('#departementEditModal').modal('hide');


            //update row table value UI 
            let rowData = table.row((num, rowVal) => rowVal.id == departementId).data()
            rowData.name = enteredDepartName;
            rowData.divisionId = enteredDivisionId
            table.row((num, rowVal) => rowVal.id == departementId).data(rowData).draw()


            console.log(table.row((num, rowVal) => rowVal.id == departementId))
            console.log(rowData)

            //send updated data to api
            $.ajax({
                url: 'https://localhost:7002/api/departement',
                type: 'PUT',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(data)
            }).done(res => {
                console.log(res);
            })

            Swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
    })



}





function showDelete(departementId) {


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
            deleteData(departementId);

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

}




function deleteData(departementId) {



    table.row((num, rowVal) => rowVal.id == departementId).remove().draw()

    $.ajax({
        url: `https://localhost:7002/api/departement/?id=${departementId}`,
        type: "DELETE"
    }).done(res => {
        console.log(res)

    })
}


