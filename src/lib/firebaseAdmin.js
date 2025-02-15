// import * as admin from "firebase-admin";
// import serviceAccount from "./serviceAccountKey.json"; // Ensure this file is in `lib/` and not exposed in GitHub

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// const verifyIdToken = async (token) => {
//   return await admin.auth().verifyIdToken(token);
// };

// export { verifyIdToken };

import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
      privateKeyId: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      clientId: process.env.FIREBASE_ADMIN_CLIENT_ID,
      authUri: process.env.FIREBASE_ADMIN_AUTH_URI,
      tokenUri: process.env.FIREBASE_ADMIN_TOKEN_URI,
      authProviderX509CertUrl:
        process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
      clientX509CertUrl: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
      universeDomain: process.env.FIREBASE_ADMIN_UNIVERSE_DOMAIN,
    }),
  });
}

const verifyIdToken = async (token) => {
  return await admin.auth().verifyIdToken(token);
};

export { verifyIdToken };
