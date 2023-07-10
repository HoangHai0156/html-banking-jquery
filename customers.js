/// <reference path="D:\download\Code Gym\BaiTap\Module4\Module4_Hoang_Hai_C0223G1\HTML-bank-mangement\jquery\jquery-3.7.0.min.js" />
/// <reference path="js\app.js" />

let customerId = 0;

const page = {
    url: {
        getAllCustomers: App.API_CUSTOMER + '?deleted=0',
        getCustomerById: App.API_CUSTOMER+"/",
        createCustomer: App.API_CUSTOMER,
        updateCustomer: App.API_CUSTOMER+"/",
        increaseBalance: App.API_CUSTOMER+"/",
        createDeposit: App.API_DEPOSIT,
        decreaseBalance: App.API_CUSTOMER+"/",
        createWithdraw: App.API_WITHDRAW,
        createTransfer: App.API_TRANSFER,
        getAllRecipients: App.API_CUSTOMER + "?deleted=0&id_ne=",
        deleteCustomer: App.API_CUSTOMER+"/",
    },
    elements: {
        btnShowCreateCustomer: $(".create-customer"),
        tableBodyDiv: $(".customer-table-body"),
    },
    loadData: {},
    commands: {},
    dialogs: {
        elements: {
            modalCreateCustomer: $("#createCustomer"),
            fullNameCre: $("#name"),
            emailCre: $("#email"),
            addressCre: $("#address"),
            phoneCre: $("#phone"),
            btnCreate: $("#btn-create"),
            createCusErrorsDiv : $("#create-result"),
            createCustomerForm: $("#create-customer-form"),

            modalInfo: $("#infoCustomer"),
            fullNameInfo: $("#name-info"),
            emailInfo: $("#email-info"),
            addressInfo: $("#address-info"),
            phoneInfo: $("#phone-info"),
            balanceInfo: $("#balance-info"),

            modalEdit: $("#editCustomer"),
            fullNameEdit: $("#name-edit"),
            emailEdit: $("#email-edit"),
            addressEdit: $("#address-edit"),
            phoneEdit: $("#phone-edit"),
            btnDoEdit: $("#btn-edit"),
            editCustomerForm: $("#edit-customer-form"),

            modalDeposit: $("#deposit"),
            fullNameDep: $("#name-deposit"),
            emailDep : $("#email-deposit"),
            addressDep: $("#address-deposit"),
            phoneDep: $("#phone-deposit"),
            balanceDep: $("#balance-deposit"),
            transactionAmountDep: $("#trans-amount-deposit"),
            btnDoDeposit: $("#btn-deposit"),
            depositForm: $("#deposit-form"),

            modalWithdraw: $("#withdraw"),
            fullNameWithdraw: $("#name-withdraw"),
            emailWithdraw: $("#email-withdraw"),
            addressWithdraw: $("#address-withdraw"),
            phoneWithdraw: $("#phone-withdraw"),
            balanceWithdraw: $("#balance-withdraw"),
            transactionAmountWithdraw: $("#trans-amount-withdraw"),
            btnDoWithdraw: $("#btn-withdraw"),
            withdrawForm: $("#withdraw-form"),
            
            modalTransfer: $("#transfer"),
            transferAmountTransfer: $("#trans-amount-transfer"),
            transactionAmountTransfer: $('#total-transfer'),
            fullNameTrans: $("#name-transfer"),
            emailTrans: $("#email-transfer"),
            addressTrans: $("#address-transfer"),
            phoneTrans: $("#phone-transfer"),
            balanceTrans: $("#balance-transfer"),
            recipientSelect: $("#recipient-transfer-id"),
            btnDoTransfer: $("#btn-transfer"),

        },
        commands: {}
    },
    initializeControlEvent: {
    }
}

