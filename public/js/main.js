const URLorigin  = window.location.origin;

const registro = (event) => {
    event.preventDefault();
    const credentials = {
        name: event.target.name.value,
        username: event.target.username.value,
        email: event.target.email.value,
        password: event.target.password.value,
    }
    console.log(credentials);

    fetch(URLorigin + '/users/registrar', {
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
            throw new Error("Ya existe se ha registrado alguien con ese usuario y/o email; elige otro, por favor."); 
        }
    })
    .then(res => {       
        window.alert("Le hemos envíado un correo electrónico; abralo y pulse en link para confirmar su cuenta. Gracias");
        window.location = URLorigin + "/login";     
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

    fetch(URLorigin + '/users/login', {
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
        window.location = URLorigin + "/users/info";
    })
    .catch(error => console.log(error));
}

function logout() {
    fetch(URLorigin + '/users/logout', {
        method: 'POST',
        headers: {
            'authorization': localStorage.getItem('authToken')
        }
    })    
    .then(res => res.json())    
    .then(res => {
        const { user } = res;
        console.log(user, res, res.message);
        localStorage.removeItem('authToken')
        console.log("REMOVE authToken.");

        window.location.href = "/";
        alert(`Hasta pronto ${user.name}; esperamos verte pronto por aqui nuevamente.`);
    })
    .catch(error => console.log(error));
}

const token = localStorage.getItem('authToken');
if (token) {
    fetch(URLorigin + '/auth', {
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
