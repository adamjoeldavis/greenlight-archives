const express = require('express');
const Member = require('../db/member');
const Book = require('../db/book');

const router = express.Router();

const buildMongoQuery = (query) => {
    const mongoQuery = {};

    if (query.text) {
        mongoQuery.$text = { $search: query.text };
    }

    if (query.status == 1) { // current
        mongoQuery.active = true;
    } else if (query.status == 2) { // overdue
        const oldestNonOverdue = moment().subtract(3, 'weeks');
        mongoQuery['checkedOut.date'] = { $lt: oldestNonOverdue };
    }
    
    return mongoQuery;
}

// list
router.get('/', (req, res) => {
    const query = req.query;

    console.log('member query => ', query);

    Member.find(buildMongoQuery(query))
        .then(members => res.send(members))
        .catch(err => res.status(400).send(err));
});

// get
router.get('/:id', (req, res) => {
    console.log('Getting member => ', req.params.id);

    Member.findById(req.params.id)
        .then(member => {
            if (!member) { throw 'No member'; }

            res.send(member);
        })
        .catch(err => res.status(404).send(err));
});

// remove
router.delete('/:id', (req, res) => {
    console.log('Deleting member => ', req.params.id);

    Member.findById(req.params.id)
        .then(member => {
            if (!member) { throw 'No member'; }

            if (member.checkedOut.length) {
                throw 'Cannot delete a member that currently has books checked out';
            }

            return Member.deleteOne({ _id: req.params.id })
        })
        .then(() => res.status(204).send())
        .catch(err => res.status(404).send());
});

// update
router.patch('/:id', (req, res) => {
    console.log('updating member => ', req.params.id);

    // make sure we aren't trying to update checkout information
    if (req.body.checkedOut) {
        res.status(400).send('Cannot edit check out information in this fashion');
        return;
    }

    if (req.body.libraryCardNumber) {
        res.status(400).send('Library card number cannot be changed');
        return;
    }

    Member.findById(req.params.id)
        .then(member => {
            if (!member) { throw 'No member'; }

            if (req.body.active != undefined && !req.body.active && member.checkedOut.length > 0) {
                throw 'Cannot deactivate a member with checked out books';
            }

            member.set(req.body);

            return member.save();
        })
        .then(member => {
            if (req.body.name) {
                // update member names elsewhere
                return Book.updateMany({ "checkedOut.by.id": member._id}, { "checkedOut.$.by.name": member.fullName() });
            }
        })
        .then(() => res.status(204).send())
        .catch(err => res.status(404).send());
});

// add
router.post('/', (req, res) => {
    if (req.body.checkedOut) {
        res.status(400).send('Cannot edit check out information in this fashion');
        return;
    }

    const newMember = new Member(req.body);

    newMember.save()
        .then(member => res.send(member))
        .catch(err => res.status(400).send(err));
});

module.exports = router;
