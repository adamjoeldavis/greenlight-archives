const mongoose = require('mongoose');
const Type = mongoose.Schema.Types;

const memberSchema = mongoose.Schema({
    name: {
        first: Type.String,
        last: Type.String
    },
    emailAddress: Type.String,
    phoneNumber: Type.String,
    address: {
        one: Type.String,
        two: Type.String,
        city: Type.String,
        state: Type.String,
        postalCode: Type.Number
    },
    libraryCardNumber: Type.Number
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
