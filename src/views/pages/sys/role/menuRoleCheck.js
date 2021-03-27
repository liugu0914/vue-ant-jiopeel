import { Card, Icon, Checkbox } from 'ant-design-vue/es'
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
  watch: {
    pes(newValues) {
      this.permissions = newValues
    }
  },
  methods: {
    renderIcon: function(h, icon) {
      return !icon || icon == 'none' ? null : h(Icon, { class: 'mr-1', props: { type: icon }})
    },
    renderMenuItem: function(h, menu) {
      const this_ = this
      const menuId = menu.id // 菜单ID
      const permissionId = menu.permissionId // 权限ID
      const fucs = this.fucs[menuId] || [] // 菜单对应功能权限
      const isEmpty = !fucs || fucs.length === 0
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
      const router = permissionId
      const isMenuChecked = this.permissions.includes(permissionId) // 是否包含菜单
      if (isMenuChecked) {
        resultChecked.push(permissionId)
      }
      // if (!this.tmp[router] || this.tmp[router].length == 0) {
      this.$set(this.tmp, router, { optionsChecked, checked, permissionId, menuChecked: isMenuChecked, resultChecked: resultChecked.concat(checked) })
      // }
      const config = {
        props: {
          options,
          value: checked
        },
        on: { change: (values) => this_.checkChange(router, values) }
      }
      return h(
        Card, { attrs: { id: `roleMenu_${menuId}` }, class: 'mb-2' },
        [
          h(Checkbox, { slot: 'title', props: { checked: isMenuChecked }, on: { change: (e) => this_.menuCheckChange(router, e) }}, menu.name), // 头部插槽
          h('a', { slot: 'extra', on: { click: () => this_.checkAll(router) }}, '全选'), // 右侧插槽
          isEmpty ? null : h(CheckboxGroup, // checkbox组
            config // 配置
          )
        ]
      )
    },
    renderSubMenu: function(h, menu) {
      const itemArr = []
      const children = menu.children
      if (!children || children.length === 0) {
        return null
      }
      const this_ = this
      const subItem = h(Card,
        { attrs: { id: `roleMenu_${menu.id}` }, class: 'mb-1', props: { headStyle: { border: 0 }}},
        [
          h('span', { slot: 'title' }, [this_.renderIcon(h, menu.icon), menu.name]),
          h('a', { slot: 'extra', on: { click: () => this_.menuCheckAll(children) }}, '全选') // 右侧插槽
        ]
      )
      itemArr.push(subItem)

      children.forEach(function(item) {
        itemArr.push(this_.renderItem(h, item))
      })
      return h('div', itemArr)
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
      tmp.resultChecked = [...checked, tmp.permissionId]// 返回值
      this.handelResult()
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
        tmp.resultChecked.push(tmp.permissionId)
      }
      this.handelResult()
    },
    /**
     * 点击菜单的checkbox
     * @author lyc
     * @date 2021年3月25日17:42:50
     */
    menuCheckChange(router, e) {
      const tmp = this.tmp[router]
      const isChecked = e.target.checked

      tmp.menuChecked = isChecked
      if (tmp.menuChecked) { // 如果菜单选中则加入
        tmp.resultChecked.push(tmp.permissionId)
      } else {
        const index = tmp.resultChecked.indexOf(tmp.permissionId)
        tmp.resultChecked.splice(index, 1)
      }
      this.handelResult()
    },
    /**
     * 点击父级菜单的全选
     * @author lyc
     * @date 2021年3月25日17:42:50
     */
    menuCheckAll(children) {
      this.doMenuCheckAll(children)
      this.handelResult()
    },
    /**
     * 递归处理权限赋值
     * @author lyc
     * @date 2021年3月25日17:42:50
     */
    doMenuCheckAll(children) {
      children.forEach(item => {
        if (item.parent === '1' && item.children) { // 是父菜单
          this.doMenuCheckAll(item.children)
        } else {
          const tmp = this.tmp[item.permissionId]
          if (!tmp) {
            return true
          }

          tmp.menuChecked = true // 选中菜单本身
          tmp.checked = tmp.optionsChecked.slice() // 选中的
          tmp.resultChecked = [...tmp.optionsChecked.slice(), tmp.permissionId] // 结果
        }
      })
    },
    /**
     * 处理所有结果集
     * @author lyc
     * @date 2021年3月26日22:31:23
     */
    handelResult() {
      const newArr = []
      Object.values(this.tmp).forEach(item => {
        newArr.push(...item.resultChecked)
      })
      const permissionIds = new Set(newArr)
      this.permissions = Array.from(permissionIds)
      this.$emit('update:pes', this.permissions)
    }
  },
  render(h) {
    return h(
      'div',
      this.renderMenu(h, this.menus)
    )
  }
}
