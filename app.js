let urlCountries = 'https://restcountries.com/v3.1/all'; // url de los paises

let urlWheater = '';
const searchCountry = document.getElementById('search-country');//input del buscador de paises
const containerCountries = document.querySelector('.containercountries');//div contenedor de los paises
const card = document.querySelector('.card');
searchCountry.style.display = 'none';//inicializacion del input buscador en display none 
let containerCards = '';
let storeInfoCountries = '';
let encontrar= '';
containerCountries.innerHTML = `<div class="lds-facebook"><div></div><div></div><div></div></div>`;//div del cargador principal


//funcion para almacenar los datos de la api de los paises

const apiCountries = () =>{

    fetch(urlCountries)
     .then(response => response.json())
     .then(data => showData(data))
     .catch(error => console.log(error))
}

const showData = (data) => {
    
    storeInfoCountries = data;
    containerCountries.innerHTML = '';
    searchCountry.style.display = 'block';

}
apiCountries();
//evento del input de busqueda de pais
searchCountry.addEventListener('input', e =>{

    evaluar(searchCountry.value);
})

const evaluar = (pais) => {
     
     encontrar = storeInfoCountries.filter(encontrar => encontrar.name.common.toLowerCase().startsWith(pais.toLowerCase()));//encuentra los paises que coincidan con las letras ingresadas
     
     if(pais !== ''){//evalua si no esta vacio el input
        containerCountries.style.display = 'flex';
        
     if(encontrar.length < 10 && encontrar[0] !== undefined){//evaluda si es mayor a 10 la cantidad de paises
            
            encontrar.forEach(element => { //funcion para imprimir las tarjetas de los paises 
               
                containerCards += `<div class="card">
                <img class="imgflag" src="${element.flags.png}" alt="">
                <p class="text">Pais:&nbsp<span>${element.name.common}</span> </p>
                </div>`;
            });
            containerCountries.innerHTML = containerCards;//imprime los paises
            containerCards = '';
            dataComplete(encontrar);//funcion para evaluar si el pais es solo uno en la busqueda del input 
        
     }else{
        containerCountries.innerHTML = '<p class="text">Su busqueda debe ser mas especifica</p>';
     }
    }else{
        containerCountries.style.display = 'none';
    }
}

const dataComplete = (encontrar) =>{

    if(encontrar.length === 1){

        (async()=>{
            try{
                containerCountries.innerHTML = '<div class="lds-facebook"><div></div><div></div><div></div></div>';
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encontrar[0].name.common}&lang=es&appid=d999f09c012f5587df3dd7c5a845b45d&units=metric`);//url del clima
                containerCountries.innerHTML = '';
                if(response.status>=400){
                    throw new Error('nooooo');
                }
                const data = await response.json();
                messageEnd (data, encontrar);

            }catch (Error){
                console.log(error);

            }
        })();
    
    }
};

const messageEnd = (data, encontrar) => { //funcion para imprimir el mensaje final cuando la bandera solo sea una

    let convertirNumber = (parseInt(encontrar[0].population)).toLocaleString();

    containerCountries.innerHTML = `<div class="card">
    <img class="imgflag" src="${encontrar[0].flags.png}" alt="">
    <p class="text">Pais: ${encontrar[0].name.common}</p>
    <p class="text">Capital: ${encontrar[0].capital[0]}</p>
    <p class="text">Poblacion: ${convertirNumber}</p>
    <p class="text">Region: ${encontrar[0].region}</p>
    <p class="text">Temperatura: ${data.main.temp}°C</p>
    <p class="text">Clima: ${data.weather[0].description}<span><img class="imgweather" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt=""></span></p>
    </div>`;
}

//evento de hacer click en cada tarjeta
containerCountries.addEventListener('click', e =>{

    let clickNameCountry = e.target.innerHTML;

    encontrar = storeInfoCountries.filter(encontrar => encontrar.name.common === clickNameCountry);//encuentra los paises que coincidan con las letras ingresadas
    dataComplete(encontrar);
   
})