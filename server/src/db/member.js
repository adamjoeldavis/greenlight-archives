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
    libraryCardNumber: Type.Number,
    active: { type: Type.Boolean, default: true },
    checkedOut: [{
        id: Type.ObjectId,
        title: Type.String,
        date: Type.Date
    }]
});

memberSchema.index({
    "name.first": "text",
    "name.last": "text",
    "emailAddress": "text",
    "phoneNumber": "text",
    "libraryCardNumber": "text"
});

memberSchema.methods.fullName = function() {
    return `${this.name.first} ${this.name.last}`;
}

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
