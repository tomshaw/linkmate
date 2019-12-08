import HomePage from '@/popup/router/pages/HomePage'
import AuthPage from '@/popup/router/pages/AuthPage'

export default [{
  path: '/',
  name: 'HomePage',
  component: HomePage
}, {
  path: '/auth',
  name: 'AuthPage',
  component: AuthPage
}]
