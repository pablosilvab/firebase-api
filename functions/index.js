const functions = require("firebase-functions");
const admin = require('firebase-admin')
const express = require('express')
var serviceAccount = require("./config/serviceAccountKey.json");

const app = express()

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()


app.post('/api/products', async (req, res) => {
    try {
        const { body } = req;
        if (!body.name) {
            return res.status(400).send({
                status: 'Failed',
                data: { error: "One of the following keys is missing or is empty in request body: 'name'" }
            })
        }
        const product = {
            name: body.name
        }

        await db.collection('products').add(product)
        return res.status(201).send({
            status: 'OK',
            data: product
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            status: 'Failed',
            data: { error: 'Internal error' }
        })
    }
})

app.get('/api/products/:id', async (req, res) => {
    try {
        const { params: { id }, } = req;
        if (!id) {
            res.status(400).send({
                status: "Failed",
                data: { error: "Parameter ':id' can not be empty" },
            });
        }

        const doc = db.collection('products').doc(id)
        const item = await doc.get()

        if (!item.exists) {
            return res.status(404).send({
                status: 'OK',
                data: 'Not found'
            })
        }

        return res.status(200).send({
            status: 'OK',
            data: item.data()
        })


    } catch (err) {
        console.log(err)
        return res.status(500).send({
            status: 'Failed',
            data: { error: 'Internal error' }
        })
    }
})


app.get('/api/products', async (req, res) => {
    try {
        const query = db.collection('products')
        const querySnapshot = await query.get()
        const docs = querySnapshot.docs

        const items = docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
        }))

        return res.status(200).send({
            status: 'OK',
            data: items
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            status: 'Failed',
            data: { error: 'Internal error' }
        })
    }
})

app.put("/api/products/:id", async (req, res) => {
    try {
        const { params: { id }, } = req;
        if (!id) {
            res.status(400).send({
                status: "Failed",
                data: { error: "Parameter ':id' can not be empty" },
            });
        }

        const document = db.collection("products").doc(id);
        const item = await document.get()

        if (!item.exists) {
            return res.status(404).send({
                status: 'OK',
                data: 'Not found'
            })
        }

        await document.update({
            name: req.body.name,
        });

        const doc = db.collection('products').doc(id)
        const updatedItem = await doc.get()
        return res.status(200).send({
            status: 'OK',
            data: updatedItem.data()
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            status: 'Failed',
            data: { error: 'Internal error' }
        })
    }
});


exports.app = functions.https.onRequest(app);