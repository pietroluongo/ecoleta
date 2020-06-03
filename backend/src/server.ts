import express from 'express';

const app = express();

app.get('/users', (req, res) => {
    console.log('teste');
    res.json([
        'Gabriel',
        'Pedro',
        'Carlos',
        'Lucas',
        'Corno'
    ]);
});

app.listen(3333);