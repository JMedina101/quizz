export interface Activity {
  activity_name: string;
  order: number;
  questions: Question[];
}

export interface Question {
  is_correct: boolean;
  stimulus: string;
  order: number;
  user_answers: string[];
  feedback: string;
  questions?: Question[];
  round_title?: string;
}

export interface Round {
  round_title: string;
  order: number;
  questions: Question[];
}

export interface GameData {
  name: string;
  heading: string;
  activities: (Activity | Round)[];
}
