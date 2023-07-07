/// <reference path="D:\download\Code Gym\BaiTap\Module4\Module4_Hoang_Hai_C0223G1\HTML-bank-mangement\jquery\jquery-3.7.0.min.js" />

let customerId = 0;
let tableBodyDiv = $(".customer-table-body");

function renderCustomer(customer){
    var id = customer.id;
    return `
    <tr id="row_${id}">
        <th scope="row" class="customer-id">${id}</th>
        <td class="customer-name">${customer.name}</td>
        <td class="customer-email"> ${customer.email} </td>
        <td class="customer-address">${customer.address} </td>
        <td class="customer-phone">${customer.phone} </td>
        <td class="customer-balance">${customer.balance} </td>
        <td>
            <button data-id="${id}" class="info btn btn-outline-info fas fa-question"></button>

            <button data-id="${id}" class="edit btn btn-outline-dark fas fa-pencil-alt"></button>

            <button data-id="${id}" class="deposit btn btn-outline-success fas fa-plus"></button>

            <button data-id="${id}" class="withdraw btn btn-outline-secondary fas fa-minus"></button>

            <button data-id="${id}" class="transfer btn btn-outline-primary fas fa-exchange-alt"></button>

            <button data-id="${id}" class="remove btn btn-outline-danger fas fa-ban">
            </button>
        <td>
    </tr>
    `;
}

function addAllEvent(){
    addEventShowModalEdit();
    addEventShowModalInfo();
    addEventShowModalDeposit();
    addEventShowModalWithdraw();
    addEventShowModalTransfer();
    addEventRemove();
}

showCustomers();
function showCustomers(){
    
    tableBodyDiv.empty();

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/customers?deleted=0"
    })
    .done((data) => {
        data.forEach(item => {
            const dataStr = renderCustomer(item);
            tableBodyDiv.prepend(dataStr);

            addAllEvent();
        });
    })
    .fail((errors) => {
        console.log(errors);
    })
    ;

    let createDiv = $("#create-result");
    createDiv.innerHTML = "";

}

const btnCreate = $("#btn-create");
btnCreate.on('click', doCreate);

function doCreate(){
    var fullName = $("#name").val();
    var email = $("#email").val();
    var address = $("#address").val();
    var phone = $("#phone").val();
    var balance = 0;
    var deleted = 0;

    let requires = [];
    if(fullName == "") requires.push("Tên không được để trống");
    if(email == "") requires.push("Email không được để trống");
    if(address == "") requires.push("Địa chỉ không được để trống");
    if(phone == "") requires.push("Phone không được để trống");

    let createDiv = $("#create-result");
    createDiv.empty();

    if(requires.length > 0){
        var resultStr = ""
        for(var i = 0; i < requires.length; i++){
            resultStr += `
            <p class="alert alert-danger">${requires[i]}</p>
            `;
        }
        createDiv.html(resultStr)
    } else{
        var customer = {
            fullName,
            email,
            address,
            phone,
            balance,
            deleted
        };

        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'POST',
            url: 'http://localhost:3000/customers',
            data: JSON.stringify(customer)
        })
        .done((data) => {
            let dataStr = renderCustomer(data);
            tableBodyDiv.prepend(dataStr);

            addAllEvent();

            $("#name").val("");
            $("#email").val("");
            $("#address").val("");
            $("#phone").val("");

            Swal.fire(
                'Create Successfully!',
                'KH mới đã được tạo!',
                'success'
            )

        })
        .fail((errors) => {
            console.log(errors);
        })
    }
}

function addEventShowModalInfo(){
    // all query select
    let btnInfo = $(".info");

    btnInfo.off('click');
    btnInfo.on('click',function() {
        console.log("click-info");

        customerId = $(this).data('id');

        showInfo(customerId);
    })
}

function showInfo(id){
    console.log("show-info");
    findCustomerById(id)
    .then((data) => {
        $("#name-info").val(data.name);
        $("#email-info").val(data.email);
        $("#address-info").val(data.address);
        $("#phone-info").val(data.phone);
        $("#balance-info").val(data.balance);

        $('#infoCustomer').modal('show');
    })
    .catch((error) => {
        console.log(error);
    });
}

function findCustomerById(id) {
    return $.ajax({
        type: "GET",
        url: "http://localhost:3000/customers/"+id,
    });
}

function addEventShowModalEdit(){
    // all query select
    let btnShowEdit = $(".edit");

    btnShowEdit.off('click');
    btnShowEdit.on('click', function(){

        customerId = $(this).data('id');
        showEdit(customerId);
    })
}

