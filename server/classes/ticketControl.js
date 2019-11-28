const fs = require('fs');

class Ticket{
    constructor(id,idBarber){
        this.id = id;
        this.idBarber = idBarber;
        

    }
}




class TicketControl{
    constructor(){
        this.last = 0;//id of last tickets
        this.today = new Date().getDate();
        this.tickets = [];//this is the list of not attendented orders yet
        let data = require('../data/data.json');

        console.log(data);
        if(data.today === this.today){
            this.last = data.last; //persistent data
        }else{
            this.reloadCount();
        }
    }

    nextTicket(){


        this.last = this.last + 1;
        this.saveInFile(); //do a backup 
        return `Ticket ${this.last}`;
    }
    getLastTicket(){
        return `Ticket ${this.last}`;
    }

    reloadCount(){
        this.last = 0;
        console.log("Se ha inicializado el sistema");
        this.saveInFile();
    }
    saveInFile(){

        let jsonData = {
            last : this.last,
            today : this.today
        };
        let jsonDataString = JSON.stringify(jsonData);//convert to string
        fs.writeFileSync('./server/data/data.json',jsonDataString);
        
    }
}



module.exports={
    TicketControl
}