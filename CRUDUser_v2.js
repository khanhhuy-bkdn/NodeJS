const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// CRUD users: Create, Read, Update, Delete
// Write file include array of user.
const users = [
    {
        id: 1,
        email: 'user1@gamil.com',
        password: 'abc123',
        gender: 'male'
    },
    {
        id: 2,
        email: 'user2@gamil.com',
        password: 'abc123',
        gender: 'male'
    }
];

function readFileSync(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                return reject(err);
            }
            const fileContent = JSON.parse(data);
            return resolve(fileContent);
        });
    });
}

function writeFileSync(filePath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}

checkExistUser = (id, users) => {
    for (const item of users) {
        if (item.id === id) {
            return false;
        }
    }
    return true;
}

getIndexUser = (users, id) => {
    let index = -1;
    users.map((item, key) => {
        if (item.id === id) {
            index = key;
        }
    });
    return index;
}

// Get one user api
app.get('/users/getById/:userId', async (req, res) => {
    try {
        const users = await readFileSync('users.txt');
        const userId = req.params.userId;
        const index = getIndexUser(users, parseInt(userId));
        if (index !== -1) {
            return res.status(200).json({ user: users[index] });
        }
        // for (const item of users) {
        //     if (item.id === parseInt(userId)) {
        //         return res.status(200).json({ user: item });
        //     }
        // }
        return res.status(400).json({ message: 'User is not found' });
    } catch (e) {
        return res.status(400).json({ message: 'Cannot read user file', error: e.message });
    }
});

// Create one user api
app.post('/users/post', async (req, res) => {
    try {
        const body = req.body;
        if (!body.id) {
            return res.status(400).json({ message: 'ID is the require field' });
        }
        if (!body.email) {
            return res.status(400).json({ message: 'Email is the require field' });
        }
        if (!body.password) {
            return res.status(400).json({ message: 'Password is the require field' });
        }
        const users = await readFileSync('users.txt');
        body.id = parseInt(body.id);
        if (!checkExistUser(body.id, users)) {
            return res.status(400).json({ message: 'User is exist!' });
        }
        users.push({
            id: body.id,
            email: body.email,
            password: body.password,
            gender: body.gender,
            createdAt: new Date()
        });
        await writeFileSync('users.txt', JSON.stringify(users, null, 2));
        return res.status(200).json({ message: 'Successful', user: body });
    } catch (e) {
        return res.status(400).json({ message: 'Cannot read user file', error: e.message });
    }
});

app.get('/users/write', async (req, res) => {
    try {
        await writeFileSync('users.txt', JSON.stringify(users, null, 2));
        return res.status(200).json({ message: 'Successful' });
    } catch (e) {
        return res.status(400).json({ message: 'Cannot write user file', error: e.message });
    }
});

app.get('/users/read', async (req, res) => {
    try {
        const data = await readFileSync('users.txt');
        return res.status(200).json({ message: 'Successful', data });
    } catch (e) {
        return res.status(400).json({ message: 'Cannot read user file', error: e.message });
    }
});

// Delete one user api
app.delete('/users/delete/:userId', async (req, res) => {
    try {
        const users = await readFileSync('users.txt');
        const userId = req.params.userId;
        const index = getIndexUser(users, parseInt(userId));
        if (index !== -1) {
            users.splice(index, 1);
            await writeFileSync('users.txt', JSON.stringify(users, null, 2));
            return res.status(200).json({ message: 'Delete success!' });
        }
        return res.status(400).json({ message: 'User is not found' });
    } catch (e) {
        return res.status(400).json({ message: 'Cannot read user file', error: e.message });
    }
});

// Update one user api
app.put('/users/update/:userId', async (req, res) => {
    try {
        const body = req.body;
        const users = await readFileSync('users.txt');
        const userId = req.params.userId;
        const index = getIndexUser(users, parseInt(userId));
        if (userId !== body.id) {
            return res.status(400).json({ message: 'Not update ID' });
        }
        if (!body.id) {
            return res.status(400).json({ message: 'ID is the require field' });
        }
        if (!body.email) {
            return res.status(400).json({ message: 'Email is the require field' });
        }
        if (!body.password) {
            return res.status(400).json({ message: 'Password is the require field' });
        }
        if (index !== -1) {
            users[index].email = body.email;
            users[index].password = body.password;
            users[index].gender = body.gender;
            await writeFileSync('users.txt', JSON.stringify(users, null, 2));
            return res.status(200).json({ message: 'Success!' });
        }
        return res.status(400).json({ message: 'User is not found' });
    } catch (e) {
        return res.status(400).json({ message: 'Cannot read user file', error: e.message });
    }
});

app.get('/users/search/:email', async (req, res) => {
    try {
        const users = await readFileSync('users.txt');
        const email = req.params.email;
        let results = [];
        for (const item of users) {
            if (item.email === email) {
                results.push(item);
            }
        }
        if (results.length > 0) {
            return res.status(200).json({ users: results });
        }
        return res.status(400).json({ message: 'User is not found' });
    } catch (e) {
        return res.status(400).json({ message: 'Cannot read user file', error: e.message });
    }
});

app.get('/users/search/regex/:name', async (req, res) => {
    try {
        const users = await readFileSync('users.txt');
        const email = req.params.name;
        let results = [];
        for (const item of users) {
            if (item.email.indexOf(email) !== -1) {
                results.push(item);
            }
        }
        if (results.length > 0) {
            return res.status(200).json({ users: results });
        }
        return res.status(400).json({ message: 'User is not found!' });
    } catch (e) {
        return res.status(400).json({ message: 'Cannot read user file', error: e.message });
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));