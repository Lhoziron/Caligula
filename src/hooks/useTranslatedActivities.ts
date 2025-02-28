import { useLanguageStore } from '../store/languageStore';
import { Activity } from '../types/activity';
import { getTranslatedActivity } from '../data/translations';

export function useTranslatedActivities() {
  const { language } = useLanguageStore();

  const translateActivity = (activity: Activity): Activity => {
    return getTranslatedActivity(activity, language as 'en' | 'fr');
  };

  const translateActivities = (activities: Activity[]): Activity[] => {
    return activities.map(translateActivity);
  };

  return {
    translateActivity,
    translateActivities
  };
}