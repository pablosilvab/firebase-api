const functions = require("firebase-functions");
const admin = require('firebase-admin')
const express = require('express')
var serviceAccount = require("./config/serviceAccountKey.json");

const app = express()

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

app.get('/hello', (req, res) => {
    return res.status(200).json({ message: 'Hello World!' })
})

app.post('/api/books', async (req, res) => {
    try {
        await db.collection('books')
            .doc('/' + req.body.id + '/')
            .create({ name: req.body.name })
        return res.status(204).json()
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
})

exports.app = functions.https.onRequest(app);