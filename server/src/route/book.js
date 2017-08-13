const express = require('express');
const Book = require('../db/book');
const Member = require('../db/member');

const router = express.Router();

// list
router.get('/', (req, res) => {
    const query = req.body;

    console.log('book query => ', query);

    Book.find() // TODO hook in query
        .then(books => {
            res.send(books);
        })
        .catch(err => {
            res.status(404).send(err);
        });
});

// get
router.get('/:id', (req, res) => {
    console.log('loading book => ', req.params.id);

    Book.findById(req.params.id)
        .then(book => {
            if (!book) { throw 'No book'; }

            res.send(book);
        })
        .catch(err => res.status(404).send(err));
});

// remove
router.delete('/:id', (req, res) => {
    console.log('deleting book => ', req.params.id);

    Book.deleteOne({ _id: req.params.id })
        .then(() => {
            // TODO clear up refs in checked out books if they exist
        })
        .then(() => res.status(204).send())
        .catch(err => res.status(404).send(err));
});

// update
router.patch('/:id', (req, res) => {
    console.log('updating book => ', req.params.id);

    // make sure we aren't trying to update checkout information
    if (req.body.checkedOut) {
        res.status(400).send('Cannot edit check out information in this fashion');
        return;
    }

    Book.findById(req.params.id)
        .then(book => {
            if (!book) { throw 'No book'; }

            book.set(req.body);

            return book.save();
        })
        .then(book => {
            if (req.body.title) {
                // update books elsewhere
                return Member.updateMany({ "checkedOut.id": book._id }, { "checkedOut.$.title": book.title });
            }
        })
        .then(() => res.status(204).send())
        .catch(err => res.status(400).send(err));
});

// add
router.post('/', (req, res) => {
    if (req.body.checkedOut) {
        res.status(400).send('Cannot edit check out information in this fashion');
        return;
    }

    const newBook = new Book(req.body);

    newBook.save()
        .then(book => res.send(book))
        .catch(err => res.status(400).send(err));
});

module.exports = router;
