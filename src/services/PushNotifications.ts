import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from '../firebase';

const messaging = getMessaging(app);

export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey: 'BNIR9YBFrx6_yCAK0f3lBxF3vYlEFSu61iBQ6lueRlsHWPW13pPdNhwx2OPzbG08NgwAyxuVfVxBHUzf3_KEhko' });
      console.log('FCM Token:', token);
      // Save the token to your database
      return token;
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while requesting permission', error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      resolve(payload);
    });
  });