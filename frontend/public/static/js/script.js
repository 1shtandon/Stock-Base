function validateEmail(email) {
    const re = /[a-zA-Z0-9.-]*[a-zA-Z0-9]@(?:gmail|yahoo|outlook)+\.(?:com|org|in)/;
    return re.test(email);
}

function validatePassword(pass) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    console.log(pass);
    // return re.test(pass);
    // TODO: fix
    return true;
}

function validateForm(form_name) {
    let form = document.forms[form_name];
    for (let i = 0; i < form.length; i++) {
        if (form[i].value === "" && form[i]) {
            alert(form[i].name + " is required");
            return false;
        } else if (form[i].name === "email" && !validateEmail(form[i].value)) {
            alert("Please enter a valid email address, we only accept gmail, yahoo and outlook email addresses");
            return false;
        } else if (form[i].name === "password" && !validatePassword(form[i].value)) {
            alert("Password must be at least 8 characters long and have at least one number");
            return false;
        } else if (form[i].name === "confirmPassword" && form[i].value !== form[i - 1].value) {
            alert("Passwords do not match");
            return false;
        } else if (form[i].name === "phone" && form[i].value.length !== 10) {
            alert("Phone number must be 10 digits long");
            return false;
        } else if (form[i].name === "phone" && !Number.isInteger(Number(form[i].value))) {
            alert("Phone number must be a number");
            return false;
        }
    }
    return true;
}