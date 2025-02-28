import { Platform } from 'react-native';
import { Activity } from '../types/activity';
import WebMap from './ActivityMap.web';
import NativeMap from './ActivityMap.native';

interface ActivityMapProps {
  activities: Activity[];
  onClose: () => void;
}

export default function ActivityMap(props: ActivityMapProps) {
  if (Platform.OS === 'web') {
    return <WebMap {...props} />;
  }
  return <NativeMap {...props} />;
}