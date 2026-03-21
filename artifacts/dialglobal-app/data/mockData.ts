export const COUNTRIES = [
  { code:"US", name:"United States",  flag:"🇺🇸", prefix:"+1",  price:2.99, instant:true,  popular:true  },
  { code:"GB", name:"United Kingdom", flag:"🇬🇧", prefix:"+44", price:2.99, instant:true,  popular:true  },
  { code:"CA", name:"Canada",         flag:"🇨🇦", prefix:"+1",  price:2.99, instant:true,  popular:true  },
  { code:"AU", name:"Australia",      flag:"🇦🇺", prefix:"+61", price:3.99, instant:true,  popular:true  },
  { code:"DE", name:"Germany",        flag:"🇩🇪", prefix:"+49", price:3.99, instant:true,  popular:false },
  { code:"FR", name:"France",         flag:"🇫🇷", prefix:"+33", price:3.99, instant:true,  popular:false },
  { code:"NL", name:"Netherlands",    flag:"🇳🇱", prefix:"+31", price:3.49, instant:true,  popular:false },
  { code:"SG", name:"Singapore",      flag:"🇸🇬", prefix:"+65", price:4.99, instant:true,  popular:false },
  { code:"JP", name:"Japan",          flag:"🇯🇵", prefix:"+81", price:5.99, instant:false, popular:false },
  { code:"ZA", name:"South Africa",   flag:"🇿🇦", prefix:"+27", price:3.99, instant:false, popular:false },
  { code:"SE", name:"Sweden",         flag:"🇸🇪", prefix:"+46", price:3.49, instant:true,  popular:false },
  { code:"NZ", name:"New Zealand",    flag:"🇳🇿", prefix:"+64", price:3.99, instant:true,  popular:false },
  { code:"IT", name:"Italy",          flag:"🇮🇹", prefix:"+39", price:3.99, instant:true,  popular:false },
  { code:"ES", name:"Spain",          flag:"🇪🇸", prefix:"+34", price:3.99, instant:true,  popular:false },
  { code:"BR", name:"Brazil",         flag:"🇧🇷", prefix:"+55", price:3.49, instant:false, popular:false },
];

export const PLANS = [
  {
    id:           "traveller",
    name:         "Traveller",
    persona:      "For people who travel and need a local number abroad",
    emoji:        "✈️",
    tag:          null as string | null,
    tagColor:     null as string | null,
    color:        "#2563EB",
    colorDim:     "rgba(37,99,235,0.09)",
    monthlyPrice: 7.99,
    yearlyPrice:  6.42,
    yearlyBilled: 76.99,
    numberLimit:  1,
    callMinutes:  100,
    smsLimit:     300,
    hasRecording: false,
    hasAutoReply: false,
    hasSpamBlock: false,
    hasForwarding:true,
    hasPriority:  false,
    includedCredits: 0,
    features: [
      "1 virtual number (any country)",
      "100 min calls to any number worldwide",
      "300 SMS included",
      "Call forwarding & voicemail",
      "Push notifications for calls & SMS",
      "eSIM plans available separately",
    ],
    notIncluded: ["Call recording","Auto-reply","Spam blocker","Extra numbers"],
  },
  {
    id:           "professional",
    name:         "Professional",
    persona:      "For freelancers, remote workers & side businesses",
    emoji:        "💼",
    tag:          "MOST POPULAR" as string | null,
    tagColor:     "#16A34A" as string | null,
    color:        "#16A34A",
    colorDim:     "rgba(22,163,74,0.09)",
    monthlyPrice: 14.99,
    yearlyPrice:  11.99,
    yearlyBilled: 143.99,
    numberLimit:  3,
    callMinutes:  300,
    smsLimit:     9999,
    hasRecording: true,
    hasAutoReply: true,
    hasSpamBlock: true,
    hasForwarding:true,
    hasPriority:  false,
    includedCredits: 5,
    features: [
      "3 virtual numbers (any country)",
      "300 min calls to any number worldwide",
      "Unlimited SMS",
      "Call recording & voicemail transcription",
      "Auto-reply & spam blocker",
      "Call forwarding",
      "$5 credits included monthly",
    ],
    notIncluded: ["More than 3 numbers","Priority support"],
  },
  {
    id:           "business",
    name:         "Business",
    persona:      "For teams, entrepreneurs & power users",
    emoji:        "🏢",
    tag:          null as string | null,
    tagColor:     null as string | null,
    color:        "#7C3AED",
    colorDim:     "rgba(124,58,237,0.09)",
    monthlyPrice: 19.99,
    yearlyPrice:  15.99,
    yearlyBilled: 191.99,
    numberLimit:  10,
    callMinutes:  500,
    smsLimit:     9999,
    hasRecording: true,
    hasAutoReply: true,
    hasSpamBlock: true,
    hasForwarding:true,
    hasPriority:  true,
    includedCredits: 10,
    features: [
      "10 virtual numbers (any country)",
      "500 min calls to any number worldwide",
      "Unlimited SMS",
      "Call recording & voicemail transcription",
      "Auto-reply & spam blocker",
      "Priority support",
      "$10 credits included monthly",
      "Team sharing (3 seats)",
    ],
    notIncluded: [],
  },
];

export const TRIAL_LIMITS = {
  days:            3,
  callMinutes:     15,
  smsLimit:        10,
  numberLimit:     1,
  freeCredits:     2.00,
  hasRecording:    false,
  hasAutoReply:    false,
  hasSpamBlock:    false,
  hasForwarding:   false,
  requiresCard:    true,
  canCall:         true,
  canSMS:          true,
  canReceiveCalls: true,
  canPickCountry:  true,
};

