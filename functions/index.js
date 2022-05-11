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
            .add({ name: req.body.name })
        return res.status(204).json()
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Internal error' })
    }
})

app.get('/api/books/:id', async (req, res) => {
    try {
        const doc = db.collection('books').doc(req.params.id)
        const item = await doc.get()
        return res.status(200).json(item.data())
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Internal error' })
    }
})


app.get('/api/books', async (req, res) => {
    try {
        const query = db.collection('books')
        const querySnapshot = await query.get()
        const docs = querySnapshot.docs

        const items = docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
        }))

        return res.status(200).json(items)
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Internal error' })
    }
})


exports.app = functions.https.onRequest(app);