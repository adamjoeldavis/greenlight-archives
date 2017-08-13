const mongoose = require('mongoose');
const Type = mongoose.Schema.Types;

const bookSchema = mongoose.Schema({
    title: Type.String,
    author: {
        name: {
            first: Type.String,
            last: Type.String
        }
    },
    publishDate: Type.Date,
    callNumber: Type.String,
    summary: Type.String,
    // TODO add image if time
    instanceCount: { type: Type.Number, default: 1 },
    checkedOut: [{
        date: Type.Date,
        by: {
            id: Type.ObjectId,
            name: Type.String
        }
    }]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
