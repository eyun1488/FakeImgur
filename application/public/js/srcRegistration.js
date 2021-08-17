var username = document.getElementById("registrationusername");
var password = document.getElementById("registrationpassword");
var confirmpassword = document.getElementById("registrationconfirmpassword");
var form = document.getElementById("formEvent");
var errorMsg = document.getElementById("errorMsg");

var submitPass = [false, false, false];

function usernameInputCheck(usernameInput) {
    var pass = false;
    var trueCount = 0;
    var checkLetters = /^[A-Za-z]/;
    var check3AlNum = /.*[a-zA-Z0-9]{3}/;
    var startLetter = document.getElementById("startLetter");
    var minThree = document.getElementById("minThree");
    if (usernameInput.match(checkLetters)) {
        startLetter.innerHTML = "✔ Username begins with a character";
        startLetter.style.color = "green";
        pass = true;
        trueCount++;
    }
    // if(username.value.length >= 3) {
    if (usernameInput.match(check3AlNum)) {
        minThree.innerHTML = "✔ Username has at least 3 alphanumeric character";
        minThree.style.color = "green";
        pass = true;
        trueCount++;
    }
    if (!pass) {
        startLetter.style.color = "red";
        minThree.style.color = "red";
        startLetter.innerHTML = "✗ Username begins with a character";
        minThree.innerHTML = "✗ Username has at least 3 alphanumeric character";
        pass = true;
        trueCount++;
    }
    if (trueCount == 3) {
        submitPass[0] = true;
    }
    return pass;
}

username.onchange = function (event) {
    var input = event.target.value;
    var inputBox = document.getElementById('requirementUserName');
    if (usernameInputCheck(input)) {
        inputBox.style.display = "block";
    }
}


function passwordCheck(passwordInput) {
    var pass = false;
    var trueCount = 0;
    var upperCheck = /[A-Z]/;
    var numCheck = /[0-9]/;
    var specialCheck = /[$&+,:;=?@#|'<>.^*()%!-]/;
    var eight = document.getElementById("leastEight");
    var upper = document.getElementById("leastUpper");
    var num = document.getElementById("leastOneNum");
    var special = document.getElementById("leastSpecial");


    if (password.value.length >= 8) {
        eight.innerHTML = "✔ Has at least 8 characters"
        eight.style.color = "green";
        trueCount++;
    }
    if (passwordInput.match(upperCheck)) {
        upper.innerHTML = "✔ Has at least 1 Upper Case Letter";
        upper.style.color = "green";
        pass = true;
        trueCount++;
    }
    if (passwordInput.match(numCheck)) {
        num.innerHTML = "✔ Has at least 1 number";
        num.style.color = "green";
        pass = true;
        trueCount++;
    }
    if (passwordInput.match(specialCheck)) {
        special.innerHTML = "✔ Has at least 1 of the following: (/*-+!@#$^&*)";
        special.style.color = "green";
        pass = true;
        trueCount++;
    }
    if (!pass) {
        eight.style.color = "red";
        upper.style.color = "red";
        num.style.color = "red";
        special.style.color = "red";
        eight.innerHTML = "✗ Has at least 8 characters";
        upper.innerHTML = "✗ Has at least 1 Upper Case Letter";
        num.innerHTML = "✗ Has at least 1 number";
        special.innerHTML = "✗ Has at least 1 of the following: (/*-+!@#$^&*)";
        pass = true;
    }

    if (trueCount == 4) {
        submitPass[1] = true;
    }
    return pass;
}

password.onchange = function (event) {
    var input = event.target.value;
    var inputBox = document.getElementById('requirementPassword');
    if (passwordCheck(input)) {
        inputBox.style.display = "block";
    }
}

function confirmationCheck() {
    var pass = false;
    var trueCount = 0;
    var match = document.getElementById("matchPassword");
    if (password.value == confirmpassword.value) {
        match.style.color = "green";
        match.innerHTML = "✔ Please have passwords match";
        pass = true;
        trueCount++;
    }
    if (!pass) {
        match.style.color = "red";
        match.innerHTML = "✗ Please have passwords match";
        pass = true;
    }
    if (trueCount == 1) {
        submitPass[2] = true;
    }
    return pass;
}

confirmpassword.onchange = function (event) {
    var input = event.target.value;
    var inputBox = document.getElementById('requirementConfirmPassword');
    if (confirmationCheck(input, inputBox)) {
        inputBox.style.display = "block";
    }
}

form.addEventListener('submit', (event) => {
    if (usernameInputCheck(username.value) == true && confirmationCheck(password.value) == true && passwordCheck(password.value) == true) {
        console.log("valid");
    } else {
        event.preventDefault();
        console.log("Invalid Form")
    }
});