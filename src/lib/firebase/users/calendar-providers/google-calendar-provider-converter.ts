import firebase from 'firebase/app';
import {CalendarProviderData} from './calendar-providers';
import DecoratedGoogleCalendarProviderData
  from './decorated-google-calendar-provider-data';

const googleCalendarProviderConverter: firebase
  .firestore
  .FirestoreDataConverter<DecoratedGoogleCalendarProviderData> = {
    toFirestore(
      decoratedData: DecoratedGoogleCalendarProviderData
    ): CalendarProviderData {
      return {
        accessToken: decoratedData.getAccessToken(),
        enabledCalendarIds: decoratedData.getEnabledCalendarIdsArray(),
      };
    },
    fromFirestore(
      snapshot: firebase.firestore.QueryDocumentSnapshot,
      options: firebase.firestore.SnapshotOptions
    ): DecoratedGoogleCalendarProviderData {
      const data = snapshot.data(options) as CalendarProviderData;
      return new DecoratedGoogleCalendarProviderData(data);
    }
  };

export default googleCalendarProviderConverter;
