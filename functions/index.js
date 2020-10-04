const functions = require('firebase-functions');
const admin = require('firebase-admin');



var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://o-pital.firebaseio.com"
});

const express = require('express');
const app = express();
const db = admin.firestore();

const cors = require('cors');
app.use(cors({origin:true}));

app.get('/hello-world',(req,res)=>{
    return res.status(200).send('Hello World!');
});

//Read the data of near_by_hospitals
app.get('/api/read/',(req,res)=>{
    (async()=>{
        try{
           let query = db.collection('hospitals_near_user');
           let response = [];
           var dist=1000;
           var seat=0;



           await query.get().then(querySnapshot=>{
               let docs = querySnapshot.docs;
               for(let doc of docs){
                   if(doc.data().distance<dist){
                       dist=doc.data().distance;
                   }
                   var tot_bed=doc.data().total_beds;
                   var bok_bed=doc.data().booked_beds;
                   var rem_seat= tot_bed-bok_bed;
                   if(rem_seat>seat){
                       seat=rem_seat;
                   }
               }
               
               for(let doc of docs){
                var selectedItem={};
                var tot_bed=doc.data().total_beds;
                   var bok_bed=doc.data().booked_beds;
                var rem_seat= tot_bed-bok_bed;
                if( doc.data().distance==dist){
                    selectedItem={
                       id: doc.id,
                       Location: doc.data().Location,
                       remaining_seats:rem_seat,
                       //rem:rem_seat,
                       distance:doc.data().distance
                   };
                }
                if(rem_seat==seat){
                    selectedItem={
                       id: doc.id,
                       Location: doc.data().Location,
                       remaining_seats:seat,
                       distance:doc.data().distance
                   };
                }
                // const selectedItem={
                //     id: doc.id,
                //     Location: doc.data().Location,
                //     total_beds:doc.data().total_beds,
                //     booked_beds:doc.data().booked_beds,
                //    distance:doc.data().distance
                
                   response.push(selectedItem);
               }
               return response;
           })
           return res.status(200).send(response);
        }catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.put('/api/update/:id',(req,res)=>{
    (async()=>{
        try{
            const document = db.collection('hospitals_near_me').doc(req.params.id);
            await document.update({
                booked_beds:req.body.booked_beds,
                booked_ambulance:req.body.booked_ambulance
            });
            return res.status(200).send();
        }catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

exports.app = functions.https.onRequest(app);