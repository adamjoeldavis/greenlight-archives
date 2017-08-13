const mongoose = require('mongoose');

const initialize = () => {
    mongoose.Promise = global.Promise; // use global promises

    mongoose.connect('mongodb://localhost/greenlight-archive');
};

module.exports = {
    initialize
};
