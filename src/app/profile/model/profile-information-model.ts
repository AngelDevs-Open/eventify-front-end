export interface ProfileInformationModel {
  id: string;
  profileId: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  jobTitle?: string;
  company?: string;
  skills?: string[];
  education?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
}
