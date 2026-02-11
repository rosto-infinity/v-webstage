import Admin from './Admin';
import Auth from './Auth';
import HomeController from './HomeController';
import Settings from './Settings';

const Controllers = {
    HomeController: Object.assign(HomeController, HomeController),
    Admin: Object.assign(Admin, Admin),
    Settings: Object.assign(Settings, Settings),
    Auth: Object.assign(Auth, Auth),
};

export default Controllers;
