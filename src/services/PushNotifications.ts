import { messaging } from './firebase';

export const requestPermission = async () => {
  try {
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log('FCM Token:', token);
    // Save the token to your database
  } catch (error) {
    console.error('Permission denied', error);
  }
};

messaging.onMessage(payload => {
  console.log('Message received:', payload);
  // Display notification
});
