import UserController from './UserController'
import DashboardController from './DashboardController'
import PresenceController from './PresenceController'
import YearTrainingController from './YearTrainingController'

const Admin = {
    UserController: Object.assign(UserController, UserController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    PresenceController: Object.assign(PresenceController, PresenceController),
    YearTrainingController: Object.assign(YearTrainingController, YearTrainingController),
}

export default Admin