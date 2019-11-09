import copy from 'copy-to-clipboard'

export default {
  name: 'Menu',
  data () {
    return {
      event: null,
      el: null,
      isOnTop: true,
      menuLeft: 0,
      menuTop: 0,
      menuDirection: 'horizontal', // or vertical
      data: null,
      items: {
        copy: true
      },
      customItems: [] // [{menuName: '', handler: null}]
    }
  },
  methods: {
    closeMenu () {
      document.body.style.overflow = ''
      document.body.removeChild(this.$el)
      this.addActiveClass(false)
      this.$destroy()
    },
    copyEl () {
      copy(this.el.textContent)
      this.closeMenu()
    },
    packCustomHandler (handler) {
      if (typeof handler === 'function') {
        handler(this.data)
      }
      this.closeMenu()
    },
    addActiveClass(opt) {
      const el = this.el
      let cns = el.className.split(' ')
      let index = cns.indexOf('menu-active')
      if (opt) {
        if (index === -1) {
          cns.push('menu-active')
          el.className = cns.join(' ')
        }
      } else {
        if (index > -1) {
          cns.splice(index, 1)
          el.className = cns.join(' ')
        }
      }
    }
  },
  mounted () {
    this.addActiveClass(true)
    document.body.style.overflow = 'hidden'
  },
  render (h) {
    const {isOnTop, menuLeft, menuTop, items, customItems, menuDirection} = this
    return (
      <div class="menu-wrap">
        <div class="menu-mask" onClick={this.closeMenu}></div>
        <div
          style={`left: ${menuLeft}px;top: ${menuTop}px`}
          class={`menu ${isOnTop ? 'menu-top' : 'menu-bottom'} ${menuDirection === 'horizontal' ? 'menu-horizontal' : 'menu-vertical'}`}
        >
          {
            items['copy'] && <span class="menu-item" onClick={this.copyEl}>复制</span>
          }
          {
            customItems.map(item => (<span class="menu-item" onClick={this.packCustomHandler.bind(this, item.handler)}>{item.menuName}</span>))
          }
        </div>
      </div>
    )
  }
}