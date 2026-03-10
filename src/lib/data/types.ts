export type CategoryKey =
  | 'inattention'
  | 'hyperactivity'
  | 'impulsivity'
  | 'emotional'
  | 'social'
  | 'school'
  | 'lessObvious';

export type ObservationSource = 'quick_log' | 'journal';

export type ObservationContext = 'home' | 'school' | 'social' | 'bedtime' | 'morning' | 'other';

export type Intensity = 1 | 2 | 3;

export type Mood = 1 | 2 | 3 | 4 | 5;

export interface Sign {
  id: string;
  category: CategoryKey;
  label: string;
  description: string;
  emoji: string;
}

export interface Category {
  key: CategoryKey;
  label: string;
  signs: Sign[];
  color: string;
  icon: string;
  emoji: string;
}

export interface Observation {
  id: string;
  user_id: string;
  source: ObservationSource;
  journal_id: string | null;
  category: CategoryKey;
  sign_id: string;
  sign_label: string;
  intensity: Intensity;
  note: string | null;
  context: ObservationContext | null;
  observed_at: string;
  created_at: string;
  synced: boolean;
  profile?: Profile;
}

export interface Journal {
  id: string;
  user_id: string;
  journal_date: string;
  overall_mood: Mood | null;
  reflection: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  display_name: string;
  email?: string;
  reminder_time: string | null;
  push_subscription: unknown | null;
  created_at: string;
}
