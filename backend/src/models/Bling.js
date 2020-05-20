const mongoose = require('mongoose');

const BlingSchema = new mongoose.Schema({
    codigo: String,
    descricao: String,
    estoqueAtual: Number,
    preco: Number,
    class_fiscal: String,
    gtin: String,
    gtinEmbalagem: String,
    store: String
});

module.exports = mongoose.model('Bling', BlingSchema);