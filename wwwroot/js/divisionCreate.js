console.log("Division Create...")





document.querySelector('form').addEventListener('submit', (event) => {


    event.preventDefault()


    console.log(event.target.checkValidity())

    const formElement = event.target

    if (!formElement.checkValidity()) {
        
        event.stopPropagation()
        formElement.classList.add('was-validated')
        return
    } 

       
    




    const formData = new FormData(formElement);

    const enteredDivisionName = formData.get('divisionName');

    const data = {
        id: 0,
        name: enteredDivisionName,
    }

    console.log(data);

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
                url: 'https://localhost:7002/api/division',
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(data)
            }).done(res => {
                console.log(res);
                formElement.reset();


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



