import dotenv from dotenv;
dotenv.config();
import express from 'express';
import cors from 'cors';
import CookieParser from 'cookie-parser';
import { connectDb } from './utils/database';
import {app, server} from "./utils/srever.js"


const port = process.env.PORT;


app.use(express.json());
app.use(cors());
app.use(CookieParser());
app.use(express.urlencoded({ extended: true }));



server.listen(port, () => {
    connectDb();
    console.log(`Example app listening on port ${port}`)
})