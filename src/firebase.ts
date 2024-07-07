import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';
   import { getAuth } from 'firebase/auth';

   const firebaseConfig = {
  	apiKey: "AIzaSyAEj_f8RbZ3HOgoFwmDVGt41ACaRfygsUY",
  	authDomain: "fd-order-app.firebaseapp.com",
  	projectId: "fd-order-app",
  	storageBucket: "fd-order-app.appspot.com",
  	messagingSenderId: "368189875069",
  	appId: "1:368189875069:web:c7d3c46bba16dbf7082214",
  	measurementId: "G-TVE5BNLJ63"
	};

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   export const auth = getAuth(app);
   
