const express = require('express');
const Member = require('../db/member');
const Book = require('../db/book');

const router = express.Router();

// list
router.get('/', (req, res) => {
    const query = req.body;

    console.log('member query => ', query);

    Member.find() // TODO hook in query
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

    Member.deleteOne({ _id: req.params.id })
        .then(() => {
            // TODO remove from checked out book lists
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

    Member.findById(req.params.id)
        .then(member => {
            if (!member) { throw 'No member'; }

            member.set(req.body);

            return member.save();
        })
        .then(member => {
            if (req.body.name) {
                // update member names elsewhere
                return Book.updateMany({ "checkedOut.by.id": member._id}, { "checkedOut.$.by.name": member.fullName() });
            }
        })
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
