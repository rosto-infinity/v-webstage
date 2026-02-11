import DashboardController from './DashboardController';
import PresenceController from './PresenceController';
import UserController from './UserController';

const Admin = {
    UserController: Object.assign(UserController, UserController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    PresenceController: Object.assign(PresenceController, PresenceController),
};

export default Admin;
