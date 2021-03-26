import { Card, Divider, Icon } from 'ant-design-vue/es'
import Checkbox from 'ant-design-vue/es/checkbox'
import CheckboxGroup from 'ant-design-vue/es/checkbox/Group'

export default {
  name: 'MenuRoleCheck',
  props: {
    menus: {
      type: Array,
      required: true,
      default: []
    },
    fucs: {
      type: Object,
      required: true,
      default: []
    },
    pes: {
      type: Array,
      required: false,
      default: []
    }
  },
  data() {
    return {
      permissions: this.pes,
      tmp: {}
    }
  },
  computed: {
  },
  created() {
  },
  watch: {
  },
  methods: {
    renderIcon: function(h, icon) {
      return !icon || icon == 'none' ? null : h(Icon, { class: 'mr-1', props: { type: icon }})
    },
    renderMenuItem: function(h, menu) {
      const this_ = this
      const fucs = this.fucs[menu.id]
      if (!fucs || fucs.length === 0) {
        return
      }
      const options = [] // 功能权限显示
      const optionsChecked = [] // 功能权限所有Id
      const checked = [] // 功能权限选中的值
      const resultChecked = [] // 需要返回的值
      fucs.forEach(item => {
        const Id = item.id
        if (this.permissions.includes(Id)) { // 包含的加入
          checked.push(Id)
        }
        optionsChecked.push(Id)
        options.push({ label: item.name, value: Id })
      })
      const router = menu.router
      const isMenuChecked = this.permissions.includes(menu.id) // 是否包含菜单
      if (isMenuChecked) {
        resultChecked.push(menu.id)
      }
      if (!this.tmp[router] || this.tmp[router].length == 0) {
        this.$set(this.tmp, router, { optionsChecked, checked, menuId: menu.id, menuChecked: isMenuChecked, resultChecked: resultChecked.concat(checked) })
      }
      const config = {
        props: {
          options,
          value: this.tmp[router].checked
        },
        on: { change: (values) => this_.checkChange(router, values) }
      }
      return h(
        Card, { class: 'mb-2' },
        [
          h(Checkbox, { slot: 'title', props: { checked: this_.tmp[router].menuChecked }, on: { change: (e) => this_.menuCheckChange(router, e) }}, menu.name), // 头部插槽
          h('a', { slot: 'extra', on: { click: () => this_.checkAll(router) }}, '全选'), // 右侧插槽
          h(CheckboxGroup, // checkbox组
            config // 配置
          )
        ]
      )
    },
    renderSubMenu: function(h, menu) {
      const itemArr = []
      const children = menu.children
      if (!children || children.length === 0) {
        return itemArr
      }
      const this_ = this
      const subItem = h(Divider,
        { props: { orientation: 'left' }},
        [
          this_.renderIcon(h, menu.icon),
          menu.name
        ]
      )
      itemArr.push(subItem)
      children.forEach(function(item) {
        itemArr.push(this_.renderItem(h, item))
      })
      return itemArr
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
      console.log(menuArr)
      return menuArr
    },
    /**
     * 全选
     * @author lyc
     * @date 2021年3月25日17:42:50
     */
    checkAll(router) {
      const tmp = this.tmp[router]
      const checked = tmp.optionsChecked.slice()
      tmp.checked = checked // 功能权限选中

      tmp.menuChecked = true // 菜单选中
      tmp.resultChecked = [...checked, tmp.menuId]// 返回值
      console.log(tmp.checked)
      console.log(tmp.resultChecked)
    },
    /**
     * 点击checkbox
     * @author lyc
     * @date 2021年3月25日17:42:50
     */
    checkChange(router, values) {
      const tmp = this.tmp[router]
      tmp.checked = values.slice() // 选中
      tmp.resultChecked = values.slice()// 返回值
      if (tmp.menuChecked) { // 如果菜单选中则加入
        tmp.resultChecked.push(tmp.menuId)
      }
      console.log(tmp.checked)
      console.log(tmp.resultChecked)
    },
    /**
     * 点击菜单的checkbox
     * @author lyc
     * @date 2021年3月25日17:42:50
     */
    menuCheckChange(router, e) {
      const isChecked = e.target.checked

      this.tmp[router].menuChecked = isChecked
    }
  },
  render(h) {
    return h(
      'div',
      this.renderMenu(h, this.menus)
    )
  }
}
