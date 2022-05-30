import React, { useState } from 'react';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import "./Weather.css";
import lang from "./idiomas"
import creds from "./creds.json"

const Weather = () => {
    const[search, setSearch] = useState()
    const[base, setBase] = useState({})
    const[langs, setLangs] = useState("en")
    const[cords, setCords] = useState({});
    const[hourly, setHourly] = useState([])
    const[daily, setDaily] = useState([])
    const [showDaily, setShowDaily] = useState(false);
    const [showHourly, setShowHourly] = useState(false);
    const URL = "http://api.openweathermap.org/data/2.5/";
    const handleSubmit = (e) => {
        e.preventDefault();//Para não carregar a página após submit
        
        //carregar API após pesquisa
        if(search !==" "){
            fetch(`${URL}weather?q=${search}&lang=${langs}&appid=${creds.api}`).then((res)=>{
              return  res.json();
            })
            .then(displayData).then(hendleHourlyDailyData);
        }

        else{
            alert("Enter a valid location")
        }
    };  
    
    //dados diários
    const hendleHourlyDailyData = (_data) => {
        if(cords){
            fetch(`${URL}onecall?lat=${cords?.lat}&lon=${cords?.lon}&lang=${langs}&appid=${creds.api}`).then((res)=>{
                return res.json()
            })
            .then(displayHDdata)
        }
    }


    function displayHDdata(_data){
         console.log(_data)
         setHourly(_data.hourly)
         setDaily(_data.daily)
    }

    function displayData(_data){
        setBase(_data)
        setCords(_data.coord)
        console.log(_data)
    }


    const handleDaily = () => {
        setShowDaily((show) => !show);
      };
    
      const handleHourlyData = () => {
        setShowHourly((show) => !show);
      };

      //constante para carregar os dias da semana
    const days =["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    const months =[
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Otu",
        "Nov",
        "Dez",
    ];
 
    const displayDate =(d) => {
        let date = new Date(d*1000);
        let day = date.getDate();
        let month = months[date.getMonth()];
        let year = date.getFullYear();

        return day + " " + month + " " + year;

    }   

    const displayTime = (d)=>{
        let time = new Date(d * 1000)
        let hours = time.getHours();
        let mins = time.getMinutes();

        return hours + ":" + mins
     }

     const displayDay = (d) => {
         let day = new Date(d * 1000);
         let _day = days[day.getDay()];

         return _day;
     }
    return(
        <div className='weather'>
            <div className='weather-container'>
                <div className='weather-search'>
                    <form onSubmit={handleSubmit}>
                   
                            <input value={search} onChange={(e)=> setSearch(e.target.value)} placeholder="Busque uma localização"/>
                               
                        <select onChange={(e) => setLangs(e.target.value)} 
                          defaultValue={lang}
                        >
                                {lang.map((langs)=>(
                                    <option value={langs.code}>{langs.name}</option>
                                ))}
                        </select>
                        <button onClick={handleSubmit} 
                        type="submit">Pesquisar</button>
                    </form>
                </div>
                <div className='weather-current'>
                    <h4>{base?.name}, {base?.sys?.country}</h4>
                    <small>{displayDate(base.dt)}</small>
                    <div className='weather-info'>
                        <div className='weather-icon'>
                            <img src={ base?.weather && `https://openweathermap.org/img/wn/${base?.weather[0]?.icon}@2x.png`}/>
                        </div>
                        <div className='weather-temp'>
                            <p>{(parseInt(base.main?.temp) - 273.15).toFixed()}
                                <sup>°c</sup>
                            </p>
                            <small>
                                Real feel{" "}
                                <span>
                                {parseInt(base.main?.feels_like) - (273.15).toFixed()}°C,{" "}{base.weather && base?.weather[0]?.description}
                                </span>
                            </small>
                        </div>
                        <div className='weather-min-max'>
                            <div className='weather-max'>
                                <ArrowDropUpIcon/>
                                <p>
                                {parseInt(base.main?.temp_max) - (273.15).toFixed()}
                                    <sup>°c</sup>
                                </p>
                            </div>
                            <div className='weather-max'>
                                <ArrowDropDownIcon/>
                                <p>
                                {parseInt(base.main?.temp_min) - (273.15).toFixed()}
                                    <sup>°c</sup>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='weather-hourly-content'>
                    <div className='weather-hourly-data' onClick={handleHourlyData}
                    >
                        <p></p>
                        <div className='drop'>
                            <ArrowDropDownIcon/>
                        </div>
                    </div>
                    <div className='weather-hourly-container'>     
                            {showHourly &&
                            hourly?.map((_data) => (
 
                        <div className='weather-hourly-info'>
                            <p>{displayTime(_data.dt)}</p> 
                            <img src={`http://openweathermap.org/img/wn/${_data.weather[0]?.icon}@2x.png`}/>
     
                            <p className='day'>
                            {(parseInt(_data.temp) - 273.15).toFixed()}
                                <sup>°c</sup>
                            </p>
                        </div>

                        ))}
                    </div>
                    
                </div>
                <div className='weather-daily-content'>
                    <div className='weather-hourly-data' onClick={handleDaily}
                    >
                        <p>See hourly weather report</p>
                        <div className='drop'>
                            <ArrowDropDownIcon/>
                        </div>
                    </div>
                    <div className='weather-daily-container'>
                        {   showDaily &&
                            daily?.map((_data)=>(
                                <>
                                <div className='weather-daily-info'>
                            <img src={`http://openweathermap.org/img/wn/${_data.weather[0]?.icon}@2x.png`}/>
                        
                        <div className='weather-min-max'>
                            <div className='weather-max'>
                                <ArrowDropUpIcon/>
                                <p>
                                {parseInt(_data.temp?.max) - (273.15).toFixed()}
                                    <sup>°c</sup>
                                </p>
                            </div>
                            <div className='weather-max'>
                                <ArrowDropDownIcon/>
                                <p>
                                {parseInt(_data.temp?.min) - (273.15).toFixed()}
                                    <sup>°c</sup>
                                </p>
                            </div>
                        </div>
                        <p>{displayDay(_data.dt)}</p>
                        <p>{_data.weather[0].description}</p>
                        </div>
                        </> ))}
                    </div>
                </div>
            </div>
        </div>    
    )
}

export default Weather;