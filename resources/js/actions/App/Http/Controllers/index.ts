import HomeController from './HomeController'
import Admin from './Admin'
import Settings from './Settings'
import Auth from './Auth'

const Controllers = {
    HomeController: Object.assign(HomeController, HomeController),
    Admin: Object.assign(Admin, Admin),
    Settings: Object.assign(Settings, Settings),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers