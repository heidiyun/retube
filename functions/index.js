const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Instantiates a client

// Run request

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

app.get('/', async (req, res) => {
  var api_url = 'https://openapi.naver.com/v1/papago/detectLangs';
  var request = require('request');

  var options = {
    url: api_url,
    form: { query: req.query.text },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
      'X-Naver-Client-Id': '',
      'X-Naver-Client-Secret': '',
    },
  };

  function post() {
    return new Promise((resolve, reject) => {
      request.post(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          resolve(body);
          // res.send(body);
        } else {
          reject(error);
          // console.log('error = ' + response.statusCode);
        }
      });
    });
  }

  const result = await post();

  res.send(result);
});

const detectLangs = functions.https.onRequest(app);

const registerLangs = functions.firestore
  .document('/comments/{etag}')
  .onCreate(async (snapshot, context) => {
    const text = snapshot.data().text;
    let langCode;
    try {
      const result = await axios.get(
          'https://us-central1-re-tube.cloudfunctions.net/detectLangs',
          {
            params: {
              text: text,
            },
          });
      langCode = result.data.langCode;
    } catch (e) {
      console.error('[Failed to detect language]', e);
    }
    
    try {
      await snapshot.ref.set({
          langCode : langCode,
          createdAt : new Date()
        });
    } catch (e) {
      console.error('Failed to save language code]', e);
    }
  // 호출 성공시 Functions가 로그를 남기므로 별도로 성공 로그 기록하지 않음.
  });

const makeUppercase = functions.database
  .ref('/comments/{pushId}/{etag}/comment')
  .onCreate(async (snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.val();
    console.log('Uppercasing', context.params.pushId, original);
    let query = original;

    const lang = await axios.get(
          'http://localhost:5001/re-tube-272909/us-central1/widgets',
          {
            params: {
              text: query,
            },
          }
        );

    // app.get('/', async (req, res) => {
    //   var api_url = 'https://openapi.naver.com/v1/papago/detectLangs';
    //   var request = require('request');
    //   var options = {
    //     url: api_url,
    //     form: { query: query },
    //     headers: {
    //       'Access-Control-Allow-Origin': '*',
    //       'Access-Control-Allow-Methods':
    //         'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    //       'Access-Control-Allow-Headers':
    //         'X-Requested-With, content-type, Authorization',
    //       'X-Naver-Client-Id': '',
    //       'X-Naver-Client-Secret': '',
    //     },
    //   };

    //   function post() {
    //     return new Promise((resolve, reject) => {
    //       request.post(options, (error, response, body) => {
    //         if (!error && response.statusCode === 200) {
    //           resolve(body);
    //           // res.send(body);
    //         } else {
    //           reject(error);
    //           // console.log('error = ' + response.statusCode);
    //         }
    //       });
    //     });
    //   }

    //   const result = await post();
    //   lang = result;
    // });
    while (lang !== '') {
      //dfsf
    }

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return snapshot.ref.parent.child('lang').set(lang);
  });

const app2 = express();

app2.use(
  cors({
    origin: true,
  })
);

// 'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
//       'Access-Control-Allow-Headers':
//         'X-Requested-With, content-type, Authorization',

app2.get('/', (req, res) => {
  var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
  var request = require('request');
  var options = {
    url: api_url,
    form: { source: req.query.source, target: 'ko', text: req.query.text },
    headers: {
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

const translate = functions.https.onRequest(app2);
const app3 = express();

app3.use(
  cors({
    origin: true,
  })
);

var corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// app3.get('/', cors(corsOptions), async (req, res) => {
//   const language = require('@google-cloud/language');

//   const client = new language.LanguageServiceClient();

//   const text = req.query.text;

//   const document = {
//     content: text,
//     type: 'PLAIN_TEXT',
//   };
//   const [result] = await client.analyzeSentiment({ document: document });
//   const sentiment = result.documentSentiment;

//   res.end(sentiment);
// });

// const naturalLanguage = functions.https.onRequest(app3);

const cors2 = require('cors');
const corsHandler = cors({ origin: true });

const getEntity = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const language = require('@google-cloud/language');
    const client = new language.LanguageServiceClient();
    const text = req.query.text;

    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };

    // Detects entities in the document
    const [result] = await client.analyzeEntities({ document });

    const entities = result.entities;
    const data = entities.map((entity) => {
      return {
        name: entity.name,
        type: entity.type,
      };
    });

    res.send(data);

    console.log('Entities:');
    entities.forEach((entity) => {
      console.log(entity.name);
      console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
      if (entity.metadata && entity.metadata.wikipedia_url) {
        console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}`);
      }
    });
  });
});

const naturalLanguage = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    const language = require('@google-cloud/language');

    const client = new language.LanguageServiceClient();

    const text = request.query.text;

    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };
    const [result] = await client.analyzeSentiment({ document: document });
    const sentiment = result.documentSentiment;

    let emotion = '';
    if (sentiment.score <= 1.0 && sentiment.score >= 0.25) {
      emotion = 'positive';
    } else if (sentiment.score >= -0.25 && sentiment.score <= 0.25) {
      emotion = 'neutral';
    } else {
      emotion = 'negative';
    }
    response.send(emotion);

    console.log(result);
    console.log(result.sentences);
    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
  });
});

module.exports = {
  detectLangs,
  registerLangs,
  translate,
  naturalLanguage,
  getEntity,
};
