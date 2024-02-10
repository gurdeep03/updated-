const apikey="e2bd78418baeed33d668165063807a61"; //used to authenticate and access a specific API.
window.addEventListener("load",()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{  //receives the user's position object containing latitude and longitude coordinates.
            let lon= position.coords.longitude;
            let lat= position.coords.latitude;
            const url= `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` + `lon=${lon}&appid=${apikey}`;
            

            fetch(url).then((res)=>{ // retrieves the weather data from the OpenWeatherMap API.
                return res.json();
            }).then((data)=>{
                console.log(data);
                console.log(new Date().getTime())
                var dat= new Date(data.dt)
                console.log(dat.toLocaleString(undefined,'Asia/Kolkata'))
                console.log(new Date().getMinutes())
                weatherReport(data);
            })
        })
    }
})


function searchByCity(){  //retrieves the value entered in the input field
    var place= document.getElementById('input').value;
    var urlsearch= `http://api.openweathermap.org/data/2.5/weather?q=${place}&` + `appid=${apikey}`; //used to fetch weather data for the specified city.
    //GET request to the constructed URL
    fetch(urlsearch).then((res)=>{ // This converts the response data into a JavaScript object that can be easily used and manipulated.
        return res.json();
    }).then((data)=>{  
        console.log(data);
        weatherReport(data);
    })
    document.getElementById('input').value='';
}

function weatherReport(data){ //represents the weather data for a specific city

    var urlcast= `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` + `appid=${apikey}`;

    fetch(urlcast).then((res)=>{
        return res.json();
    }).then((forecast)=>{
        console.log(forecast.city);
        hourForecast(forecast);
        dayForecast(forecast)
        //These functions are responsible for processing and displaying the hourly and daily forecasts, respectively.

        console.log(data); //updates the HTML elements on the page with the relevant weather information
        document.getElementById('city').innerText= data.name + ', '+data.sys.country;
        console.log(data.name,data.sys.country);
    
        console.log(Math.floor(data.main.temp-273));
        document.getElementById('temperature').innerText= Math.floor(data.main.temp-273)+ ' °C';
    
        document.getElementById('clouds').innerText= data.weather[0].main;
        console.log(data.weather[0].main)
        
        const image =document.querySelector(".icon"); // selects the appropriate weather icon based on the weather condition
        if (data.weather[0].main=="Clouds"){
            image.src="clouds.gif"
        } else if(data.weather[0].main=="Thunderstorm"){
            image.src="thunderstorm.png"
        }
        else if(data.weather[0].main=="Drizzle"){
            image.src="drizzle.png"
        }
        else if(data.weather[0].main=="Rain"){
            image.src="heavy-rain.png"
        }
        else if(data.weather[0].main=="Snow"){
            image.src="snow.png"
        }
        else if(data.weather[0].main=="Clear"){
            image.src="sunny.png"
        }
        else if(data.weather[0].main=="Atmosphere"){
            image.src="mist.png"
        }

    })

}

function hourForecast(forecast){  //This function is responsible for processing and displaying the hourly forecast.

    document.querySelector('.templist').innerHTML=''
    for (let i = 0; i < 5; i++) {

        var date= new Date(forecast.list[i].dt*1000)
        console.log((date.toLocaleTimeString(undefined,'Asia/Kolkata')).replace(':00',''))

        let hourR=document.createElement('div');
        hourR.setAttribute('class','next');

        let div= document.createElement('div');
        let time= document.createElement('p');
        time.setAttribute('class','time')
        time.innerText= (date.toLocaleTimeString(undefined,'Asia/Kolkata')).replace(':00','');

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';

        div.appendChild(time)
        div.appendChild(temp)

        let desc= document.createElement('p');
        desc.setAttribute('class','desc')
        desc.innerText= forecast.list[i].weather[0].main;

        hourR.appendChild(div);
        hourR.appendChild(desc)
        document.querySelector('.templist').appendChild(hourR);
}
}

function dayForecast(forecast){ //This functions is responsible for processing and displaying the daily forecast.

    document.querySelector('.weekF').innerHTML=''
    for (let i = 8; i < forecast.list.length; i+=8) {
        console.log(forecast.list[i]);
        let div= document.createElement('div');
        div.setAttribute('class','dayF');
        
        let day= document.createElement('p');
        day.setAttribute('class','date')
        day.innerText= new Date(forecast.list[i].dt*1000).toDateString(undefined,'Asia/Kolkata');
        div.appendChild(day);

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';
        div.appendChild(temp)

        let main= document.createElement('p');
        main.setAttribute('class','desc')
        main.innerText= forecast.list[i].weather[0].main;
        div.appendChild(main);

        document.querySelector('.weekF').appendChild(div)
    }
} 
