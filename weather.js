"user strict";
const wrapper =document.querySelector(".wrapper"),
inputpart=wrapper.querySelector(".input-part"),
infotxt=inputpart.querySelector(".info-txt"),
inputfield=inputpart.querySelector("input"),
locationbtn=inputpart.querySelector("button"),
wicon=wrapper.querySelector(".weather-part img"),
arrowback=wrapper.querySelector("header i");

let api;

inputfield.addEventListener("keyup", e=>{
    // if user pressed enter btn and input field is not empty
    if(e.key == "Enter" && inputfield.value!=""){ 
// console.log("working");    
requestApi(inputfield.value);  
    }
});

locationbtn.addEventListener("click",()=>{
if(navigator.geolocation){    // if browser supports geolocation
navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
else{
alert("your browser doesn't support geolocation api")
}
});

function onSuccess(position){
const {latitude,longitude}=position.coords; // getting lat and lan of the user device from coords
 api=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=ace9d1befd65c2d85c2874b8b51f0de9`;
fetchData();
}

function onError(error){
    // console.log(error)
    infotxt.innerText=error.message;
infotxt.classList.add("error");
}

function requestApi(city){
 api=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=ace9d1befd65c2d85c2874b8b51f0de9`;
fetchData();
}

function fetchData(){
    infotxt.innerText="Getting weather details....";
infotxt.classList.add("pending");
// getting api response and returning it with parsing into js obj and in another
// then function calling weatherDetails function with passing api result as an argument
fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
    infotxt.classList.replace("pending","error");
    if(info.cod=="404"){
        infotxt.innerText=`${inputfield.value} is not a valid city name`;
    }
    else{
        // lets get required properties value from  th einfo object
        const city=info.name;
        const country=info.sys.country;
        const {description,id}=info.weather[0];
        const {feels_like,humidity,temp}=info.main;
// using custom icon according to the id which api return us
        if(id==800){
          wicon.src="clear.svg";
        }
        else if(id>=200 && id<=232){
           wicon.src="storm.svg";
                    }
                    else if(id>=600 && id<=622){
                        wicon.src="snow.svg";
                                 }
                                 else if(id>=701 && id<=781){
                                    wicon.src="haze.svg";
                                             }
                                             else if(id>=801 && id<=804){
                                                wicon.src="cloud.svg";
                                                         }
                                                         else if(id>=300 && id<=321 || (id>=500 && id<=531)){
                                                            wicon.src="rain.svg";
                                                                     }

        // pass these value to a particular html element
        wrapper.querySelector(".temp .num").innerText=Math.floor(temp);
        wrapper.querySelector(".weather").innerText=description;
        wrapper.querySelector(".location span").innerText=`${city},${country}`;
        wrapper.querySelector(".temp .num-2").innerText=Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText=`${humidity}%`;

        infotxt.classList.remove("pending","error");
        wrapper.classList.add("active");
    }

}

arrowback.addEventListener("click",()=>{
 wrapper.classList.remove("active");
});