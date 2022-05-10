const functions = require("firebase-functions");
const admin = require('firebase-admin')
const express = require('express')
var serviceAccount = require("./config/serviceAccountKey.json");

const app = express()

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.get('/hello', (req, res) => {
    return res.status(200).json({message: 'Hello World!'})
})

exports.app = functions.https.onRequest(app);