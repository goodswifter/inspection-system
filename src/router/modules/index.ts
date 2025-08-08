import type { RouteRecordRaw } from 'vue-router'
import errorRoutes from './error'
import homeRoutes from './home'

export const routes: RouteRecordRaw[] = [...homeRoutes, ...errorRoutes]
