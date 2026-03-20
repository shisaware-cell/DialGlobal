export const COUNTRIES = [
  { code:"US", name:"United States",  flag:"🇺🇸", prefix:"+1",  price:1.99, instant:true,  popular:true },
  { code:"GB", name:"United Kingdom", flag:"🇬🇧", prefix:"+44", price:1.99, instant:true,  popular:true },
  { code:"CA", name:"Canada",         flag:"🇨🇦", prefix:"+1",  price:1.99, instant:true,  popular:true },
  { code:"AU", name:"Australia",      flag:"🇦🇺", prefix:"+61", price:2.99, instant:true,  popular:true },
  { code:"DE", name:"Germany",        flag:"🇩🇪", prefix:"+49", price:2.99, instant:true,  popular:false },
  { code:"FR", name:"France",         flag:"🇫🇷", prefix:"+33", price:2.99, instant:true,  popular:false },
  { code:"NL", name:"Netherlands",    flag:"🇳🇱", prefix:"+31", price:2.49, instant:true,  popular:false },
  { code:"SG", name:"Singapore",      flag:"🇸🇬", prefix:"+65", price:3.99, instant:true,  popular:false },
  { code:"JP", name:"Japan",          flag:"🇯🇵", prefix:"+81", price:4.99, instant:false, popular:false },
  { code:"ZA", name:"South Africa",   flag:"🇿🇦", prefix:"+27", price:2.99, instant:false, popular:false },
  { code:"SE", name:"Sweden",         flag:"🇸🇪", prefix:"+46", price:2.49, instant:true,  popular:false },
  { code:"NZ", name:"New Zealand",    flag:"🇳🇿", prefix:"+64", price:2.99, instant:true,  popular:false },
  { code:"IT", name:"Italy",          flag:"🇮🇹", prefix:"+39", price:2.99, instant:true,  popular:false },
  { code:"ES", name:"Spain",          flag:"🇪🇸", prefix:"+34", price:2.99, instant:true,  popular:false },
  { code:"BR", name:"Brazil",         flag:"🇧🇷", prefix:"+55", price:2.49, instant:false, popular:false },
];

export const PLANS = [
  {
    id: "basic", name: "Basic", monthlyPrice: 1.99, yearlyPrice: 1.49,
    numberLimit: 1, countries: ["US","GB","CA"],
    features: ["1 virtual number","US, UK & Canada only","60 SMS / 30 min calls","Custom voicemail","7-day history"],
  },
  {
    id: "unlimited", name: "Unlimited", monthlyPrice: 4.99, yearlyPrice: 3.99,
    numberLimit: 3, countries: "45+",
    features: ["3 virtual numbers","45+ countries","Unlimited SMS & calls","Voicemail transcription","Auto-reply","Call forwarding","Priority support"],
  },
  {
    id: "global", name: "Global", monthlyPrice: 9.99, yearlyPrice: 7.99,
    numberLimit: 10, countries: "100+",
    features: ["10 virtual numbers","100+ countries","Unlimited SMS & calls","Voicemail transcription","Call recording","Custom caller ID","API access","Dedicated support"],
  },
];

export const MOCK_NUMBERS = [
  { id:"1", number:"+1 (415) 823-4921", country:"United States", countryCode:"US", flag:"🇺🇸", type:"permanent" as const, calls:12, sms:47, plan:"Unlimited", missedCalls:2, lastActivity:"2m ago" },
  { id:"2", number:"+44 7700 123 456",  country:"United Kingdom", countryCode:"GB", flag:"🇬🇧", type:"temporary" as const, calls:3,  sms:8,  plan:"Basic",    missedCalls:0, lastActivity:"1h ago", expiresIn:"5 days" },
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
