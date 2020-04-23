const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

let query = '안녕';

// if (process.env.NODE_ENV === 'development') {
//   firebase.functions().useFunctionsEmulator('http://localhost:5001');
// }

// exports.addMessage = functions.https.onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into the Realtime Database using the Firebase Admin SDK.
//   const snapshot = await admin
//     .database()
//     .ref('/messages')
//     .push({ original: original });
//   // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//   res.redirect(303, snapshot.ref.toString());
// });

const firestoreDB = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

/*
const someMethod = functions.https.onRequest((req, res) => {
  var stuff = [];
  var db = admin.firestore();
  db.collection('comments')
    .doc('2Hbm4fR1KuByCR3cKsLi')
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        res.send('ㅇㄹㄴㄹ');
        var newelement = {
          id: doc.id,
          comment: doc.data().comment,

        };
        stuff = stuff.concat(newelement);
      });
      res.send(stuff);
      return '';
    })
    .catch((reason) => {
      res.send('ㅇㄹㄴ22ㄹ');
      res.send(reason);
    });
});

*/

const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

const express = require('express');
const cors = require('cors');
const app = express();

app.use(
  cors({
    origin: true,
  })
);

app.get('/', (req, res) => {
  var api_url = 'https://openapi.naver.com/v1/papago/detectLangs';
  var request = require('request');
  var options = {
    url: api_url,
    form: { query: query },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
      'X-Naver-Client-Id': '',
      'X-Naver-Client-Secret': '',
    },
  };
  request.post(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });

      res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});

const widgets = functions.https.onRequest(app);

exports.makeUppercase = functions.database
  .ref('/comments/{pushId}/{etag}/comment')
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.val();
    console.log('Uppercasing', context.params.pushId, original);
    let query = original;
    let lang = '';
    app.get('/', (req, res) => {
      var api_url = 'https://openapi.naver.com/v1/papago/detectLangs';
      var request = require('request');
      var options = {
        url: api_url,
        form: { query: query },
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':
            'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers':
            'X-Requested-With, content-type, Authorization',
          'X-Naver-Client-Id': '',
          'X-Naver-Client-Secret': '',
        },
      };
      request.post(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          lang = body.langCode;
        } else {
          console.log('error = ' + response.statusCode);
        }
      });
    });

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return snapshot.ref.parent.child('lang').set(lang);
  });

// module.exports = {
//   makeUppercase,
//   b,
// };
