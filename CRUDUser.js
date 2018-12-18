const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
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

// Get one user api
app.get('/users/getById/:userId', async (req, res) => {
    try {
        const users = await readFileSync('users.txt');
        const userId = req.params.userId;
        for (const item of users) {
            if (item.id === parseInt(userId)) {
                return res.status(200).json({ user: item });
            }
        }
        return res.status(400).json({ message: 'User is not found' });
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


// Update one user api

// Create one user api

// Delete one user api

// put, post, delete, patch ... Restful API.

// 

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
