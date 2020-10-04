const functions = require('firebase-functions');
const admin = require('firebase-admin');



var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://o-pital.firebaseio.com"
});

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({origin:true}));

app.get('/hello-world',(req,res)=>{
    return res.status(200).send('Hello World!');
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.app = functions.https.onRequest(app);