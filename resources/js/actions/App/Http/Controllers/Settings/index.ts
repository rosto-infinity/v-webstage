import DBBackupController from './DBBackupController';
import PasswordController from './PasswordController';
import ProfileController from './ProfileController';
import SocialMediaController from './SocialMediaController';
import StageController from './StageController';

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    PasswordController: Object.assign(PasswordController, PasswordController),
    SocialMediaController: Object.assign(SocialMediaController, SocialMediaController),
    StageController: Object.assign(StageController, StageController),
    DBBackupController: Object.assign(DBBackupController, DBBackupController),
};

export default Settings;
