function submitForm() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Envoyer les informations d'authentification au backend pour vérification
    var data = {
        username: username,
        password: password,
    };
    fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            //ajouter les cookies dans la requête
            credentials: 'include',
            //ajouter la réponse dans la headers de la requête
            mode: 'cors'
        })
        .then(response => {
            if (response.status === 200) {
                // Si le statut est 200, rediriger l'utilisateur vers la page de gestion des tokens django
                window.location.href = 'http://localhost:8000/api/token';
            } else if (response.status === 401) {
                // Si le statut est 401, afficher la popup avec un message d'erreur
                alert("Mot de passe incorrect");
                //supprimer ce qu'il y a dans le champ password
                document.getElementById("password").value = "";
            } else {
                console.log('Error:', response.status);
                window.location.href = '/';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


function main() {
    const connect_button = document.getElementById('subscribeBtn');

    function connect() {
        window.location.href = '/register';
    }
    connect_button.addEventListener('click', connect);
}

main();