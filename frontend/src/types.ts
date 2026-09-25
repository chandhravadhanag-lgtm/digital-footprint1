export interface CandidateMatch {
  candidate_id: string;
  display_name: string;
  description: string;
  profession: string;
  organization: string;
  score: number;
  wikidata_url?: string;
}

export interface FactItem {
  value: string;
  source: string;
  confidence: 'High' | 'Medium' | 'Low' | string;
}

export interface EducationFact {
  institution: string;
  degree: string;
  source: string;
  confidence: 'High' | 'Medium' | 'Low' | string;
}

export interface CareerFact {
  organization: string;
  role: string;
  period: string;
  source: string;
  confidence: 'High' | 'Medium' | 'Low' | string;
}

export interface SocialProfileFact {
  platform: 'LinkedIn' | 'GitHub' | 'X (Twitter)' | 'Instagram' | 'Facebook' | 'YouTube' | string;
  url: string;
  is_verified: boolean;
  source: string;
  confidence: 'High' | 'Medium' | 'Low' | string;
}

export interface WebsiteFact {
  title: string;
  url: string;
  type?: string;
  snippet?: string;
}

export interface NewsFact {
  title: string;
  url: string;
  snippet?: string;
  source: string;
  relevance: string;
}

export interface SourceFact {
  url: string;
  platform: string;
  reliability: 'High' | 'Medium' | 'Low' | string;
}

export interface DynamicReport {
  status: 'success' | 'disambiguation_needed' | 'error';
  message?: string;
  person: {
    name: string;
    headline: string;
    avatar_url?: string | null;
    biography_summary?: string;
    profession: FactItem;
    organization: FactItem;
    date_of_birth: FactItem;
    education: EducationFact[];
    career: CareerFact[];
    official_website: FactItem;
  };
  social_profiles: SocialProfileFact[];
  websites: WebsiteFact[];
  news: NewsFact[];
  sources: SourceFact[];
  confidence: 'High' | 'Medium' | 'Low' | string;
  possible_matches?: CandidateMatch[];
  query?: {
    full_name: string;
    location?: string | null;
    organization?: string | null;
    selected_candidate_id?: string | null;
  };
}

// Prototype Legacy Types for backward compatibility
export interface SourceItem {
  id: number;
  platform: string;
  source_type: string;
  url: string;
  username?: string;
  reliability_score: number;
  match_confidence: number;
  is_verified: boolean;
  last_crawled?: string;
}

export interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  period?: string;
  field_of_study?: string;
  confidence: number;
  extracted_text?: string;
  is_verified: boolean;
  source_platform: string;
}

export interface EmploymentItem {
  id: number;
  organization: string;
  role: string;
  period?: string;
  description?: string;
  confidence: number;
  is_verified: boolean;
  source_platform: string;
}

export interface SkillItem {
  id: number;
  name: string;
  category: string;
  extraction_method: string;
  confidence: number;
  source_label: string;
}

export interface PhotoItem {
  id: number;
  url: string;
  source_platform: string;
  caption?: string;
  date_found?: string;
  is_authorized: boolean;
  is_sample: boolean;
}

export interface EntityItem {
  id: number;
  text: string;
  label: string;
  confidence: number;
}

export interface WebMentionItem {
  id: number;
  website: string;
  title: string;
  date: string;
  extracted_information: string;
  source_url: string;
  relevance_score: number;
}

export interface ProfileData {
  id: number;
  full_name: string;
  headline: string;
  location: string;
  avatar_url: string;
  confidence_score: number;
  confidence_level: string;
  sources_count: number;
  summary: string;
  badge: string;
  disclaimer: string;
  sample_notice: string;
  sources: SourceItem[];
  education: EducationItem[];
  employment: EmploymentItem[];
  skills: SkillItem[];
  photos: PhotoItem[];
  entities: EntityItem[];
  web_mentions: WebMentionItem[];
}
