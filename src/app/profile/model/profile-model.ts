import { ProfileInformationModel } from './profile-information-model';

export interface ProfileModel {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  photoUrl: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
  information?: ProfileInformationModel;
}
