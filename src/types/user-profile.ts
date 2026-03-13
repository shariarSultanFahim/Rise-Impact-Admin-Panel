export interface UserProfileFormValues {
  name: string;
  email: string;
  role: string;
  status: string;
  verified: boolean;
  phone: string;
  location: string;
  dateOfBirth: string;
  gender: string;
  profilePicture?: string;
  avatarFile?: File;
}

export interface UserProfileFormProps {
  initialValues: ProfileItem;
}

export interface ProfileItem {
  _id: string;
  name: string;
  role: string;
  email: string;
  profilePicture: string;
  status: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  dateOfBirth: string;
  gender: string;
  location: string;
  phone: string;
}

export interface GetProfileResponse {
  success: boolean;
  message: string;
  data: ProfileItem;
}

export interface UpdateProfilePayload {
  name?: string;
  dateOfBirth?: string;
  gender?: string;
  location?: string;
  phone?: string;
  profilePicture?: File;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: ProfileItem;
}