function showEdit(id){
    findCustomerById(id)
    .then((data) => {

        $("#name-edit").val(data.fullName);
        $("#email-edit").val(data.email);
        $("#address-edit").val(data.address);
        $("#phone-edit").val(data.phone);

        $('#editCustomer').modal('show');

    })
    .catch((errors) => {
        console.log(errors);
    })

}

const btnDoEdit = $("#btn-edit");
btnDoEdit.on('click', doEdit);

function doEdit(){

    let fullName = $("#name-edit").val();
    let email = $("#email-edit").val();
    let address = $("#address-edit").val();
    let phone = $("#phone-edit").val();

    let customer = {
        fullName,
        email,
        address,
        phone
    }

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: "PATCH",
        url: 'http://localhost:3000/customers/'+customerId,
        data: JSON.stringify(customer)
    })
    .done((data) => {
        let dataStr = renderCustomer(data);
        let currentRow = $("#row_"+customerId);

        currentRow.replaceWith(dataStr);
        addAllEvent();
        
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Edit thành công',
            showConfirmButton: false,
            timer: 1500
        })
    })

}

function addEventShowModalDeposit(){
    // all query select
    let btnShowDeposit = $('.deposit');

    btnShowDeposit.off('click');
    btnShowDeposit.on('click',function() {
        $('#deposit').modal('show');

        customerId = $(this).data('id');
        showDeposit(customerId);
    })
}

function showDeposit(id){
    findCustomerById(id)
    .then((data) => {
        $("#name-deposit").val(data.name);
        $("#email-deposit").val(data.email);
        $("#address-deposit").val(data.address);
        $("#phone-deposit").val(data.phone);
        $("#balance-deposit").val(data.balance);
    })
    .catch((errors) => {
        console.log(errors);
    })
}

const btnDoDeposit = $("#btn-deposit");
btnDoDeposit.on('click', doDeposit);

function doDeposit(){
    let transactionAmount = +$("#trans-amount-deposit").val();

    findCustomerById(customerId)
    .then((data) => {
        let balance = data.balance + transactionAmount;

        let customer = {
            balance
        }
    
        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'PATCH',
            url: 'http://localhost:3000/customers/'+customerId,
            data: JSON.stringify(customer)
        })
        .done((data1) => {
            let dataStr = renderCustomer(data1);
            let currentRow = $("#row_"+customerId);
    
            currentRow.replaceWith(dataStr);
            addAllEvent();
    
            $("#trans-amount-deposit").val("");
            $("#balance-deposit").val(data1.balance);
    
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Deposit thành công',
                showConfirmButton: false,
                timer: 1500
            })
        })
        .fail((errors) => {
            console.log(errors);
        });

        let deposit = {
            customerId,
            transactionAmount
        }

        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'POST',
            url: "http://localhost:3000/deposits",
            data: JSON.stringify(deposit)
        })
        .done((data))
        .fail((errors) => {
            console.log(errors);
        });
    
    })
    .catch((errors) => {
        console.log(errors);
    });

    
    
}

function showWithdraw(id){
    findCustomerById(id)
    .then((data) => {
        $("#name-withdraw").val(data.name);
        $("#email-withdraw").val(data.email);
        $("#address-withdraw").val(data.address);
        $("#phone-withdraw").val(data.phone);
        $("#balance-withdraw").val(data.balance);
    })
    .catch((errors) => {
        console.log(errors);
    });
    
}

function addEventShowModalWithdraw(){
    // all query select
    let btnShowWithdraw = $(".withdraw");

    btnShowWithdraw.off('click');
    btnShowWithdraw.on('click', function(){
        $('#withdraw').modal('show');

        customerId = $(this).data('id');
        showWithdraw(customerId);
    })
}

const btnDoWithdraw = $("#btn-withdraw");
btnDoWithdraw.on('click', doWithdraw);

function doWithdraw(){
    var transactionAmount = +$("#trans-amount-withdraw").val();

    findCustomerById(customerId)
    .then((data) => {
        let balance = data.balance - transactionAmount;

        let customer = {
            balance
        }
    
        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'PATCH',
            url: 'http://localhost:3000/customers/'+customerId,
            data: JSON.stringify(customer)
        })
        .done((data1) => {
            let dataStr = renderCustomer(data1);
            let currentRow = $("#row_"+customerId);
    
            currentRow.replaceWith(dataStr);
            addAllEvent();
    
            $("#trans-amount-withdraw").val("");
            $("#balance-withdraw").val(data1.balance);
    
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Rút tiền thành công',
                showConfirmButton: false,
                timer: 1500
            })
        })
        .fail((errors) => {
            console.log(errors);
        });

        let withdraw = {
            customerId,
            transactionAmount
        }

        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'POST',
            url: "http://localhost:3000/withdraws",
            data: JSON.stringify(withdraw)
        })
        .done((data))
        .fail((errors) => {
            console.log(errors);
        });
    
    })
    .catch((errors) => {
        console.log(errors);
    });

}

