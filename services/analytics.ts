
import { db } from './db.ts';

export const analytics = {
  track: (eventName: string, metadata: any = {}) => {
    console.debug(`[Analytics] Event: ${eventName}`, metadata);
    // Persist to database
    db.logEvent(eventName, metadata);
  }
};
