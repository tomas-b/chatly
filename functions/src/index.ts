import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

exports.getUsers = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const users = await admin.auth().listUsers();
  res.json(
    users.users
      .filter((user) => user.email?.includes(req.query.email as string))
      .flatMap((user) => user.providerData)
  );
});