page.initializeControlEvent = () => {
    page.elements.btnShowCreateCustomer.on("click", () => {
        page.dialogs.elements.modalCreateCustomer.modal("show");
        page.dialogs.elements.createCusErrorsDiv.empty();
        page.commands.resetCreateModal();
        page.elements.createValidator.resetForm();
    })

    page.dialogs.elements.btnCreate.on("click", () => {
        if(page.dialogs.elements.createCustomerForm.valid()){
            page.dialogs.elements.createCustomerForm.submit(function (e) {
                e.preventDefault();
            })
            page.dialogs.commands.doCreate();
        }
    })
    
    page.elements.tableBodyDiv.on("click", ".info", function () {
        customerId = $(this).data("id");
        page.commands.showInfo(customerId);
    })

    page.elements.tableBodyDiv.on("click", ".edit", function() {
        customerId = $(this).data("id");
        page.commands.showEdit(customerId);
        page.elements.editValidator.resetForm();
    })

    page.dialogs.elements.btnDoEdit.on("click", () => {
        if(page.dialogs.elements.editCustomerForm.valid()){
            page.dialogs.elements.editCustomerForm.submit(function(e) {
                e.preventDefault();
            })
            page.dialogs.commands.doEdit();
        }
    })

    page.elements.tableBodyDiv.on("click",".deposit", function(){
        customerId = $(this).data('id');
        page.commands.showDeposit(customerId);
        page.elements.depositValidator.resetForm();
    })

    page.dialogs.elements.btnDoDeposit.on("click", () => {
        if(page.dialogs.elements.depositForm.valid()){
            page.dialogs.elements.depositForm.submit(function(e) {
                e.preventDefault();
            })
            page.commands.doDeposit();
        }
    })

    page.elements.tableBodyDiv.on("click", ".withdraw", function () {
        customerId = $(this).data('id');
        page.commands.showWithdraw(customerId);
    })

    page.dialogs.elements.btnDoWithdraw.on("click", () => {
        if(page.dialogs.elements.withdrawForm.valid()){
            page.dialogs.elements.withdrawForm.submit(function(e) {
                e.preventDefault();
            })
            page.commands.doWithdraw();
        }
    })

    page.dialogs.elements.transferAmountTransfer.on("input", () => {
        page.commands.calculateTotal();
    })

    page.elements.tableBodyDiv.on("click", ".transfer", function(){
        customerId = $(this).data('id');
        page.commands.showTransfer(customerId);
    })

    page.dialogs.elements.btnDoTransfer.on("click", () => {
        page.commands.doTransfer();
    })

    page.elements.tableBodyDiv.on("click", ".remove", function () {
        customerId = $(this).data('id');
        page.commands.removeCustomer();
    })
}

