const registro = (event) => {
    event.preventDefault();
    const credentials = {
        name: event.target.name.value,
        username: event.target.username.value,
        email: event.target.email.value,
        password: event.target.password.value,
    }
    console.log(credentials);

    fetch('http://localhost:3000/users/registrar', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
    .then(res => {        
        res.json(); 
        console.log("res.json:",res);
        if (res.status == 400) {
            throw new Error("Ya existe se ha registrado alguien con ese usuario y/o email; elige otro."); 
        }
    })
    .then(res => {       
        window.alert("Le hemos envíado un correo electrónico; abralo y pulse en link para confirmar su cuenta. Gracias");
        window.location = "http://localhost:3000/login";     
    })    
    .catch((error) => {
        console.error(error)
        alert("Ha ocurrido un error: " + error); 
      });
}

const login = (event) => {
    event.preventDefault();
    const credentials = {
        username: event.target.username.value,
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
        console.log("SET authToken:", res.token);
    })
    .then(res => {        
        window.location = "http://localhost:3000/users/info";
    })
    .catch(error => console.log(error));
}

function logout() {
    fetch('http://localhost:3000/users/logout', {
        method: 'POST'        
    })    
    .then(res => res.json());

    fetch('http://localhost:3000/auth', {
        headers: {
            authorization: null
        }
    })
    .then(res => res.json())
    .then(res => {
        localStorage.removeItem('authToken', res.token)
        console.log("REMOVE authToken:", res.token);
    })
    .then((res) => {
        const { user } = res;
        console.log(user, res);
        window.location = "/";
        document.querySelector('header').innerHTML = `Hasta pronto <i>${user.username}</i>; esperamos verte pronto por aqui nuevamente.`;
        document.getElementById("login").innerHTML = `<a href="/login">Iniciar sesión</a>`;
    })
    .catch(error => console.log(error));
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
        document.getElementById("login").innerHTML = `<a href="#" onclick="logout()">Cerrar sesión</a>`;
    })
    .catch(error => console.log(error))
};
