const express = require('express');
const Book = require('../db/book');
const Member = require('../db/member');
const moment = require('moment');

const router = express.Router();

const buildMongoQuery = (query) => {
    const mongoQuery = {};

    if (query.text) {
        mongoQuery.$text = { $search: query.text };
    }

    if (query.status == 1) { // checked out
        mongoQuery["checkedOut.0"] = { $exists: true };
    } else if (query.status == 2) { // overdue
        const oldestNonOverdue = moment().subtract(3, 'weeks');
        mongoQuery['checkedOut.date'] = { $lt: oldestNonOverdue };
    } else if (query.status == 3) { // available
        mongoQuery.availableCount = { $gt: 0 };
    }

    return mongoQuery;
};

// list
router.get('/', (req, res) => {
    const query = req.query;

    console.log('book query => ', query);

    Book.find(buildMongoQuery(query))
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

    Book.findById(req.params.id)
        .then(book => {
            if (!book) { throw 'No book'; }

            if (book.checkedOut.length) {
                throw 'Cannot delete a book that is currently checked out';
            }

            return Book.deleteOne({ _id: req.params.id })
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

    if (req.body.availableCount) {
        res.status(400).send('Cannot edit available count');
    }

    Book.findById(req.params.id)
        .then(book => {
            if (!book) { throw 'No book'; }

            if (req.body.instanceCount) {
                if (book.checkedOut.length >= req.body.instanceCount) {
                    throw 'More books than that are checked out. Cannot reduce instance count.';
                }
            }

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
