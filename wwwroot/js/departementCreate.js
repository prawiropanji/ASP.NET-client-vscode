console.log("Departement Create...")
$.ajax({
    url: "https://localhost:7002/api/division",
    type: "GET"
}).done(res => {
    console.log(res.data.length);

    let temp = '';


    res.data.forEach(data => {
        temp += `<option value="${data.id}">${data.name}</option>`;
    })

    $('.form-select').html(temp)

}).fail(err => {
    console.log(err)
})




document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()

    const formElement = event.target

    console.log(formElement.checkValidity())

    if (!formElement.checkValidity()) {

        event.stopPropagation()
        formElement.classList.add('was-validated')
        return
    } 


    const formData = new FormData(formElement);

    const enteredDepartementName = formData.get('departementName');
    const enteredDivisionId = formData.get('divisionId');

    const data = {
        id: 0,
        name: enteredDepartementName,
        divisionId: enteredDivisionId
    }

    const createSwalAlert = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

     createSwalAlert.fire({
        title: 'Are you sure?',
        text: "Data will be saved in database",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, create it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {

        if (result.isConfirmed) {



            console.log(data);

            $.ajax({
                url: 'https://localhost:7002/api/departement',
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(data)
            }).done(res => {
                console.log(res);
                formElement.reset();
                //document.querySelector('#closeModal').reset();


            })


            createSwalAlert.fire(
                'Createed!',
                'row has been added.',
                'success'
            )
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            createSwalAlert.fire(
                'Cancelled',
                'make sure you entered right data :)',
                'error'
            )
        }
    })



})

