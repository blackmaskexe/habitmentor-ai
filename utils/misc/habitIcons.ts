import { Ionicons } from "@expo/vector-icons";

type IoniconName = keyof typeof Ionicons.glyphMap;

type HabitIconType = {
  keywords: string[];
  icon: IoniconName;
};

export const habitIconKeywords: HabitIconType[] = [
  // Exercise & Physical Activity
  { keywords: ["run", "jog", "sprint", "marathon", "running"], icon: "walk" },
  {
    keywords: ["gym", "workout", "exercise", "training", "strength"],
    icon: "barbell",
  },
  { keywords: ["swim", "pool", "water sport"], icon: "water" },
  {
    keywords: ["bike", "cycle", "ride", "bicycle", "cycling"],
    icon: "bicycle",
  },
  { keywords: ["yoga", "stretch", "flexibility", "poses"], icon: "body" },
  { keywords: ["walk", "steps", "walking", "10000"], icon: "footsteps" },
  {
    keywords: ["sport", "basketball", "football", "soccer"],
    icon: "basketball",
  },

  // Mental Health & Mindfulness
  {
    keywords: ["meditate", "calm", "mindful", "breathing", "peace"],
    icon: "leaf",
  },
  {
    keywords: ["gratitude", "thankful", "appreciate", "grateful"],
    icon: "heart",
  },
  {
    keywords: ["journal", "diary", "write", "reflect", "thoughts"],
    icon: "book",
  },
  { keywords: ["therapy", "counseling", "mental health"], icon: "happy" },

  // Learning & Creativity
  {
    keywords: ["read", "book", "reading", "literature", "novel"],
    icon: "book",
  },
  { keywords: ["study", "learn", "education", "course"], icon: "school" },
  { keywords: ["code", "program", "develop", "software"], icon: "code-slash" },
  { keywords: ["language", "spanish", "french", "duolingo"], icon: "language" },
  { keywords: ["art", "draw", "paint", "sketch", "creative"], icon: "brush" },
  {
    keywords: ["music", "practice", "instrument", "piano"],
    icon: "musical-notes",
  },

  // Health & Wellness
  { keywords: ["sleep", "rest", "bed", "early", "bedtime"], icon: "bed" },
  {
    keywords: ["eat", "diet", "nutrition", "food", "healthy"],
    icon: "nutrition",
  },
  { keywords: ["drink", "water", "hydrate", "glasses"], icon: "water" },
  {
    keywords: ["vitamins", "supplements", "medicine", "pills"],
    icon: "medkit",
  },
  { keywords: ["fruits", "vegetables", "healthy food"], icon: "leaf" },
  { keywords: ["no smoke", "quit smoking", "cigarette"], icon: "ban" },

  // Productivity & Work
  { keywords: ["work", "office", "job", "career"], icon: "briefcase" },
  { keywords: ["clean", "tidy", "organize", "declutter"], icon: "home" },
  { keywords: ["plan", "schedule", "calendar", "agenda"], icon: "calendar" },
  { keywords: ["email", "inbox", "zero", "mail"], icon: "mail" },
  { keywords: ["focus", "pomodoro", "concentrate"], icon: "alarm" },

  // Social & Relationships
  { keywords: ["call", "phone", "contact", "family"], icon: "call" },
  { keywords: ["meet", "friend", "social", "hangout"], icon: "people" },
  { keywords: ["date", "relationship", "partner"], icon: "heart" },

  // Finance & Personal Development
  { keywords: ["save", "money", "budget", "finance"], icon: "cash" },
  { keywords: ["invest", "stocks", "trading", "market"], icon: "trending-up" },
  { keywords: ["goal", "track", "habit", "progress"], icon: "trophy" },

  // Hobbies & Leisure
  { keywords: ["hobby", "craft", "create", "make"], icon: "construct" },
  {
    keywords: ["game", "play", "chess", "sports", "gaming"],
    icon: "game-controller",
  },
  { keywords: ["garden", "plant", "nature", "outdoor"], icon: "flower" },
  { keywords: ["cook", "bake", "recipe", "kitchen"], icon: "restaurant" },

  // Digital Wellbeing
  {
    keywords: ["screen", "phone", "digital", "less", "unplug"],
    icon: "phone-portrait",
  },
  {
    keywords: ["social media", "instagram", "facebook", "x", "twitter"],
    icon: "apps",
  },

  // Spiritual & Personal
  { keywords: ["pray", "worship", "spiritual", "religious"], icon: "leaf" },
  { keywords: ["affirmation", "mantra", "positive"], icon: "sunny" },

  // Additional Exercise & Sports
  { keywords: ["tennis", "racket", "court", "serve"], icon: "ellipse" },
  { keywords: ["golf", "putting", "driving range", "clubs"], icon: "golf" },
  {
    keywords: ["dance", "choreography", "ballet", "hiphop"],
    icon: "musical-notes",
  },
  {
    keywords: ["martial arts", "karate", "judo", "taekwondo"],
    icon: "hand-left",
  },
  { keywords: ["climbing", "bouldering", "rock climbing"], icon: "flag" },
  {
    keywords: ["boxing", "kickboxing", "sparring", "punch"],
    icon: "hand-left",
  },
  { keywords: ["crossfit", "hiit", "interval", "intense"], icon: "barbell" },
  { keywords: ["stretch", "flexibility", "mobility", "range"], icon: "body" },

  // Advanced Mindfulness & Mental Health
  { keywords: ["breathwork", "pranayama", "breathing exercise"], icon: "leaf" },
  { keywords: ["visualization", "imagine", "mental imagery"], icon: "eye" },
  { keywords: ["therapy session", "counselor", "psychologist"], icon: "happy" },
  { keywords: ["stress relief", "anxiety management", "calm"], icon: "leaf" },
  { keywords: ["self care", "mental health day", "relax"], icon: "heart" },
  { keywords: ["positive thinking", "optimism", "mindset"], icon: "sunny" },
  { keywords: ["emotional awareness", "feelings", "mood"], icon: "happy" },
  { keywords: ["mindful eating", "conscious eating"], icon: "nutrition" },

  // Detailed Learning & Skills
  { keywords: ["online course", "udemy", "coursera", "mooc"], icon: "school" },
  {
    keywords: ["podcast", "audiobook", "learning audio"],
    icon: "musical-notes",
  },
  { keywords: ["ted talk", "educational video", "lecture"], icon: "videocam" },
  { keywords: ["flash cards", "memorization", "study"], icon: "document-text" },
  { keywords: ["speed reading", "comprehension", "reading"], icon: "book" },
  { keywords: ["note taking", "cornell method", "notes"], icon: "create" },
  { keywords: ["mind mapping", "brainstorming", "ideas"], icon: "git-branch" },
  { keywords: ["research", "analysis", "study topic"], icon: "search" },

  // Creative Pursuits
  { keywords: ["photography", "camera", "photo shoot"], icon: "camera" },
  { keywords: ["video editing", "filmmaker", "youtube"], icon: "videocam" },
  { keywords: ["pottery", "ceramics", "sculpting"], icon: "construct" },
  { keywords: ["knitting", "crochet", "yarn work"], icon: "construct" },
  { keywords: ["woodworking", "carpentry", "craft"], icon: "hammer" },
  { keywords: ["writing", "blogging", "creative writing"], icon: "create" },
  { keywords: ["poetry", "poem", "verse", "rhyme"], icon: "create" },
  { keywords: ["graphic design", "illustration", "design"], icon: "brush" },

  // Detailed Health & Nutrition
  {
    keywords: ["meal prep", "food planning", "cooking prep"],
    icon: "restaurant",
  },
  {
    keywords: ["calorie tracking", "macro counting", "diet"],
    icon: "analytics",
  },
  { keywords: ["intermittent fasting", "fasting window"], icon: "hourglass" },
  { keywords: ["protein intake", "supplements", "bcaa"], icon: "barbell" },
  { keywords: ["vegetarian meal", "vegan food", "plant"], icon: "leaf" },
  { keywords: ["smoothie", "juice", "blend", "shake"], icon: "water" },
  { keywords: ["vitamin d", "supplements", "omega"], icon: "sunny" },
  { keywords: ["sugar free", "no sugar", "sugar detox"], icon: "ban" },

  // Productivity & Time Management
  {
    keywords: ["time blocking", "schedule block", "planning"],
    icon: "calendar",
  },
  { keywords: ["deep work", "flow state", "focused work"], icon: "bulb" },
  { keywords: ["eisenhower matrix", "priority", "urgent"], icon: "grid" },
  { keywords: ["inbox zero", "email management", "clean"], icon: "mail" },
  { keywords: ["gtd", "getting things done", "task"], icon: "checkmark" },
  { keywords: ["meeting", "zoom call", "conference"], icon: "videocam" },
  { keywords: ["deadline", "due date", "timeline"], icon: "alarm" },
  { keywords: ["batch work", "batch tasks", "grouping"], icon: "layers" },

  // Personal Finance
  {
    keywords: ["budget review", "expense tracking", "mint"],
    icon: "calculator",
  },
  {
    keywords: ["stock review", "portfolio check", "invest"],
    icon: "stats-chart",
  },
  { keywords: ["crypto", "bitcoin", "blockchain"], icon: "trending-up" },
  { keywords: ["bill payment", "recurring bills", "pay"], icon: "card" },
  { keywords: ["debt payoff", "loan payment", "mortgage"], icon: "cash" },
  { keywords: ["tax prep", "accounting", "finances"], icon: "document" },
  { keywords: ["retirement", "401k", "ira", "saving"], icon: "wallet" },
  { keywords: ["side hustle", "passive income", "earn"], icon: "cash" },

  // Home & Living
  { keywords: ["laundry", "washing", "clothes clean"], icon: "water" },
  { keywords: ["dishes", "dishwasher", "kitchen clean"], icon: "home" },
  { keywords: ["vacuum", "sweep", "mop", "floor clean"], icon: "home" },
  { keywords: ["gardening", "plant care", "watering"], icon: "leaf" },
  { keywords: ["declutter", "minimalism", "organize"], icon: "trash" },
  { keywords: ["home repair", "maintenance", "fix"], icon: "hammer" },
  { keywords: ["bed making", "room tidy", "bedroom"], icon: "bed" },
  { keywords: ["meal planning", "grocery list", "food"], icon: "list" },

  // Relationships & Social
  { keywords: ["family time", "quality time", "bonding"], icon: "people" },
  { keywords: ["date night", "romantic time", "couple"], icon: "heart" },
  { keywords: ["networking", "professional connect"], icon: "people" },
  { keywords: ["parent time", "kids activity", "family"], icon: "people" },
  { keywords: ["friend catchup", "friendship", "social"], icon: "people" },
  { keywords: ["volunteer", "community service", "help"], icon: "heart" },
  { keywords: ["mentoring", "coaching", "teaching"], icon: "person" },
  { keywords: ["pet care", "dog walk", "animal"], icon: "paw" },

  // Digital Wellbeing & Technology
  {
    keywords: ["digital detox", "screen break", "unplug"],
    icon: "phone-portrait",
  },
  { keywords: ["password update", "security check"], icon: "lock-closed" },
  { keywords: ["backup", "data sync", "cloud save"], icon: "cloud-upload" },
  { keywords: ["device clean", "phone clean", "laptop"], icon: "laptop" },
  { keywords: ["news reading", "current events", "news"], icon: "newspaper" },
  { keywords: ["social media audit", "platform check"], icon: "apps" },
  { keywords: ["email cleanup", "inbox manage"], icon: "mail" },
  { keywords: ["app organization", "phone tidy"], icon: "phone-portrait" },

  // Personal Growth
  { keywords: ["reflection", "self review", "journal"], icon: "book" },
  { keywords: ["goal review", "milestone check", "goals"], icon: "flag" },
  { keywords: ["habit tracking", "consistency check"], icon: "analytics" },
  { keywords: ["morning routine", "morning ritual"], icon: "sunny" },
  { keywords: ["evening routine", "night ritual"], icon: "moon" },
  { keywords: ["weekly review", "plan review"], icon: "calendar" },
  { keywords: ["monthly goals", "month review"], icon: "trophy" },
  { keywords: ["skill practice", "deliberate practice"], icon: "build" },
  // Extra categories to broaden keyword coverage (common habits)
  {
    keywords: ["commute", "drive", "car", "taxi", "uber", "ride"],
    icon: "car",
  },
  { keywords: ["coffee", "cafe", "espresso", "latte"], icon: "cafe" },
  {
    keywords: ["snack", "dessert", "treat", "icecream", "ice cream"],
    icon: "ice-cream",
  },
  {
    keywords: ["movie", "film", "watch", "cinema", "tv", "netflix"],
    icon: "film",
  },
  {
    keywords: ["game", "video game", "gaming", "xbox", "play"],
    icon: "game-controller",
  },
  { keywords: ["gift", "present", "surprise"], icon: "gift" },
  { keywords: ["pizza", "takeout", "order food", "deliver"], icon: "pizza" },
  {
    keywords: ["music", "song", "listen", "practice music"],
    icon: "musical-notes",
  },
  {
    keywords: ["photo", "photo shoot", "camera", "photography"],
    icon: "camera",
  },
  { keywords: ["relax", "rest", "chill", "spa", "self care"], icon: "happy" },
  { keywords: ["shop", "shopping", "groceries", "buy"], icon: "cart" },
  {
    keywords: ["clean", "cleaning", "laundry", "dishes", "tidy"],
    icon: "home",
  },
  {
    keywords: ["plan", "planing", "planning", "schedule", "todo", "tasks"],
    icon: "list",
  },
  { keywords: ["steps", "step", "walking", "walk", "stroll"], icon: "walk" },
  { keywords: ["water", "hydrate", "drink", "glasses"], icon: "water" },
  { keywords: ["stretch", "mobility", "yoga", "flexibility"], icon: "body" },
  { keywords: ["read", "reading", "book", "pages", "novel"], icon: "book" },
  { keywords: ["study", "learn", "course", "lesson"], icon: "school" },
  { keywords: ["meditate", "mindful", "breath", "breathing"], icon: "leaf" },
  { keywords: ["weight", "lift", "barbell", "strength"], icon: "barbell" },
  { keywords: ["sleep", "nap", "bedtime", "bed"], icon: "bed" },
  {
    keywords: ["health", "doctor", "meds", "medicine", "supplement"],
    icon: "medkit",
  },
  { keywords: ["money", "save", "budget", "finance", "pay"], icon: "cash" },
  {
    keywords: ["invest", "stocks", "portfolio", "crypto"],
    icon: "trending-up",
  },
  { keywords: ["email", "inbox", "mail", "newsletter"], icon: "mail" },
  { keywords: ["call", "phone", "ring", "call a friend"], icon: "call" },
  { keywords: ["volunteer", "donate", "help", "community"], icon: "heart" },
  { keywords: ["pomodoro", "focus", "timer", "deep work"], icon: "alarm" },
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
