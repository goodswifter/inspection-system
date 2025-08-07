import errorRoutes from './error'
import homeRoutes from './home'

export const routes: RouteRecordRaw[] = [...homeRoutes, ...errorRoutes]
