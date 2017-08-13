const express = require('express');
const Book = require('../db/book');
const Member = require('../db/member');

const router = express.Router();

// add
router.post('/:bookId/:memberId', (req, res) => {
    console.log(`checkout out book [${req.params.bookId}] to member [${req.params.memberId}]`);

    const checkOutDate = new Date();
    let book;
    let member;
    Book.findById(req.params.bookId)
        .then(_book => {
            if (!_book) { throw 'No book'; }

            book = _book;

            if (book.instanceCount === book.checkedOut.length) {
                throw 'All instances checked out';
            }

            return Member.findById(req.params.memberId);
        })
        .then(_member => {
            if (!_member) { throw 'No member'; }

            member = _member;

            if (member.checkedOut.some(entry => entry.id === book._id)) {
                throw 'Book already checked out by member';
            }

            member.checkedOut.push({
                id: book._id,
                date: checkOutDate,
                title: book.title
            });

            return member.save();
        })
        .then(() => {
            book.checkedOut.push({
                date: checkOutDate,
                by: {
                    id: member._id,
                    name: member.fullName()
                }
            });

            return book.save();
        })
        .then(() => res.status(204).send())
        .catch(err => res.status(400).send(err));
})

// delete
router.delete('/:bookId/:memberId', (req, res) => {
    console.log(`Removing checkout information on book [${req.params.bookId}] for member [${req.params.memberId}]`);

    let book;
    let member;
    Book.findById(req.params.bookId)
        .then(_book => {
            if (!_book) { throw 'No book'; }

            book = _book;

            return Member.findById(req.params.memberId);
        })
        .then(_member => {
            if (!_member) { throw 'No member'; }

            member = _member;

            member.checkedOut = member.checkedOut.filter(element => element.id !== book._id);

            return member.save();
        })
        .then(() => {
            book.checkedOut = book.checkedOut.filter(element => element.by.id !== member._id);

            return book.save();
        })
        .then(() => res.status(204).send())
        .catch(err => res.status(400).send(err));
});

module.exports = router;
