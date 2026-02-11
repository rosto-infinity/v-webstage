import UserController from './UserController'
import DashboardController from './DashboardController'
import PresenceController from './PresenceController'

const Admin = {
    UserController: Object.assign(UserController, UserController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    PresenceController: Object.assign(PresenceController, PresenceController),
}

export default Admin