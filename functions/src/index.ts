import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

exports.getUsers = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const users = await admin.auth().listUsers();
  const email = ((req.query.email as string) ?? "").toLowerCase();
  res.json(
    users.users
      .filter((user) => user.email?.includes(email))
      .flatMap((user) => user.providerData)
  );
});

exports.cleanChats = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const chats = await admin.firestore().collection("chats").listDocuments();
  chats.forEach((chat) => chat.delete());
  const users = await admin.firestore().collection("users").listDocuments();
  const paths = users.map((user) => user.path + "/chats");
  paths.forEach(async (path) => {
    const chats = await admin.firestore().collection(path).listDocuments();
    chats.forEach((chat) => chat.delete());
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  res.json({ status: "ok" });
});

exports.createProfile = functions.auth.user().onCreate(async (user) => {
  console.log("user created", user);
  const doc = admin.firestore().doc(`users/${user.email}`);
  await doc.set({
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  });
});
