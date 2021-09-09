export default {
  token: store => store.account.token,
  menus: store => store.account.menus,
  collapsed: store => store.account.collapsed,
  user: store => store.account.user,
  stompClient: store => store.setting.stompClient
}
