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
    availableCount: { type: Number, default: 1 },
    checkedOut: [{
        date: Type.Date,
        by: {
            id: Type.ObjectId,
            name: Type.String
        }
    }]
});

bookSchema.index({
    title: 'text',
    summary: 'text',
    'author.name.first': 'text',
    'author.name.last': 'text'
});

bookSchema.methods.computeAvailableCount = function() {
    this.availableCount = this.instanceCount - this.checkedOut.length;
}

// apply the available count before every save so it is always up to date
bookSchema.pre('save', function(next) {
    this.computeAvailableCount();

    next();
})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
