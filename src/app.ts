import express, { Application } from "express";


const app: Application = express();

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hello World!, Welcome to Tour Management System Server'
    })
})

export default app;