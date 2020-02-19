const express = require('express');
const mongoose = require('mongoose')

const routes = require('./routes')

const app = express();


mongoose.connect('mongodb+srv://semana:semana@cluster0-43ss0.mongodb.net/omnistack10?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true
    }
);

app.use(express.json());
app.use(routes)
app.listen(3333)