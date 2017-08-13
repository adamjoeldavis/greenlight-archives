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
    summary: Type.String
    // TODO add image if time
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
