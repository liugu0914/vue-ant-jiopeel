
/**
 * 公共组件
 */
const menus = [
  {
    menuName: '主菜单', // 主菜单名称
    isParent: true, // 是否为父节点
    router: null, // 父级菜单不需要配置路由
    icon: 'cs-menu', // Icon
    children: [ // 子菜单集合
      {
        menuName: '应用管理', // 子菜单名称
        router: 'app', // 子菜单路由名 - 映射配置的菜单路由
        isParent: false, // 是否为父节点 (是否有含有多级菜单)
        icon: 'cs-app' // Icon
      }
    ]
  }
]

export default menus
