import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

exports.createProfile = functions.auth.user().onCreate(async (user) => {
  console.log("user created", user);
  const doc = admin.firestore().doc(`users/${user.email}`);
  await doc.set({
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  });
});

exports.getParams = functions.https.onRequest(async (request, response) => {
  response.send(JSON.stringify(request.query));
});

exports.getDoc = functions.https.onRequest(async (request, response) => {
  const doc = admin.firestore().doc(`users/${request.query.email}`);
  const user = await doc.get();
  response.send(user.data());
});

exports.updateDoc = functions.https.onRequest(async (request, response) => {
  console.log(`users/${request.query.email}`, {
    displayName: request.query.displayName,
    photoURL: request.query.photoURL,
  });
  const doc = admin.firestore().doc(`users/${request.query.email}`);
  const user = await doc.set(
    {
      displayName: request.query.displayName,
      photoURL: request.query.photoURL,
    },
    { merge: true }
  );
  console.log(user)
  response.send(user);
});
