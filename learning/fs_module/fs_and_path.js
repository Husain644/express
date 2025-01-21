import path from 'path';
import fs from 'fs'
import { fileURLToPath } from 'url';
import { faker } from '@faker-js/faker';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const dataFolder=path.join(__dirname,"data")
if(!fs.existsSync(dataFolder)){
    fs.mkdirSync(dataFolder)
    console.log('data folder created');
}
const filePath=path.join(dataFolder,'abc.csv');
fs.writeFileSync(filePath,'User Name,Email,City')
for(let i=2;i<=10;i++){
    const name=faker.internet.username();
    const email=faker.internet.email();
    const city=faker.location.city()
    fs.appendFileSync(filePath,`\n${name},${email},${city}`)
}
//const content=fs.readFileSync(filePath,'utf-8')

