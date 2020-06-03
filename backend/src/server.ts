import express, { response } from 'express';

const app = express();

app.use(express.json());

const users = [
    'Gabriel',
    'Pedro',
    'Carlos',
    'Lucas',
    'Luvas'
];

app.get('/users', (req, res) => {
    // Gambiarra pra evitar problemas com "search" ser um array
    const search = String(req.query.search);
    const filtered_users = search ? users.filter(user => user.includes(search)) : users;
    res.json(filtered_users);
});

app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    return res.json(users[id]);
})

app.post('/users', (req, res) => {
    const data = req.body;
    console.log(data);
    const user = {
        name: data.name,
        email: data.email
    };

    return res.json(user);

});

app.listen(3333);