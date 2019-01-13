function hidePasswordMessages(){
    $("#passwordChangeSuccess").addClass("hide");       //Adds the class hide where id is passwordChangeSuccess
    $("#passwordChangeError").addClass("hide");         //Adds the class hide where id is passwordChangeError
}

//Request password change by making an ajax request to the "api/updatePassword" route
function requestPasswordChange(username) {
    $.ajax({
        url: "/api/updatePassword",
        type: "POST",
        data: JSON.stringify({
            user: username,
            currentPassword: $("#currentPassword").val(),
            password: $("#password").val(),
            password2: $("#password2").val(),
        }),
        contentType: "application/json"
    })
    .done(function (data) {     //Once route is made, retrieve data
        hidePasswordMessages(); 
        if(data.successMessage){
            //Removes hide where the id is passwordChangeSuccess
            $("#passwordChangeSuccess").removeClass("hide").children(".alert").text(data.successMessage);
        }else if(data.errorMessage){
            //Removes hide where the id is passwordChangeError
            $("#passwordChangeError").removeClass("hide").children(".alert").text(data.errorMessage);
        }
    })
    .fail(function (jqXHR) { //If there was an error, display it by removing the hide on passwordChangeError
        $("#passwordChangeError").removeClass("hide").children(".alert").text("AJAX Error: " + jqXHR.responseText);
    });
}

//Show/hide profile modal
$(document).ready(function () {
    $('#profileModal').on('hidden.bs.modal', function (e) {
        $(".passwordReset").val("");
        hidePasswordMessages();   
    })
});
