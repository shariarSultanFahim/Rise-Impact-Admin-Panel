export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl?: string;
}

export interface UserProfileData {
  userProfile: UserProfile;
}

export interface UserProfileFormValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl?: string;
}

export interface UserProfileFormProps {
  initialValues: UserProfile;
}
