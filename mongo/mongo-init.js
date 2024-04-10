db = db.getSiblingDB('admin');

db.auth('root', 'root');

db = db.getSiblingDB('elevator');

db.createUser({
    user: 'elevator',
    pwd: 'elevator',
    roles: [
        {
            role: 'readWrite',
            db: 'elevator',
        },
    ],
});

db.createCollection('elevator');