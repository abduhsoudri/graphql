togglePasswordIcon.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';

    if (isPassword) {
        passwordInput.type = 'text';
        togglePasswordIcon.classList.remove('bx-hide');
        togglePasswordIcon.classList.add('bx-show');
    } else {
        passwordInput.type = 'password';
        togglePasswordIcon.classList.remove('bx-show');
        togglePasswordIcon.classList.add('bx-hide');
    }
});
