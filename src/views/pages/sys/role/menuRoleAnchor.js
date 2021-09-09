import { Anchor, Icon } from 'ant-design-vue/es'
import AnchorLink from 'ant-design-vue/es/anchor/AnchorLink'

export default {
  name: 'menuRoleAnchor',
  props: {
    menus: {
      type: Array,
      required: true,
      default: []
    }
  },
  data() {
    return {
    }
  },
  /**
   * 当 keep-alive 包含的组件再次渲染的时候触发
   */
  activated() {
    const el = this.$refs.anchor.$el
    el.style.width = ''
    el.style.height = ''
  },
  methods: {
    renderIcon: function(h, icon) {
      return !icon || icon == 'none' ? null : h(Icon, { props: { type: icon }})
    },
    renderMenuItem: function(h, menu) {
      return h(AnchorLink, { props: { href: `#roleMenu_${menu.id}`, title: menu.name }})
    },
    renderSubMenu: function(h, menu) {
      const itemArr = []
      const children = menu.children
      if (!children || children.length === 0) {
        return null
      }
      const this_ = this
      const subMenu = h('span', { slot: 'title' }, [this.renderIcon(h, menu.icon), menu.name])
      itemArr.push(subMenu)
      children.forEach(function(item) {
        itemArr.push(this_.renderItem(h, item))
      })
      return h(AnchorLink, { props: { href: `#roleMenu_${menu.id}` }}, itemArr)
    },
    renderItem: function(h, menu) {
      return menu.parent === '1' && menu.children ? this.renderSubMenu(h, menu) : this.renderMenuItem(h, menu)
    },
    renderMenu: function(h, menuTree) {
      const this_ = this
      const menuArr = []
      menuTree.forEach(function(menu, i) {
        menuArr.push(this_.renderItem(h, menu))
      })
      return menuArr
    }
  },

  render(h) {
    return h(
      Anchor,
      { ref: 'anchor', props: { offsetTop: 16 }},
      [
        h(AnchorLink, { props: { href: '#sys-per', title: '系统权限' }}),
        h(AnchorLink, { props: { href: '#menu-per', title: '菜单权限' }}, this.renderMenu(h, this.menus))
      ]
    )
  }
}
