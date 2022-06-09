import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';

type dataSet = {
    Province_State: string;
    Population: number;
    '4/27/21': number;
};

(() => {
  const csvFilePath = path.resolve(__dirname, './time_series_covid19_deaths_US.csv');

  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  parse(fileContent, {
    delimiter: ',', 
  }, 
  (error, result: Array<dataSet[]>) => {
    if (error) {
      console.error(error);
    }
    const states : Array<string>=[];
    result.forEach(data=>{
        if(!states.includes(data[6].toString())){
            states.push(data[6].toString())
        }
    })
    states.shift()
    let dataStates: Array<{
        ProvinceState: string,
        population: number,
        covidDeaths: number
    }> =[]
    for(let i:number=0; i<states.length; i++){
        let populationSum: number = 0;
        let covid19_deaths: number =0;        
        const resultStates:dataSet[][] = result.filter(data=>data[6].toString()==states[i])
        resultStates.forEach(data=> {
            populationSum = populationSum + parseInt(data[11].toString())
            covid19_deaths = covid19_deaths + parseInt(data[data.length-1].toString())
        })
        if(populationSum>0){
            dataStates.push({
                ProvinceState: states[i],
                population: populationSum,
                covidDeaths: covid19_deaths
            })
        }   
    }
    answer(dataStates)
  });
})();

function answer(dataStates: Array<{ProvinceState: string,population: number,covidDeaths: number}>){
    console.log("ESTOY AQUI*************************************")
    const max : number = Math.max(...dataStates.map(data => data.covidDeaths));
    console.log("1) El estado con mayor acumulado a la fecha es: ",dataStates.find(value => value.covidDeaths === max)?.ProvinceState, "con", max)
    
    const min : number = Math.min(...dataStates.map(data => data.covidDeaths));
    console.log("2) El estado con menor acumulado a la fecha es: ",dataStates.find(value => value.covidDeaths === min)?.ProvinceState, "con", min)


    // 3.	El porcentaje de muertes vs el total de población por estado
    console.log("3)Porcentaje de muertes por estado")
    dataStates.forEach(data =>{
        const PercentageDeaths: number = parseFloat(((data.covidDeaths*100)/data.population).toFixed(4))
        console.log(data.ProvinceState,"tiene una poblacion de",data.population,"y un % de muertes de", PercentageDeaths)
    })

}
