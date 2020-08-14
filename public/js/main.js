const login = (event) => {
    event.preventDefault();
    const credentials = {
        email: event.target.email.value,
        password: event.target.password.value,
    }
    console.log(credentials);

    fetch('http://localhost:3000/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
    .then(res => res.json())
    .then(res => {
        localStorage.setItem('authToken', res.token)
        //window.history.back();
        window.location = "http://localhost:3000/users/info";
    });
}

const token = localStorage.getItem('authToken');
if (token) {
    fetch('http://localhost:3000/auth', {
        headers: {
            authorization: token
        }
    })
    .then(res => res.json())
    .then((res) => {
        const { user } = res;
        console.log(user, res);
        document.querySelector('header').innerHTML = `Bienvenido <i>${user.username}</i>`;
        document.getElementById("login").innerHTML = `<a href="/users/logout">Cerrar sesión</a>`;
    })
}