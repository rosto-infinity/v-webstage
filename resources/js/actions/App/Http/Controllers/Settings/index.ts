import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
import SocialMediaController from './SocialMediaController'
import StageController from './StageController'
import DBBackupController from './DBBackupController'

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    PasswordController: Object.assign(PasswordController, PasswordController),
    SocialMediaController: Object.assign(SocialMediaController, SocialMediaController),
    StageController: Object.assign(StageController, StageController),
    DBBackupController: Object.assign(DBBackupController, DBBackupController),
}

export default Settings