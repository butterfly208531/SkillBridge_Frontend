export interface CommunityPlatform {
  key: string;
  url: string;
  statsValue?: string;
  statsSuffix?: string;
  label?: string;
  statLabel?: string;
}

export interface CommunityFeature {
  key: string;
  icon: string; // lucide icon name
}

export const communityConfig: CommunityPlatform[] = [
  { key: "telegram",  url: "https://t.me/skillbridgeinstituteoftech",                                    statsValue: "1000", statsSuffix: "+" },
  { key: "youtube",   url: "https://www.youtube.com/@SkillBridgeInstituteOfTech",                        statsValue: "20",   statsSuffix: "+" },
  { key: "linkedin",  url: "https://www.linkedin.com/company/skillbridge-institute-of-technology",       statsValue: "50",   statsSuffix: "+" },
  { key: "hub",       url: "https://t.me/skillbridgeinstituteoftech",                                    statsValue: "500",  statsSuffix: "+" },
  { key: "instagram", url: "https://www.instagram.com/skill.bridge.institute",                      statsValue: "100",  statsSuffix: "+" },
  { key: "facebook",  url: "https://www.facebook.com/share/1BdDExr4ZH/",                            statsValue: "50",   statsSuffix: "+" },
  { key: "tiktok",    url: "https://www.tiktok.com/@skillbridge_institute",                         statsValue: "30",   statsSuffix: "+" },
  { key: "twitter",   url: "https://x.com/Skillbridgedu",                                           statsValue: "50",   statsSuffix: "+" },
];

// Extra community engagement features shown as highlight cards
export const communityFeatures: CommunityFeature[] = [
  { key: "events",   icon: "Calendar" },
  { key: "challenges", icon: "Trophy" },
  { key: "referral", icon: "Gift" },
];

export const hubConfig = {
  hubUrl: "https://t.me/skillbridgeinstituteoftech",
  telegramBotUrl: "https://t.me/skillbridgesupport2",
  youtubeUrl: "https://www.youtube.com/@SkillBridgeInstituteOfTech",
  phone1: "+251955935455",
  phone2: "+251974424372",
};