const inpTransAmount = $("#trans-amount-transfer");
inpTransAmount.on('input',calculateTotal)

function calculateTotal(){
    amount = $("#trans-amount-transfer").val();
    let amountNum = parseFloat(amount);
    $('#total-transfer').val(amountNum + (amountNum * 0.1));
}

function addEventShowModalTransfer(){
    // all query select
    let btnShowTransfer = $(".transfer");

    btnShowTransfer.off('click');
    btnShowTransfer.on("click", function() {
        $('#transfer').modal('show');

        customerId = $(this).data('id');
        showTransfer(customerId);
    })
}

function renderRecipientOption(recipient){
    return  `
    <option value="${recipient.id} ">${recipient.name} </option>
    `;
}

function showTransfer(id){
    
    let recipientSelect = $("#recipient-transfer-id");

    findCustomerById(id).then((data) => {

        $("#name-transfer").val(data.name);
        $("#email-transfer").val(data.email);
        $("#address-transfer").val(data.address);
        $("#phone-transfer").val(data.phone);
        $("#balance-transfer").val(data.balance);

        $.ajax({
            type: "GET",
            url: "http://localhost:3000/customers?id_ne="+id,
        })
        .done((recipients) => {
            console.log(recipients);

            recipientSelect.empty();
            recipients.forEach(item => {
                let recStr = renderRecipientOption(item);
                console.log(recStr);
                recipientSelect.append(recStr);
            })
        })
        .fail((errors1) => {
            console.log(errors1);
        })
    })
    .catch((errors) => {
        console.log(errors);
    });
}

const btnDoTransfer = $("#btn-transfer");
btnDoTransfer.on("click",doTransfer);

function doTransfer(){
    let senderId = customerId;
    let recipientId = +$("#recipient-transfer-id").val();

    var transAmount = +$("#trans-amount-transfer").val();
    var totalTransAmount = transAmount*1.1;

    let senderBalance;
    let recipientBalance;

    findCustomerById(senderId)
    .then((data) => {
        senderBalance = data.balance - totalTransAmount;
        let newSender = {
            balance : senderBalance
        }

        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: "PATCH",
            url: 'http://localhost:3000/customers/'+senderId,
            data: JSON.stringify(newSender)
        })
        .done((data2) => {
            let dataStr = renderCustomer(data2);
            let currentRow = $("#row_"+senderId);
    
            currentRow.replaceWith(dataStr);
            $("#balance-transfer").val(senderBalance);

            addAllEvent(); 
        })

        findCustomerById(recipientId).then((data1) => {
            recipientBalance = data1.balance + transAmount;
            let newRecipient = {
                balance : recipientBalance
            }
            $.ajax({
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                type: "PATCH",
                url: 'http://localhost:3000/customers/'+recipientId,
                data: JSON.stringify(newRecipient)
            })
            .done((data3) => {
                let dataStr = renderCustomer(data3);
                let currentRow = $("#row_"+recipientId);
        
                currentRow.replaceWith(dataStr);
                addAllEvent(); 
        
                $("#trans-amount-transfer").val("");
                $("#total-transfer").val("");
        
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Chuyển tiền thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
            })

            let transfer = {
                senderId,
                recipientId,
                transferAmount: transAmount,
                transactionAmount: totalTransAmount,
                feeAmount: (totalTransAmount - transAmount)
            }

            $.ajax({
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                type: "POST",
                url: "http://localhost:3000/transfers",
                data: JSON.stringify(transfer)
            })
            .done((data) => {

            })
            .fail((errors) => {

            });
    
        }).catch((errors1) => {
            console.log(errors1);
        });

    })
    .catch((errors) => {
        console.log(errors);
    });

    
    
}

function addEventRemove(){
    // all query select
    let btnRemove = $(".remove");

    btnRemove.off('click');
    btnRemove.on("click",function(){
            customerId = $(this).data('id');
            removeCustomer(customerId);
        })
}

function removeCustomer(id){
    let customer = {
        deleted: 1
    }

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
   
            $.ajax({
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                type: "PATCH",
                url: "http://localhost:3000/customers/"+customerId,
                data: JSON.stringify(customer),
            })
            .done((data) => {

                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )

                let currentRow = $("#row_"+customerId);
                currentRow.remove();

            })
        }
      })
}