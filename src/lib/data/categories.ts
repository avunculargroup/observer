import type { Category, CategoryKey, Sign } from '@/lib/data/types';

function sign(id: string, category: CategoryKey, label: string, description: string, emoji: string): Sign {
  return { id, category, label, description, emoji };
}

export const CATEGORIES: Category[] = [
  {
    key: 'inattention',
    label: 'Inattention',
    icon: 'EarSlash',
    emoji: '👂',
    color: 'cat-inattention',
    signs: [
      sign('inattention_01', 'inattention', 'Seems not to listen', 'You call his name multiple times and he appears to be in his own world, even when there are no obvious distractions.', '👂'),
      sign('inattention_02', 'inattention', 'Multi-step instructions', 'Struggles to complete a sequence like "put on your shoes, grab your backpack, and meet me at the door."', '📚'),
      sign('inattention_03', 'inattention', 'Loses things constantly', 'Jackets, shoes, lunchboxes, toys, school papers — they go missing with remarkable regularity.', '🔍'),
      sign('inattention_04', 'inattention', 'Difficulty sustaining attention', 'Worksheets, homework, chores, or even board games become abandoned midway.', '🎯'),
      sign('inattention_05', 'inattention', 'Easily distracted', 'A bird outside the window, a distant sound — things other children would filter out pull his focus away instantly.', '💨'),
      sign('inattention_06', 'inattention', 'Trouble organising', 'Getting ready for school, packing a bag, or tidying up a room feels overwhelming.', '🧩'),
      sign('inattention_07', 'inattention', 'Careless mistakes', 'Skips questions, misreads instructions, writes answers in the wrong place.', '⚠️'),
      sign('inattention_08', 'inattention', 'Avoids sustained effort', 'Homework, reading assignments, or puzzles requiring concentration are met with strong resistance.', '🚫'),
      sign('inattention_09', 'inattention', 'Daydreams or zones out', 'Stares off into space during class or conversation. Appears "spacey" or lost in thought.', '💭'),
      sign('inattention_10', 'inattention', 'Forgets daily routines', 'Consistently forgets to brush teeth, put away dishes, or bring items to school.', '🔄'),
    ],
  },
  {
    key: 'hyperactivity',
    label: 'Hyperactivity',
    icon: 'Lightning',
    emoji: '⚡',
    color: 'cat-hyperactivity',
    signs: [
      sign('hyperactivity_01', 'hyperactivity', 'Constantly in motion', 'Running, jumping, climbing on furniture, bouncing while walking. Relentless physical energy.', '🏃'),
      sign('hyperactivity_02', 'hyperactivity', 'Fidgets and squirms', "Can't stay still at meals, during class, or at the doctor's office.", '🪑'),
      sign('hyperactivity_03', 'hyperactivity', 'Leaves seat unexpectedly', 'Gets up and wanders during class, during meals, during events.', '💺'),
      sign('hyperactivity_04', 'hyperactivity', 'Talks excessively', 'A continuous stream of chatter, narration, questions, and commentary.', '🔊'),
      sign('hyperactivity_05', 'hyperactivity', 'Driven by a motor', '"On the go" from the moment he wakes up until he crashes at bedtime. Very little idle time.', '🔋'),
      sign('hyperactivity_06', 'hyperactivity', 'Difficulty playing quietly', 'Every activity comes with sound effects, humming, tapping, or running commentary.', '🔇'),
      sign('hyperactivity_07', 'hyperactivity', 'Blurts out noises', 'Makes random sounds, hums, clicks, whistles — often unconsciously.', '🗣️'),
      sign('hyperactivity_08', 'hyperactivity', 'Climbs inappropriately', 'Scales bookshelves, stands on chairs, climbs countertops in unsafe situations.', '🧗'),
    ],
  },
  {
    key: 'impulsivity',
    label: 'Impulsivity',
    icon: 'Timer',
    emoji: '⏳',
    color: 'cat-impulsivity',
    signs: [
      sign('impulsivity_01', 'impulsivity', 'Blurts out answers', 'Shouts out responses before the question is complete. Cannot hold back even when reminded.', '✋'),
      sign('impulsivity_02', 'impulsivity', 'Difficulty waiting turn', 'Lines, board games, conversations — waiting is physically uncomfortable.', '⏳'),
      sign('impulsivity_03', 'impulsivity', 'Interrupts frequently', 'Cuts into conversations, talks over friends, inserts himself into activities uninvited.', '💬'),
      sign('impulsivity_04', 'impulsivity', 'Acts without thinking', 'Runs into the street, touches hot things, jumps from heights — action before thought.', '🎲'),
      sign('impulsivity_05', 'impulsivity', 'Grabs things from others', "Takes toys, food, or materials without asking. Doesn't register it's someone else's.", '💥'),
      sign('impulsivity_06', 'impulsivity', 'Difficulty stopping behaviour', "When told to stop, acknowledges but continues — as if the brakes don't work.", '🛑'),
      sign('impulsivity_07', 'impulsivity', 'Impulsive choices', 'Wants everything immediately. Struggles to delay gratification.', '💸'),
    ],
  },
  {
    key: 'emotional',
    label: 'Emotional',
    icon: 'Heartbeat',
    emoji: '🌊',
    color: 'cat-emotional',
    signs: [
      sign('emotional_01', 'emotional', 'Intense reactions', 'A small setback triggers an explosion of anger, crying, or screaming vastly out of proportion.', '🌋'),
      sign('emotional_02', 'emotional', 'Low frustration tolerance', 'Gives up quickly on slightly challenging tasks. Minor obstacles trigger full meltdowns.', '😞'),
      sign('emotional_03', 'emotional', 'Rapid mood shifts', 'Moves from delighted to furious to giggling within minutes, often with no clear trigger.', '🎢'),
      sign('emotional_04', 'emotional', 'Difficulty calming down', 'Once the emotional storm starts, it takes a long time to pass. Standard techniques may not work.', '😭'),
      sign('emotional_05', 'emotional', 'Takes criticism hard', 'Even gentle redirection feels like a devastating blow. May cry, shut down, or lash out.', '💔'),
      sign('emotional_06', 'emotional', 'Struggles with emotions', 'May not name what he is feeling, or misreads social situations and emotional cues.', '🤔'),
      sign('emotional_07', 'emotional', 'Strong sense of injustice', 'Becomes extremely upset when things feel "unfair," even when the situation is reasonable.', '💪'),
    ],
  },
  {
    key: 'social',
    label: 'Social',
    icon: 'UsersThree',
    emoji: '👥',
    color: 'cat-social',
    signs: [
      sign('social_01', 'social', 'Difficulty with friendships', 'Other children may avoid playing with him due to intensity, bossiness, or inability to share.', '👥'),
      sign('social_02', 'social', 'Dominates group play', "Insists on being the leader, changes rules mid-game, or quits when things don't go his way.", '🎮'),
      sign('social_03', 'social', 'Misses social cues', "Stands too close, talks too loudly, doesn't notice when a friend wants to stop playing.", '👋'),
      sign('social_04', 'social', 'Plays too rough', "Hugs too hard, pushes when excited, tackles during tag. Doesn't intend to hurt anyone.", '💢'),
      sign('social_05', 'social', 'Seems immature for age', 'Emotional and social behaviour seems younger. May gravitate toward playing with younger kids.', '😟'),
      sign('social_06', 'social', 'Struggles with losing', 'Not being first or winning triggers intense distress. Sportsmanship is a real challenge.', '🏆'),
    ],
  },
  {
    key: 'school',
    label: 'School',
    icon: 'GraduationCap',
    emoji: '🏫',
    color: 'cat-school',
    signs: [
      sign('school_01', 'school', 'Inconsistent performance', "Brilliant one day, unfocused the next. Teachers say he's smart but won't apply himself.", '📝'),
      sign('school_02', 'school', 'Disorganised workspace', 'Papers crumpled, broken pencils, missing supplies. Organisation is a consistent struggle.', '🗂️'),
      sign('school_03', 'school', 'Difficulty with transitions', 'Moving between activities creates resistance or disruptive behaviour.', '🚧'),
      sign('school_04', 'school', 'Incomplete classwork', "Still on the first questions while others finish — not too hard, but focus drifted.", '📋'),
      sign('school_05', 'school', 'Frequent behaviour reports', 'Notes home, calls, conferences focused on behaviour rather than academics.', '🏫'),
      sign('school_06', 'school', 'Disrupts the class', "Shouts answers, makes jokes, gets out of seat. Not defiant — just can't contain the impulse.", '🙋'),
      sign('school_07', 'school', 'Avoids writing tasks', 'Fine motor control and sustained focus combine to make writing especially frustrating.', '✍️'),
    ],
  },
  {
    key: 'lessObvious',
    label: 'Less Obvious',
    icon: 'PuzzlePiece',
    emoji: '🧩',
    color: 'cat-lessObvious',
    signs: [
      sign('lessObvious_01', 'lessObvious', 'Sleep difficulty', "Brain doesn't have an off switch at bedtime. May take an hour or more to fall asleep.", '🌙'),
      sign('lessObvious_02', 'lessObvious', 'Hyper-focuses on preferred', "Can spend hours on Legos or video games but can't focus five minutes on homework.", '🎮'),
      sign('lessObvious_03', 'lessObvious', 'Accident-prone', 'Bumps into things, falls off chairs, trips over own feet. More injuries than peers.', '🩹'),
      sign('lessObvious_04', 'lessObvious', 'Picky or fast eating', 'Eats impulsively (too fast, too much) or is extremely selective. Mealtimes are tough.', '🍽️'),
      sign('lessObvious_05', 'lessObvious', 'Sensory sensitivities', 'Certain fabrics, tags, loud noises, or bright lights may be intolerable.', '💧'),
      sign('lessObvious_06', 'lessObvious', 'Poor sense of time', 'Five minutes and an hour feel the same. No internal sense of urgency about time.', '⏱️'),
      sign('lessObvious_07', 'lessObvious', 'Excessive noise-making', 'Constant low-level humming, tapping, clicking — often without being aware of it.', '🎤'),
      sign('lessObvious_08', 'lessObvious', 'Extraordinary creativity', 'Wild imagination, inventive play, and ability to think outside the box.', '💡'),
      sign('lessObvious_09', 'lessObvious', 'Deep empathy', "Despite outbursts, deeply caring and perceptive about others' feelings.", '❤️'),
      sign('lessObvious_10', 'lessObvious', 'Seeks intense stimulation', 'Gravitates toward fast-paced, high-stimulation activities. Calm environments are unbearable.', '🧲'),
    ],
  },
];

export const CATEGORIES_MAP: Record<CategoryKey, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c])
) as Record<CategoryKey, Category>;

export function getCategoryByKey(key: CategoryKey): Category {
  return CATEGORIES_MAP[key];
}

export function getSignById(signId: string): Sign | undefined {
  for (const category of CATEGORIES) {
    const found = category.signs.find((s) => s.id === signId);
    if (found) return found;
  }
  return undefined;
}
