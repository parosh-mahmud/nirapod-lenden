import * as admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json"; // Ensure this file is in `lib/` and not exposed in GitHub

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const verifyIdToken = async (token) => {
  return await admin.auth().verifyIdToken(token);
};

export { verifyIdToken };
