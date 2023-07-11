const form = document.getElementById('form');
const email = document.getElementById('emailinput');
const password = document.getElementById('passwortinput');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    checkInputs();
});

function checkInputs() {

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (emailValue === '' || emailValue == null) {
        
        setErrorFor(email, 'Bitte geben Sie Ihre E-Mail ein!');

    } else {
        setSuccessFor(email);
    }

    if (passwordValue === '' || password == null) {
        
        setErrorFor(password, 'Bitte geben Sie Ihr Passwort ein!');

    } else {
        setSuccessFor(password);
    }
}

function setErrorFor(input, message) {

    const formControl = input.parentElement;
    const small = formControl.querySelector('small');

    formControl.className = 'form-control error';

    small.innerText = message;
}

function setSuccessFor(input) {

    const formControl = input.parentElement;

    formControl.className = 'form-control success';
}

function isEmail(input) {

    
    
}