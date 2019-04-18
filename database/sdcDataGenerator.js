const faker = require('faker');

const MongoClient = require('mongoDb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'newTestDb';


 
let userCount = 1;
let apartmentCount = 1;

console.log(new Date);

// helper functions for creating documents

let createUsers = function() {
    let documentsArray = [];
    for (var i = 0; i < 1000; i++) {
        documentsArray.push({
            id: userCount,
            name: faker.name.findName(),
            avatar: faker.internet.avatar()
        })
        userCount += 1;
    }
    return documentsArray;
}

let createApartments = function() {
    let documentsArray = [];
    for (var i = 0; i < 1000; i++) {
        documentsArray.push({
            id: apartmentCount,
            address: faker.address.streetAddress(),
            owned_by_user_id: Math.floor(Math.random()*10000000)
        })
        apartmentCount += 1;
    }
    return documentsArray;
}

let createReviews = function() {
    let documentsArray = [];
    for (var i = 0; i < 1000; i++) {
        documentsArray.push({
            date: faker.date.month() + ' ' + faker.random.number({ min: 2015, max: 2019}),
            text: faker.lorem.sentences(Math.ceil(Math.random() * 6)),
            rating: Math.floor((() => Math.random() * 5)()) + .5,
            user_id: faker.random.number({
                min: 1,
                max: 10000000
              }),
            apartment_id: faker.random.number({
                min: 1,
                max: 10000000
              }),
            has_response: Math.random() > .66,
            owner_response: faker.lorem.sentences(Math.ceil(Math.random() * 4))
        })
    }
    return documentsArray;
}



// Connect to the server, insert documents using recursion
MongoClient.connect(url)
    .then(client => {
        let db = client.db(dbName);
        let usersBatchCount = 0;
        let reviewsBatchCount = 0;
        let apartmentsBatchCount = 0;
        

        let addUsers = function() {
            if (usersBatchCount < 30000) {
                usersBatchCount += 1;
                let userDocs = createUsers();
                db.collection('users').insertMany(userDocs, (err, res) => {
                    console.log(usersBatchCount);
                    addUsers()
                })
            } else {
                addReviews();
            }
        }

        let addReviews = function() {
            if (reviewsBatchCount < 30000) {
                reviewsBatchCount += 1;
                let reviewDocs = createReviews();
                db.collection('reviews').insertMany(reviewDocs, (err, res) => {
                    console.log(reviewsBatchCount);
                    addReviews()
                })
            } else {
                addApartments();
            }
        }

        let addApartments = function() {
            if (apartmentsBatchCount < 10000) {
                apartmentsBatchCount += 1;
                let apartmentDocs = createApartments();
                db.collection('apartments').insertMany(apartmentDocs, (err, res) => {
                    console.log(apartmentsBatchCount);
                    addApartments()
                })
            } else {
                console.log('all documents seeded');
            }
        }


        addUsers();
    })

    .catch(err => console.log(err))