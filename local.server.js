// local.server.js
require('dotenv').config();             // loads .env from project root

const path = require('path');
const express = require('express');
const emailRoutes = require('./email'); // <- import the email router

const app = express();
const PORT = process.env.PORT || 3000;
