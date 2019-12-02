const fs = require("fs");
const User = require("../models/user");
const Order = require("../models/temporalOrder");



class Ticket {
  constructor(id, idBarber) {
    this.id = id;
    this.idBarber = idBarber;
  }
}

class TicketControl {
  constructor() {
    this.last = 0; //id of last tickets
    this.today = new Date().getDate();
    this.tickets = []; //this is the list of not attendented orders yet
    this.last4tickets = [];
    let data = require("../data/data.json");

    //console.log(data);
    if (data.today === this.today) {
      this.last = data.last; //persistent data
      this.tickets = data.tickets;
      this.last4tickets = data.last4tickets;
    } else {
      this.reloadCount();
    }
  }

  nextTicket(idCLient) {
    Order.find(function(err,orderDB){
      if (err) {
        return res.status(400).json({
          response: 3,
          content: err
        });
      }
      User.find({id:idCLient,status:true},function(err,userDB){
        if (err) {
          return res.status(400).json({
            response: 3,
            content:{
              message: "Error al buscar el cliente",
              err:err
            }
          });
        }
        if(userDB){
          console.log(userDB);
          let orderSave = new Order({
            id: userDB.length + 1,
            idClient : idCLient,
            dateBeginOrder:new Date(),
            address: userDB.address,
            typeOrder:1
          });
          console.log("Voy a guardar esta ordern",orderSave);
          orderSave.save((err, usuarioDB) => {
            //callback que trae error si no pudo grabar en la base de datos y usuarioDB si lo inserto
            if (err) {
              return err;
            }
            if(usuarioDB){
              return usuarioDB;
            }
          });
        }else{
          return "no se encontro el usuario";
        }
      });
    });
    //this.last = this.last + 1;
    // this.saveInFile(); //do a backup
    // let ticket = new Ticket(this.last, null);
    // this.tickets.push(ticket); //add to not attended array
    //return this.last;
  }







  getLastTicket() {
    return `Ticket ${this.last}`;
  }
  get4LastTicket() {
    return this.last4tickets;
  }
  takeTicket(barber) {
    if (this.tickets.length === 0) {
      return "No hay tickets";
    }
    let idTicket = this.tickets[0].id;
    this.tickets.shift(); //delete the first element of the array

    let takeTicket = new Ticket(idTicket, barber); //this is the order that will be take by a barber

    this.last4tickets.unshift(takeTicket); // insert in the first position of the array

    if (this.last4tickets.length > 4) {
      this.last4tickets = this.last4tickets.slice(0, 4); //delete the 4 element
    }

    console.log("Last 4 tickets");
    console.log(this.last4tickets);
    this.saveInFile(); //do a backup
    return takeTicket;
  }

  reloadCount() {
    this.last = 0;
    this.tickets = [];
    this.last4tickets = [];
    console.log("Se ha inicializado el sistema");
    this.saveInFile();
  }
  saveInFile() {
    let jsonData = {
      last: this.last,
      today: this.today,
      tickets: this.tickets,
      last4tickets: this.last4tickets
    };
    let jsonDataString = JSON.stringify(jsonData); //convert to string
    fs.writeFileSync("./server/data/data.json", jsonDataString);
  }
}

module.exports = {
  TicketControl
};
