import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes } from '@/router'
import { useUserStore } from '@/store/user'

/**
 * 檢查用戶是否有權限訪問該路由
 * @param {Array} userPermissions 用戶權限列表
 * @param {Object} route 路由對像
 */
function hasPermission(userPermissions, route) {
  if (!route.meta) {
    return true
  }

  // 檢查頁面權限
  if (route.meta.pageId) {
    if (userPermissions.includes(route.meta.pageId)) {
      return true
    }
  }

  // 檢查按鈕權限
  if (route.meta.buttonIds) {
    if (
      route.meta.buttonIds.some((button) =>
        userPermissions.includes(button.buttonId)
      )
    ) {
      return true
    }
  }

  return false
}

/**
 * 遞歸過濾異步路由表
 * @param routes asyncRoutes
 * @param permissionIds 用戶權限 {pageIds: [], buttonIds: []}
 */
export function filterAsyncRoutes(routes, permissionIds) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }

    // 檢查是否有子路由有權限
    const hasChildPermission =
      tmp.children && filterAsyncRoutes(tmp.children, permissionIds).length > 0

    // 如果當前路由有權限或者子路由有權限，都應該保留當前路由
    if (hasPermission(permissionIds, tmp) || hasChildPermission) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissionIds)
      }
      res.push(tmp)
    }
  })

  return res
}

export const usePermissionStore = defineStore('permission', {
  state: () => {
    return {
      routes: [],
      addRoutes: []
    }
  },
  actions: {
    /**
     * @method generateRoutes
     */
    generateRoutes() {
      const userStore = useUserStore()
      return new Promise((resolve) => {
        const accessedRoutes = filterAsyncRoutes(
          asyncRoutes,
          userStore.userInfo.permissionIds
        )
        this.addRoutes = accessedRoutes
        this.routes = constantRoutes.concat(accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
})
