import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';

const fileContent = fs.readFileSync('./time_series_covid19_deaths_US.csv', { encoding: 'utf-8' })
                        .split('\n')
                        .map((row:string):string[] =>{
                            return row.split(',')
                        });

const states : Array<string>=[];
fileContent.forEach(data =>{
    if(!states.includes(data[6])){
        states.push(data[6])
    }
});
states.shift()

for(let i:number=0; i<states.length; i++){
    let sum: number =0;
    const resultStates:string[][] = fileContent.filter(data=>data[6]==states[i])
    if(states[i]==="American Samoa"||
        states[i]===" Diamond Princess"||
        states[i]==="Grand Princess"||
        states[i]==="Guam"||
        states[i]==="Northern Mariana Islands"||
        states[i]==="Virgin Islands" 
    ){
        resultStates.forEach(data=> {
            sum = sum + parseInt(data[12])
        })
    }else{
        resultStates.forEach(data=> {
            sum = sum + parseInt(data[13])
        })
    }
    
    console.log("el estado: ", states[i]," Tiene una poblaciuon de: ", sum)    
    // = resultStates.reduce((a:string[], b:string[])=>parseInt(a[13])+parseInt(b[13]),0)
    

}