export interface TripAlert {
  id: string;
  user_id: string;
  country?: string;
  date_from?: string;
  date_to?: string;
  organizer_id?: string;
  active: boolean;
  created: string;
  updated: string;
}

export interface TripAlertNotification {
  id: string;
  alert_id: string;
  offer_id: string;
  created: string;
}
