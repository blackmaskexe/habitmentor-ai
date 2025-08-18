import { Ionicons } from "@expo/vector-icons";

type IoniconName = keyof typeof Ionicons.glyphMap;

type HabitIconType = {
  keywords: string[];
  icon: IoniconName;
};

export const habitIconKeywords: HabitIconType[] = [
  // Exercise & Physical Activity
  {
    keywords: ["run", "jog", "sprint", "marathon", "running"],
    icon: "walk-outline",
  },
  {
    keywords: ["gym", "workout", "exercise", "training", "strength"],
    icon: "barbell-outline",
  },
  { keywords: ["swim", "pool", "water sport"], icon: "water-outline" },
  {
    keywords: ["bike", "cycle", "ride", "bicycle", "cycling"],
    icon: "bicycle-outline",
  },
  {
    keywords: ["yoga", "stretch", "flexibility", "poses"],
    icon: "body-outline",
  },
  {
    keywords: ["walk", "steps", "walking", "10000"],
    icon: "footsteps-outline",
  },
  {
    keywords: ["sport", "basketball", "football", "soccer"],
    icon: "basketball-outline",
  },

  // Mental Health & Mindfulness
  {
    keywords: ["meditate", "calm", "mindful", "breathing", "peace"],
    icon: "leaf-outline",
  },
  {
    keywords: ["gratitude", "thankful", "appreciate", "grateful"],
    icon: "heart-outline",
  },
  {
    keywords: ["journal", "diary", "write", "reflect", "thoughts"],
    icon: "book-outline",
  },
  {
    keywords: ["therapy", "counseling", "mental health"],
    icon: "happy-outline",
  },

  // Learning & Creativity
  {
    keywords: ["read", "book", "reading", "literature", "novel"],
    icon: "book-outline",
  },
  {
    keywords: ["study", "learn", "education", "course"],
    icon: "school-outline",
  },
  {
    keywords: ["code", "program", "develop", "software"],
    icon: "code-slash-outline",
  },
  {
    keywords: ["language", "spanish", "french", "duolingo"],
    icon: "language-outline",
  },
  {
    keywords: ["art", "draw", "paint", "sketch", "creative"],
    icon: "brush-outline",
  },
  {
    keywords: ["music", "practice", "instrument", "piano"],
    icon: "musical-notes-outline",
  },

  // Health & Wellness
  {
    keywords: ["sleep", "rest", "bed", "early", "bedtime"],
    icon: "bed-outline",
  },
  {
    keywords: ["eat", "diet", "nutrition", "food", "healthy"],
    icon: "nutrition-outline",
  },
  { keywords: ["drink", "water", "hydrate", "glasses"], icon: "water-outline" },
  {
    keywords: ["vitamins", "supplements", "medicine", "pills"],
    icon: "medkit-outline",
  },
  { keywords: ["fruits", "vegetables", "healthy food"], icon: "leaf-outline" },
  { keywords: ["no smoke", "quit smoking", "cigarette"], icon: "ban-outline" },

  // Productivity & Work
  { keywords: ["work", "office", "job", "career"], icon: "briefcase-outline" },
  {
    keywords: ["clean", "tidy", "organize", "declutter"],
    icon: "home-outline",
  },
  {
    keywords: ["plan", "schedule", "calendar", "agenda"],
    icon: "calendar-outline",
  },
  { keywords: ["email", "inbox", "zero", "mail"], icon: "mail-outline" },
  { keywords: ["focus", "pomodoro", "concentrate"], icon: "timer-outline" },

  // Social & Relationships
  { keywords: ["call", "phone", "contact", "family"], icon: "call-outline" },
  { keywords: ["meet", "friend", "social", "hangout"], icon: "people-outline" },
  { keywords: ["date", "relationship", "partner"], icon: "heart-outline" },

  // Finance & Personal Development
  { keywords: ["save", "money", "budget", "finance"], icon: "cash-outline" },
  {
    keywords: ["invest", "stocks", "trading", "market"],
    icon: "trending-up-outline",
  },
  { keywords: ["goal", "track", "habit", "progress"], icon: "trophy-outline" },

  // Hobbies & Leisure
  { keywords: ["hobby", "craft", "create", "make"], icon: "construct-outline" },
  {
    keywords: ["game", "play", "chess", "sports"],
    icon: "game-controller-outline",
  },
  {
    keywords: ["garden", "plant", "nature", "outdoor"],
    icon: "flower-outline",
  },
  {
    keywords: ["cook", "bake", "recipe", "kitchen"],
    icon: "restaurant-outline",
  },

  // Digital Wellbeing
  {
    keywords: ["screen", "phone", "digital", "less"],
    icon: "phone-portrait-outline",
  },
  { keywords: ["social media", "instagram", "facebook"], icon: "apps-outline" },

  // Spiritual & Personal
  {
    keywords: ["pray", "worship", "spiritual", "religious"],
    icon: "prism-outline",
  },
  { keywords: ["affirmation", "mantra", "positive"], icon: "sunny-outline" },
  { keywords: ["test"], icon: "walk-outline" },

  // Additional Exercise & Sports
  { keywords: ["tennis", "racket", "court", "serve"], icon: "ellipse-outline" },
  {
    keywords: ["golf", "putting", "driving range", "clubs"],
    icon: "flag-outline",
  },
  {
    keywords: ["dance", "choreography", "ballet", "hiphop"],
    icon: "walk-outline",
  },
  {
    keywords: ["martial arts", "karate", "judo", "taekwondo"],
    icon: "walk-outline",
  },
  {
    keywords: ["climbing", "bouldering", "rock climbing"],
    icon: "trail-sign-outline",
  },
  {
    keywords: ["boxing", "kickboxing", "sparring", "punch"],
    icon: "hand-left-outline",
  },
  {
    keywords: ["crossfit", "hiit", "interval", "intense"],
    icon: "barbell-outline",
  },
  {
    keywords: ["stretch", "flexibility", "mobility", "range"],
    icon: "body-outline",
  },

  // Advanced Mindfulness & Mental Health
  {
    keywords: ["breathwork", "pranayama", "breathing exercise"],
    icon: "leaf-outline",
  },
  {
    keywords: ["visualization", "imagine", "mental imagery"],
    icon: "eye-outline",
  },
  {
    keywords: ["therapy session", "counselor", "psychologist"],
    icon: "happy-outline",
  },
  {
    keywords: ["stress relief", "anxiety management", "calm"],
    icon: "leaf-outline",
  },
  {
    keywords: ["self care", "mental health day", "relax"],
    icon: "heart-outline",
  },
  {
    keywords: ["positive thinking", "optimism", "mindset"],
    icon: "sunny-outline",
  },
  {
    keywords: ["emotional awareness", "feelings", "mood"],
    icon: "happy-outline",
  },
  {
    keywords: ["mindful eating", "conscious eating"],
    icon: "nutrition-outline",
  },

  // Detailed Learning & Skills
  {
    keywords: ["online course", "udemy", "coursera", "mooc"],
    icon: "school-outline",
  },
  {
    keywords: ["podcast", "audiobook", "learning audio"],
    icon: "musical-notes-outline",
  },
  {
    keywords: ["ted talk", "educational video", "lecture"],
    icon: "videocam-outline",
  },
  {
    keywords: ["flash cards", "memorization", "study"],
    icon: "document-text-outline",
  },
  {
    keywords: ["speed reading", "comprehension", "reading"],
    icon: "book-outline",
  },
  {
    keywords: ["note taking", "cornell method", "notes"],
    icon: "create-outline",
  },
  {
    keywords: ["mind mapping", "brainstorming", "ideas"],
    icon: "git-branch-outline",
  },
  { keywords: ["research", "analysis", "study topic"], icon: "search-outline" },

  // Creative Pursuits
  {
    keywords: ["photography", "camera", "photo shoot"],
    icon: "camera-outline",
  },
  {
    keywords: ["video editing", "filmmaker", "youtube"],
    icon: "videocam-outline",
  },
  { keywords: ["pottery", "ceramics", "sculpting"], icon: "construct-outline" },
  { keywords: ["knitting", "crochet", "yarn work"], icon: "construct-outline" },
  { keywords: ["woodworking", "carpentry", "craft"], icon: "hammer-outline" },
  {
    keywords: ["writing", "blogging", "creative writing"],
    icon: "create-outline",
  },
  { keywords: ["poetry", "poem", "verse", "rhyme"], icon: "create-outline" },
  {
    keywords: ["graphic design", "illustration", "design"],
    icon: "brush-outline",
  },

  // Detailed Health & Nutrition
  {
    keywords: ["meal prep", "food planning", "cooking prep"],
    icon: "restaurant-outline",
  },
  {
    keywords: ["calorie tracking", "macro counting", "diet"],
    icon: "analytics-outline",
  },
  {
    keywords: ["intermittent fasting", "fasting window"],
    icon: "time-outline",
  },
  {
    keywords: ["protein intake", "supplements", "bcaa"],
    icon: "barbell-outline",
  },
  {
    keywords: ["vegetarian meal", "vegan food", "plant"],
    icon: "leaf-outline",
  },
  { keywords: ["smoothie", "juice", "blend", "shake"], icon: "water-outline" },
  { keywords: ["vitamin d", "supplements", "omega"], icon: "sunny-outline" },
  { keywords: ["sugar free", "no sugar", "sugar detox"], icon: "ban-outline" },

  // Productivity & Time Management
  {
    keywords: ["time blocking", "schedule block", "planning"],
    icon: "calendar-outline",
  },
  {
    keywords: ["deep work", "flow state", "focused work"],
    icon: "bulb-outline",
  },
  {
    keywords: ["eisenhower matrix", "priority", "urgent"],
    icon: "grid-outline",
  },
  {
    keywords: ["inbox zero", "email management", "clean"],
    icon: "mail-outline",
  },
  {
    keywords: ["gtd", "getting things done", "task"],
    icon: "checkmark-outline",
  },
  {
    keywords: ["meeting", "zoom call", "conference"],
    icon: "videocam-outline",
  },
  { keywords: ["deadline", "due date", "timeline"], icon: "alarm-outline" },
  {
    keywords: ["batch work", "batch tasks", "grouping"],
    icon: "layers-outline",
  },

  // Personal Finance
  {
    keywords: ["budget review", "expense tracking", "mint"],
    icon: "calculator-outline",
  },
  {
    keywords: ["stock review", "portfolio check", "invest"],
    icon: "stats-chart-outline",
  },
  {
    keywords: ["crypto", "bitcoin", "blockchain"],
    icon: "trending-up-outline",
  },
  {
    keywords: ["bill payment", "recurring bills", "pay"],
    icon: "card-outline",
  },
  {
    keywords: ["debt payoff", "loan payment", "mortgage"],
    icon: "cash-outline",
  },
  {
    keywords: ["tax prep", "accounting", "finances"],
    icon: "document-outline",
  },
  { keywords: ["retirement", "401k", "ira", "saving"], icon: "wallet-outline" },
  { keywords: ["side hustle", "passive income", "earn"], icon: "cash-outline" },

  // Home & Living
  { keywords: ["laundry", "washing", "clothes clean"], icon: "water-outline" },
  { keywords: ["dishes", "dishwasher", "kitchen clean"], icon: "home-outline" },
  { keywords: ["vacuum", "sweep", "mop", "floor clean"], icon: "home-outline" },
  { keywords: ["gardening", "plant care", "watering"], icon: "leaf-outline" },
  { keywords: ["declutter", "minimalism", "organize"], icon: "trash-outline" },
  { keywords: ["home repair", "maintenance", "fix"], icon: "hammer-outline" },
  { keywords: ["bed making", "room tidy", "bedroom"], icon: "bed-outline" },
  { keywords: ["meal planning", "grocery list", "food"], icon: "list-outline" },

  // Relationships & Social
  {
    keywords: ["family time", "quality time", "bonding"],
    icon: "people-outline",
  },
  {
    keywords: ["date night", "romantic time", "couple"],
    icon: "heart-outline",
  },
  { keywords: ["networking", "professional connect"], icon: "people-outline" },
  {
    keywords: ["parent time", "kids activity", "family"],
    icon: "people-outline",
  },
  {
    keywords: ["friend catchup", "friendship", "social"],
    icon: "people-outline",
  },
  {
    keywords: ["volunteer", "community service", "help"],
    icon: "heart-outline",
  },
  { keywords: ["mentoring", "coaching", "teaching"], icon: "person-outline" },
  { keywords: ["pet care", "dog walk", "animal"], icon: "paw-outline" },

  // Digital Wellbeing & Technology
  {
    keywords: ["digital detox", "screen break", "unplug"],
    icon: "phone-portrait-outline",
  },
  {
    keywords: ["password update", "security check"],
    icon: "lock-closed-outline",
  },
  {
    keywords: ["backup", "data sync", "cloud save"],
    icon: "cloud-upload-outline",
  },
  {
    keywords: ["device clean", "phone clean", "laptop"],
    icon: "laptop-outline",
  },
  {
    keywords: ["news reading", "current events", "news"],
    icon: "newspaper-outline",
  },
  { keywords: ["social media audit", "platform check"], icon: "apps-outline" },
  { keywords: ["email cleanup", "inbox manage"], icon: "mail-outline" },
  {
    keywords: ["app organization", "phone tidy"],
    icon: "phone-portrait-outline",
  },

  // Personal Growth
  { keywords: ["reflection", "self review", "journal"], icon: "book-outline" },
  {
    keywords: ["goal review", "milestone check", "goals"],
    icon: "flag-outline",
  },
  {
    keywords: ["habit tracking", "consistency check"],
    icon: "analytics-outline",
  },
  { keywords: ["morning routine", "morning ritual"], icon: "sunny-outline" },
  { keywords: ["evening routine", "night ritual"], icon: "moon-outline" },
  { keywords: ["weekly review", "plan review"], icon: "calendar-outline" },
  { keywords: ["monthly goals", "month review"], icon: "trophy-outline" },
  {
    keywords: ["skill practice", "deliberate practice"],
    icon: "build-outline",
  },
];

export function getHabitIcon(userHabitString: string) {
  const searchParameter = userHabitString.toLowerCase();
  for (const habitItem of habitIconKeywords) {
    // loop through the habitIconKeywords array,
    // if find a match, return immediately
    for (const habitKeyword of habitItem.keywords) {
      if (searchParameter.includes(habitKeyword)) {
        const habitIcon: IoniconName = habitItem.icon;
        return habitIcon;
      }
    }
  }
  return "checkmark"; // default to checkmark if did not find any matches
}
