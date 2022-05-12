const mysql = require('serverless-mysql');

const db = mysql({
    config: {
       host: '185.141.107.191',
       user: 'rrr',
       password: '!Wemb5908bm64b56',
       database: 'fgostar',
    }
})

exports.query = async query => {
    try {
        const results = await db.query(query);
        await db.end();
        return results
    } catch (error) {
        return { 
            error
        }
    }
}