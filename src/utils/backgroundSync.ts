import NetInfo from '@react-native-community/netinfo';
import { uploadPendingPosts } from '../services/postsService';

export const setupBackgroundSync = () => {
  // Listen for network status changes
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      uploadPendingPosts();
    }
  });
}; 