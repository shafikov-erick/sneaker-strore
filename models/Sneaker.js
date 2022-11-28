const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {type: String, require: true, uniquie: true},
    barnd: {type: String, require: true},
    color: {type: String, require: true},
    sizes: {type: Object},
})

module.exports = model('Sneaker', schema);