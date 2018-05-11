import SignUp from './SignUp'
import Profile from './Profile'
import Login from './Login'
import Setting from './Setting'


const routes = [
    {
        path:'/',
        exact: true,
        component: SignUp
    },
    {
        path:'/login',
        exact: true,
        component: Login
    },
    {
        path:'/:username',
        exact: true,
        component: Profile
    },
    {
        path:'/:username/setting',
        exact: true,
        component: Setting
    }

]

export default routes