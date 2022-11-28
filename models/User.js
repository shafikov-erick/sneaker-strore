const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {type: String},
    email: {type: String, require: true, uniquie: true},
    password: {type: String, require: true},
    isAdmin: Boolean,
    ordersCurrent: [{type: Types.ObjectId, ref: 'Snaeker'}],
    ordersPast: [{type: Types.ObjectId, ref: 'Sneaker'}]
})

module.exports = model('User', schema);