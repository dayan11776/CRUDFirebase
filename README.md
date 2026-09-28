<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/fb1e5b30-4152-4ebd-ad5b-c0974377e277

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Firebase

Contacts are stored in the Firestore `contacts` collection. The Firebase web app configuration is in `src/data/firebase.ts`; create a Cloud Firestore database for that Firebase project and configure its security rules to allow this app to read and write.

This app does not include Firebase Authentication. Do not use publicly writable rules with real contact data; add authentication and restrictive rules before deployment. Contacts are read from Firestore and new or edited records are written there. On first connection, saved contacts in this browser's legacy local storage are copied to Firestore if the collection is empty. Otherwise, an empty Firestore collection starts with no contacts.