export const ESIM_PLANS = [
  {
    id:"e1", region:"Africa & Middle East", emoji:"🌍",
    countryFlags:"🇿🇦🇳🇬🇰🇪🇦🇪",
    data:"1 GB", dataGB:1, days:7, price:5.99,
    perDay:"$0.86/day", popular:false,
    features:["30+ countries","LTE speeds","Instant activation","No roaming fees"],
  },
  {
    id:"e2", region:"Americas", emoji:"🌎",
    countryFlags:"🇺🇸🇨🇦🇲🇽🇧🇷",
    data:"3 GB", dataGB:3, days:14, price:9.99,
    perDay:"$0.71/day", popular:true,
    features:["25+ countries","LTE/5G speeds","Instant activation","No roaming fees"],
  },
  {
    id:"e3", region:"Asia Pacific", emoji:"🌏",
    countryFlags:"🇸🇬🇯🇵🇦🇺🇳🇿",
    data:"2 GB", dataGB:2, days:10, price:7.99,
    perDay:"$0.80/day", popular:false,
    features:["20+ countries","LTE speeds","Instant activation","No roaming fees"],
  },
  {
    id:"e4", region:"Europe", emoji:"🇪🇺",
    countryFlags:"🇬🇧🇩🇪🇫🇷🇸🇪",
    data:"5 GB", dataGB:5, days:30, price:15.99,
    perDay:"$0.53/day", popular:false,
    features:["40+ countries","LTE/5G speeds","Instant activation","No roaming fees"],
  },
  {
    id:"e5", region:"Global", emoji:"🌐",
    countryFlags:"🌍🌎🌏",
    data:"3 GB", dataGB:3, days:15, price:21.99,
    perDay:"$1.47/day", popular:false,
    features:["160+ countries","LTE/5G speeds","Instant activation","No roaming fees","Single eSIM, global use"],
  },
];

export const MOCK_NUMBERS = [
  { id:"1", phone_number:"+1 (415) 823-4921", country:"United States",  countryCode:"US", flag:"🇺🇸", type:"permanent" as const, status:"active", call_count:12, sms_count:47, missed_count:2, created_at:"2025-01-01", plan:"Professional" },
  { id:"2", phone_number:"+44 7700 123 456",  country:"United Kingdom", countryCode:"GB", flag:"🇬🇧", type:"temporary" as const, status:"active", call_count:3,  sms_count:8,  missed_count:0, created_at:"2025-01-01", plan:"Traveller", expiresIn:"5 days" },
];

export const MOCK_MESSAGES = [
  { id:"1", name:"Marcus Webb",   from_number:"+1 917 555 0134",  to_number:"+1 (415) 823-4921", preview:"Hey, are you free for a call tomorrow?", time:"2m",  unread:2, flag:"🇺🇸", type:"sms" },
  { id:"2", name:"Priya Sharma",  from_number:"+44 7900 112233",  to_number:"+44 7700 123 456",  preview:"The contract has been sent to your email", time:"14m", unread:0, flag:"🇬🇧", type:"sms" },
  { id:"3", name:"Unknown",       from_number:"+1 650 555 7823",  to_number:"+1 (415) 823-4921", preview:"Missed call",                             time:"1h",  unread:1, flag:"🇺🇸", type:"missed" },
  { id:"4", name:"David Chen",    from_number:"+61 4 1234 5678",  to_number:"+1 (415) 823-4921", preview:"Thanks for getting back to me!",          time:"3h",  unread:0, flag:"🇦🇺", type:"sms" },
  { id:"5", name:"Sarah Miller",  from_number:"+49 30 1234567",   to_number:"+44 7700 123 456",  preview:"Voicemail • 0:42",                        time:"1d",  unread:0, flag:"🇩🇪", type:"voicemail" },
];

export const MOCK_CALLS = [
  { id:"1", name:"Marcus Webb",   from_number:"+1 917 555 0134",  to_number:"+1 (415) 823-4921", flag:"🇺🇸", type:"incoming",  duration:272,  time:"2m ago" },
  { id:"2", name:"Priya Sharma",  from_number:"+44 7900 112233",  to_number:"+44 7700 123 456",  flag:"🇬🇧", type:"outgoing",  duration:725, time:"1h ago" },
  { id:"3", name:"Unknown",       from_number:"+1 650 555 7823",  to_number:"+1 (415) 823-4921", flag:"🇺🇸", type:"missed",    duration:0,    time:"2h ago" },
  { id:"4", name:"David Chen",    from_number:"+61 4 1234 5678",  to_number:"+1 (415) 823-4921", flag:"🇦🇺", type:"outgoing",  duration:104,  time:"Yesterday" },
  { id:"5", name:"Sarah Miller",  from_number:"+49 30 1234567",   to_number:"+44 7700 123 456",  flag:"🇩🇪", type:"voicemail", duration:42,   time:"Yesterday" },
];

export function genNumber(prefix: string): string {
  const a = Math.floor(Math.random()*900+100);
  const b = Math.floor(Math.random()*900+100);
  const c = Math.floor(Math.random()*9000+1000);
  if (prefix === "+1")  return `${prefix} (${a}) ${b}-${c}`;
  if (prefix === "+44") return `${prefix} 7${a} ${b} ${c}`;
  return `${prefix} ${a} ${b} ${c}`;
}

export type VirtualNumber = typeof MOCK_NUMBERS[0];
export type Plan = typeof PLANS[0];
