// Seleccionar el Form
const form = document.querySelector('.form'); //form

// Seleccionar todos los inputs
const inputs = document.querySelectorAll('.input');

// Seccion email
const _email = document.querySelector('#email'); //email
const textError = document.querySelector('#textError'); //Texto del error
const simbolo = document.querySelector('#simbolo'); //Icono del error

const button = document.querySelector('#submit'); // button
const destiny = document.querySelector('#destiny');

const templateIDs = {
    mesaDirectiva: "template_7uwpr7r", 
    consejoConsultivo: "template_ws1cq1n"
}

// Funciones

// Crea un elemento -> param: (clases, tipo de elemento, su elemento padre, y un mensaje si es necesario)
const mostrarMensaje = (clases, tipoElemento, padre, mensaje)=> {
    padre = document.querySelector(padre);
    const obj = document.createElement(tipoElemento);
    obj.textContent = mensaje;
    let arrayClases = clases.split(" ");
    for (const i of arrayClases) {
        obj.classList.add(i);
    }
    padre.appendChild(obj);
    
    setTimeout(() => {
        obj.classList.add(`${arrayClases[0]}-appear`);
    }, 200);
    setTimeout(()=> {
        obj.classList.add(`${arrayClases[0]}-opacity`);
    },2500);
    setTimeout(()=> {
        obj.remove();
    },3000);
}


// ReCaptcha
function submitUserFormReCaptcha() {
    let response = grecaptcha.getResponse();
    let bool;
    if(response.length == 0) {
        bool =  false;
    } else {
        bool =  true;
    }
    return bool;
}


// Enviar formulario
function envioFormulario(service, template, form) {
    const serviceID = service; //colocar el id del servicio
    const templateID = template; //Colocar el id del formato de correo
    //Estos datos se encuentran en la cuenta de EmailJS.

    emailjs.sendForm(serviceID, templateID, form)
        .then(() => {

            mostrarMensaje('icono fa-solid fa-circle-check', 'I', '#form');

            inputs.forEach(input => {
                input.value = '';
            });

            button.textContent = 'Enviar';

        }, (err) => {
            mostrarMensaje('icono-x fa-solid fa-circle-xmark', 'I', '#form');
            button.textContent = 'Enviar';
            console.log(JSON.stringify(err));
        });
}

// Eventos
_email.addEventListener('blur', function() {
    if(this.value !== '') {
        if(this.value === '@' || !this.value.includes('@')) {
            this.focus();
            if(!document.querySelector('#div_error').hasChildNodes()) {
                mostrarMensaje('textErrorMail', 'P', '#div_error', `Escribe un correo válido`);
                mostrarMensaje('advertencia fa-solid fa-circle-exclamation', 'I', '#div_error');
            }
        }
    }
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if(!submitUserFormReCaptcha()) {
        console.log('Verifica el captcha');
        if(!document.querySelector('#container-textErrorCaptcha').hasChildNodes()) {
            mostrarMensaje('errorCaptcha', 'P', '#container-textErrorCaptcha', `Campo requerido`);
            mostrarMensaje('advertencia fa-solid fa-circle-exclamation', 'I', '#container-textErrorCaptcha');
        }

    } else {
        console.log('captcha verificado');
        button.textContent = 'Enviando...';
        if(destiny.value == templateIDs.mesaDirectiva) {
            // Prueba envio a la Mesa Directiva
            envioFormulario('default_service', templateIDs.mesaDirectiva, this);
        }
        else if(destiny.value == templateIDs.consejoConsultivo) {
            // Prueba envio al Consejo consultivo
            envioFormulario('default_service', templateIDs.consejoConsultivo, this);
        }
        else {
            // Si ninguna se cumple, aparece un error
            mostrarMensaje('icono-x fa-solid fa-circle-xmark', 'I', '#form');
            button.textContent = 'Enviar';
        }
    }    
});



