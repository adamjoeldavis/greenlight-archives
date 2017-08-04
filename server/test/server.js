import http from 'http';
import assert from 'assert';

import '../src/server.js';

describe('Index page', () => {
    it('should return 200', done => {
        http.get('http://localhost:4000', res => {
            assert.equal(200, res.statusCode);
            done();
        });
    })
});
