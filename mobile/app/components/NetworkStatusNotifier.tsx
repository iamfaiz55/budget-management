import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        Toast.show({
          type: 'success',
          text1: 'Back Online!',
          text2: 'You are now connected to the internet.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'You are offline!',
          text2: 'No internet connection detected.',
        });
      }
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return null;  // This component just listens to network changes and triggers toast messages
};

export default NetworkStatus;