page.commands.renderCustomer = (customer) => {
    var id = customer.id;
    return `
    <tr id="row_${id}">
        <th scope="row" class="customer-id">${id}</th>
        <td class="customer-name">${customer.fullName}</td>
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

page.commands.showCustomers = () => {
    page.elements.tableBodyDiv.empty();

    $.ajax({
        type: "GET",
        url: page.url.getAllCustomers
    })
    .done((data) => {
        data.forEach(item => {
            const dataStr = page.commands.renderCustomer(item);
            page.elements.tableBodyDiv.prepend(dataStr);

            // addAllEvent();
        });
    })
    .fail((errors) => {
        console.log(errors);
    })
    ;

}

page.dialogs.commands.doCreate = () => {
    var fullName = page.dialogs.elements.fullNameCre.val();
    var email = page.dialogs.elements.emailCre.val();
    var address = page.dialogs.elements.addressCre.val();
    var phone = page.dialogs.elements.phoneCre.val();
    var balance = 0;
    var deleted = 0;

    let requires = [];
    // if(fullName == "") requires.push("Tên không được để trống");
    // if(email == "") requires.push("Email không được để trống");
    // if(address == "") requires.push("Địa chỉ không được để trống");
    // if(phone == "") requires.push("Phone không được để trống");

    if(requires.length > 0){
        var resultStr = ""
        for(var i = 0; i < requires.length; i++){
            resultStr += `
            <p class="alert alert-danger">${requires[i]}</p>
            `;
        }
        page.dialogs.elements.createCusErrorsDiv.html(resultStr)
    } else{
        let customer = new Customer(null,fullName,email,phone,balance,address,deleted)

        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'POST',
            url: page.url.createCustomer,
            data: JSON.stringify(customer)
        })
        .done((data) => {
            let dataStr = page.commands.renderCustomer(data);
            page.elements.tableBodyDiv.prepend(dataStr);

            // addAllEvent();

            page.commands.resetCreateModal();
            page.dialogs.elements.modalCreateCustomer.modal("hide");

            App.showSuccessAlert('KH mới đã được tạo!')
        })
        .fail((errors) => {
            console.log(errors);
        })
    }
}

page.commands.resetCreateModal = () =>{
    page.dialogs.elements.fullNameCre.val("");
    page.dialogs.elements.emailCre.val("");
    page.dialogs.elements.addressCre.val("");
    page.dialogs.elements.phoneCre.val("");
}

page.commands.showInfo = (id) => {
    page.commands.findCustomerById(id)
    .then((data) => {
        page.dialogs.elements.fullNameInfo.val(data.fullName);
        page.dialogs.elements.emailInfo.val(data.email);
        page.dialogs.elements.addressInfo.val(data.address);
        page.dialogs.elements.phoneInfo.val(data.phone);
        page.dialogs.elements.balanceInfo.val(data.balance);

        page.dialogs.elements.modalInfo.modal('show');
    })
    .catch((error) => {
        console.log(error);
    });
}

page.commands.findCustomerById = (id) => {
    return $.ajax({
        type: "GET",
        url: page.url.getCustomerById+id,
    });
}

page.commands.showEdit = (id) => {
    page.commands.findCustomerById(id)
    .then((data) => {

        page.dialogs.elements.fullNameEdit.val(data.fullName);
        page.dialogs.elements.emailEdit.val(data.email);
        page.dialogs.elements.addressEdit.val(data.address);
        page.dialogs.elements.phoneEdit.val(data.phone);

        page.dialogs.elements.modalEdit.modal('show');

    })
    .catch((errors) => {
        console.log(errors);
    })

}


page.dialogs.commands.doEdit = () => {

    let fullName = page.dialogs.elements.fullNameEdit.val();
    let email = page.dialogs.elements.emailEdit.val();
    let address = page.dialogs.elements.addressEdit.val();
    let phone = page.dialogs.elements.phoneEdit.val();

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
        url: page.url.updateCustomer+customerId,
        data: JSON.stringify(customer)
    })
    .done((data) => {
        let dataStr = page.commands.renderCustomer(data);
        let currentRow = $("#row_"+customerId);

        currentRow.replaceWith(dataStr);
        page.dialogs.elements.modalEdit.modal("hide");
        // addAllEvent();
        
        App.showSuccessAlert('Edit thành công');
    })

}

page.commands.showDeposit = (id) => {
    page.commands.findCustomerById(id)
    .then((data) => {
        page.dialogs.elements.fullNameDep.val(data.fullName);
        page.dialogs.elements.emailDep.val(data.email);
        page.dialogs.elements.addressDep.val(data.address);
        page.dialogs.elements.phoneDep.val(data.phone);
        page.dialogs.elements.balanceDep.val(data.balance);

        page.dialogs.elements.modalDeposit.modal("show");
    })
    .catch((errors) => {
        console.log(errors);
    })
}

page.commands.resetDepositModal = () => {
    page.dialogs.elements.transactionAmountDep.val("");
}

page.commands.doDeposit = () => {
    let transactionAmount = +page.dialogs.elements.transactionAmountDep.val();

    page.commands.findCustomerById(customerId)
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
            url: page.url.increaseBalance+customerId,
            data: JSON.stringify(customer)
        })
        .done((data1) => {
            let dataStr = page.commands.renderCustomer(data1);
            let currentRow = $("#row_"+customerId);
    
            currentRow.replaceWith(dataStr);
            // addAllEvent();
    
            page.commands.resetDepositModal();
    
            page.dialogs.elements.modalDeposit.modal("hide");
            App.showSuccessAlert('Deposit thành công');
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
            url: page.url.createDeposit,
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

page.commands.showWithdraw = (id) => {
    page.commands.findCustomerById(id)
    .then((data) => {
        page.dialogs.elements.fullNameWithdraw.val(data.fullName);
        page.dialogs.elements.emailWithdraw.val(data.email);
        page.dialogs.elements.addressWithdraw.val(data.address);
        page.dialogs.elements.phoneWithdraw.val(data.phone);
        page.dialogs.elements.balanceWithdraw.val(data.balance);

        page.dialogs.elements.modalWithdraw.modal("show");
    })
    .catch((errors) => {
        console.log(errors);
    });
    
}

page.commands.resetWithdrawModal = () =>{
    page.dialogs.elements.transactionAmountWithdraw.val("");
}

page.commands.doWithdraw = () => {
    var transactionAmount = +page.dialogs.elements.transactionAmountWithdraw.val();

    page.commands.findCustomerById(customerId)
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
            let dataStr = page.commands.renderCustomer(data1);
            let currentRow = $("#row_"+customerId);
    
            currentRow.replaceWith(dataStr);
            // addAllEvent();
    
            page.commands.resetWithdrawModal();
    
            App.showSuccessAlert('Rút tiền thành công');
            page.dialogs.elements.modalWithdraw.modal("hide");
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
            url: page.url.createWithdraw,
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

page.commands.calculateTotal = () => {
    amount = page.dialogs.elements.transferAmountTransfer.val();
    let amountNum = parseFloat(amount);
    page.dialogs.elements.transactionAmountTransfer.val(amountNum + (amountNum * 0.1));
}

page.commands.renderRecipientOption = (recipient) => {
    return  `
    <option value="${recipient.id} ">${recipient.fullName} </option>
    `;
}

page.commands.showTransfer = (id) => {
    page.commands.findCustomerById(id).then((data) => {

        page.dialogs.elements.fullNameTrans.val(data.fullName);
        page.dialogs.elements.emailTrans.val(data.email);
        page.dialogs.elements.addressTrans.val(data.address);
        page.dialogs.elements.phoneTrans.val(data.phone);
        page.dialogs.elements.balanceTrans.val(data.balance);

        page.dialogs.elements.modalTransfer.modal('show');

        $.ajax({
            type: "GET",
            url: page.url.getAllRecipients+id,
        })
        .done((recipients) => {
            console.log(recipients);

            page.dialogs.elements.recipientSelect.empty();
            recipients.forEach(item => {
                let recStr = page.commands.renderRecipientOption(item);
                console.log(recStr);
                page.dialogs.elements.recipientSelect.append(recStr);
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

page.commands.resetTransferModal = () =>{
    page.dialogs.elements.transferAmountTransfer.val("");
    page.dialogs.elements.transactionAmountTransfer.val("");
}

page.commands.doTransfer = () => {
    let senderId = customerId;
    let recipientId = +page.dialogs.elements.recipientSelect.val();

    var transAmount = +page.dialogs.elements.transferAmountTransfer.val();
    var totalTransAmount = transAmount*1.1;

    let senderBalance;
    let recipientBalance;

    page.commands.findCustomerById(senderId)
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
            url: page.url.decreaseBalance+senderId,
            data: JSON.stringify(newSender)
        })
        .done((data2) => {
            let dataStr = page.commands.renderCustomer(data2);
            let currentRow = $("#row_"+senderId);
    
            currentRow.replaceWith(dataStr);
            page.dialogs.elements.balanceTrans.val(senderBalance);

            // addAllEvent(); 
        })

        page.commands.findCustomerById(recipientId).then((data1) => {
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
                url: page.url.increaseBalance+recipientId,
                data: JSON.stringify(newRecipient)
            })
            .done((data3) => {
                let dataStr = page.commands.renderCustomer(data3);
                let currentRow = $("#row_"+recipientId);
        
                currentRow.replaceWith(dataStr);
                // addAllEvent(); 
        
                page.commands.resetTransferModal();
                page.dialogs.elements.modalTransfer.modal("hide");
        
                App.showSuccessAlert('Chuyển tiền thành công');
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
                url: page.url.createTransfer,
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

page.commands.removeCustomer = (id) => {
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
                url: page.url.deleteCustomer+customerId,
                data: JSON.stringify(customer),
            })
            .done((data) => {

                App.showSuccessAlert('Xóa KH thành công!')

                let currentRow = $("#row_"+customerId);
                currentRow.remove();

            })
        }
      })
}

page.elements.createValidator = page.dialogs.elements.createCustomerForm.validate({
    rules: {
        'name': {
            required: true,
            minlength: 3
        },
        email: {
            email: true,
            required: true,
        },
        address: {
            required: true,
            minlength: 3
        },
        phone: {
            required: true,
            phoneCus: true,
        }
    },
    messages: {
        'name': {
            required: "Tên không được để trống",
            minlength: "Tên phải ít nhất 3 ký tự"
        },
        email: {
            email: "Email phải đúng định dạng abc@abc.abc",
            required: "Email không được để trống"
        },
        address: {
            required: "Địa chỉ không được để trống",
            minlength: "Địa chỉ phải ít nhất 3 ký tự"
        },
        phone: {
            required: "Điện thoại không được để trống",
        }
    }
});

page.elements.editValidator = page.dialogs.elements.editCustomerForm.validate({
    rules: {
        'name-edit': {
            required: true,
            minlength: 3
        },
        'email-edit': {
            email: true,
            required: true,
        },
        'address-edit': {
            required: true,
            minlength: 3
        },
        'phone-edit': {
            required: true,
            phoneCus: true,
        }
    },
    messages: {
        'name-edit': {
            required: "Tên không được để trống",
            minlength: "Tên phải ít nhất 3 ký tự"
        },
        'email-edit': {
            email: "Email phải đúng định dạng abc@abc.abc",
            required: "Email không được để trống"
        },
        'address-edit': {
            required: "Địa chỉ không được để trống",
            minlength: "Địa chỉ phải ít nhất 3 ký tự"
        },
        'phone-edit': {
            required: "Điện thoại không được để trống",
        }
    }
});

page.elements.depositValidator = page.dialogs.elements.depositForm.validate({
    rules: {
        'trans-amount-deposit': {
            required: true,
            min: 1000,
        }
    },
    messages: {
        'trans-amount-deposit': {
            required: "Tiền nạp vào không được để trống",
            min: "Tiền nạp vào ít nhất 1000",
        }
    }
})
page.elements.withdrawValidator = page.dialogs.elements.withdrawForm.validate({
    rules: {
        'trans-amount-withdraw': {
            required: true,
            min: 1000,
            // max: +page.dialogs.elements.balanceWithdraw.val(),
        }
    },
    messages: {
        'trans-amount-withdraw': {
            required: "Tiền rút không được để trống",
            min: "Tiền rút ít nhất 1000",
            // max: "Tiền rút không được quá số dư",
        }
    }
})

page.loadData = () => {
    page.commands.showCustomers();

    $.validator.addMethod("phoneCus", function(phone_number, element) {
        return this.optional(element) || phone_number.match(/^\+1 \(\d{3}\) \d{3}-\d{4}$/);
      }, "Vui lòng nhập số điện thoại theo định dạng +1 (xxx) xxx-xxxx");
    // page.commands.validateAll();
    // page.commands.validator();
    page.elements.createValidator;
    page.elements.editValidator;
    page.elements.depositValidator;
    page.elements.withdrawValidator;
}

$(() => {
    page.loadData();

    page.initializeControlEvent();

})

