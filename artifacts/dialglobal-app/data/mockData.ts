export const COUNTRIES = [
  { code:"US", name:"United States",  flag:"🇺🇸", prefix:"+1",  price:2.99, instant:true,  popular:true },
  { code:"GB", name:"United Kingdom", flag:"🇬🇧", prefix:"+44", price:2.99, instant:true,  popular:true },
  { code:"CA", name:"Canada",         flag:"🇨🇦", prefix:"+1",  price:2.99, instant:true,  popular:true },
  { code:"AU", name:"Australia",      flag:"🇦🇺", prefix:"+61", price:3.99, instant:true,  popular:true },
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
    id: "free", name: "Free", tag: null as string | null, tagColor: null as string | null,
    monthlyPrice: 0, yearlyPrice: 0,
    numberLimit: 1, countries: ["US","GB","CA"] as string[] | string,
    callMinutes: 30, smsLimit: 20,
    features: ["1 number (US/UK/CA only)","30 min calls/month","20 SMS/month","7-day message history","Basic voicemail"],
    notIncluded: ["Call recording","Call forwarding","eSIM data","Auto-reply","Multiple numbers"],
  },
  {
    id: "starter", name: "Starter", tag: "POPULAR" as string | null, tagColor: "#E8A020" as string | null,
    monthlyPrice: 4.99, yearlyPrice: 3.99,
    numberLimit: 2, countries: "30+" as string[] | string,
    callMinutes: 300, smsLimit: 500,
    features: ["2 virtual numbers","30+ countries","300 min calls + 500 SMS","Voicemail transcription","Call forwarding","Auto-reply","Push notifications","30-day history"],
    notIncluded: ["Call recording","eSIM data plans","Custom caller ID"],
  },
  {
    id: "pro", name: "Pro", tag: "BEST VALUE" as string | null, tagColor: "#16A34A" as string | null,
    monthlyPrice: 9.99, yearlyPrice: 7.99,
    numberLimit: 5, countries: "60+" as string[] | string,
    callMinutes: 9999, smsLimit: 9999,
    features: ["5 virtual numbers","60+ countries","Unlimited calls & SMS","Call recording","Call forwarding","Spam blocking","eSIM data plans","Custom caller ID","90-day history","Priority support"],
    notIncluded: [] as string[],
  },
  {
    id: "global", name: "Global", tag: "POWER" as string | null, tagColor: "#7C3AED" as string | null,
    monthlyPrice: 19.99, yearlyPrice: 15.99,
    numberLimit: 15, countries: "100+" as string[] | string,
    callMinutes: 9999, smsLimit: 9999,
    features: ["15 virtual numbers","100+ countries","Everything in Pro","API access","Team sharing (3 seats)","White-label caller ID","Dedicated account manager","Custom eSIM branding"],
    notIncluded: [] as string[],
  },
];

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
  { id:"1", number:"+1 (415) 823-4921", country:"United States", countryCode:"US", flag:"🇺🇸", type:"permanent" as const, calls:12, sms:47, plan:"Pro", missedCalls:2, lastActivity:"2m ago" },
  { id:"2", number:"+44 7700 123 456",  country:"United Kingdom", countryCode:"GB", flag:"🇬🇧", type:"temporary" as const, calls:3,  sms:8,  plan:"Starter",    missedCalls:0, lastActivity:"1h ago", expiresIn:"5 days" },
];

export const MOCK_MESSAGES = [
  { id:"1", name:"Marcus Webb",   number:"+1 917 555 0134",  preview:"Hey, are you free for a call tomorrow?", time:"2m",  unread:2, flag:"🇺🇸", type:"sms" },
  { id:"2", name:"Priya Sharma",  number:"+44 7900 112233",  preview:"The contract has been sent to your email", time:"14m", unread:0, flag:"🇬🇧", type:"sms" },
  { id:"3", name:"Unknown",       number:"+1 650 555 7823",  preview:"Missed call",                             time:"1h",  unread:1, flag:"🇺🇸", type:"missed" },
  { id:"4", name:"David Chen",    number:"+61 4 1234 5678",  preview:"Thanks for getting back to me!",          time:"3h",  unread:0, flag:"🇦🇺", type:"sms" },
  { id:"5", name:"Sarah Miller",  number:"+49 30 1234567",   preview:"Voicemail • 0:42",                        time:"1d",  unread:0, flag:"🇩🇪", type:"voicemail" },
];

export const MOCK_CALLS = [
  { id:"1", name:"Marcus Webb",   number:"+1 917 555 0134",  flag:"🇺🇸", type:"incoming",  duration:"4:32",  time:"2m ago" },
  { id:"2", name:"Priya Sharma",  number:"+44 7900 112233",  flag:"🇬🇧", type:"outgoing",  duration:"12:05", time:"1h ago" },
  { id:"3", name:"Unknown",       number:"+1 650 555 7823",  flag:"🇺🇸", type:"missed",    duration:"",      time:"2h ago" },
  { id:"4", name:"David Chen",    number:"+61 4 1234 5678",  flag:"🇦🇺", type:"outgoing",  duration:"1:44",  time:"Yesterday" },
  { id:"5", name:"Sarah Miller",  number:"+49 30 1234567",   flag:"🇩🇪", type:"voicemail", duration:"0:42",  time:"Yesterday" },
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
