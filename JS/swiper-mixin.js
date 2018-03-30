export const SwiperMixin = {
  data () {
    const self = this
    return {
      barWidths: [],
      activeBar: true,
      activeBarWidth: 0,
      progress: 0,
      initOption: {
        noSwiping: true,
        touchAngl: 5,
        iOSEdgeSwipeDetection: true,
        watchSlidesProgress: true,
        resistanceRatio: 0,
        on: {
          slideChangeTransitionStart: function () {
            self.selectedTab = this.activeIndex
          },
          touchStart: function () {
            self.progress = this.progress
          },
          touchMove: function () {
            if (!self.activeBar) {
              return
            }
            if (self.progress < this.progress) {
              self.moveActiveBar2(self.selectedTab, (self.selectedTab + 1), this.slides[self.selectedTab].progress)
            } else {
              self.moveActiveBar2(self.selectedTab, (self.selectedTab - 1), this.slides[self.selectedTab].progress)
            }
          },
          transitionStart: function () {
            if (!self.activeBar) {
              return
            }
            self.moveActiveBar2(self.selectedTab, this.activeIndex, 1, true)
          }
        }
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    option () {
      let swiperOption = this.swiperOption || {}
      return Object.assign(this.initOption, swiperOption)
    }
  },
  methods: {
    moveActiveBar (index, progress = 1) {
      if (this.barWidths.length === 0) {
        let topHeadList = document.querySelectorAll('.top-head')
        this.activeBarWidth = document.querySelector('.active-bar').offsetWidth
        this.barWidths.push(0)
        for (let i = 1; i < topHeadList.length; i++) {
          const w = topHeadList[i].offsetWidth / 2
          const preW = topHeadList[i - 1].offsetWidth / 2
          this.barWidths.push(w + preW)
        }
      }
      let disc = 0
      for (let i = 0; i <= index; i++) {
        if (i === index) {
          disc += this.barWidths[i] * progress
        } else {
          disc += this.barWidths[i]
        }
      }
      this.$refs.activeBar.style.transform = `translateX(${disc}px)`
    },
    moveActiveBar3 (index, nextIndex, progress = 1) {
      if (this.barWidths.length === 0) {
        let topHeadList = document.querySelectorAll('.top-head')
        this.activeBarWidth = document.querySelector('.active-bar').offsetWidth
        this.barWidths.push(0)
        for (let i = 1; i < topHeadList.length; i++) {
          const w = topHeadList[i].offsetWidth / 2
          const preW = topHeadList[i - 1].offsetWidth / 2
          this.barWidths.push(w + preW)
        }
      }
      let disc = this.barWidths.reduce((sum, value, i) => {
        if (i <= nextIndex) {
          return sum + value
        } else {
          return sum
        }
      })
      if (progress === 1) {
        this.$refs.activeBar.style.transition = 'all 0.3s'
        this.$refs.activeBar.style.width = `${this.activeBarWidth}px`
        this.$refs.activeBar.style.transform = `translateX(${disc}px)`
      }
      let width = 0
      if (index < nextIndex && progress !== 1) {
        // 向右
        this.$refs.activeBar.style.transition = 'all 0s'
        width = this.activeBarWidth + this.barWidths[nextIndex] * progress
        this.$refs.activeBar.style.width = `${width}px`
      } else if (index > nextIndex && progress !== 1) {
        // 向左
        this.$refs.activeBar.style.transition = 'all 0s'
        width = this.activeBarWidth + this.barWidths[index] * Math.abs(progress)
        this.$refs.activeBar.style.transform = `translateX(${disc + this.barWidths[index] + this.activeBarWidth - width}px)`
        this.$refs.activeBar.style.width = `${width}px`
      }
    },
    moveActiveBar2 (index, nextIndex, progress = 1, callByClick = false) {
      if (this.barWidths.length === 0) {
        let topHeadList = document.querySelectorAll('.top-head')
        this.activeBarWidth = document.querySelector('.active-bar').offsetWidth
        this.barWidths.push(0)
        for (let i = 1; i < topHeadList.length; i++) {
          const w = topHeadList[i].offsetWidth / 2
          const preW = topHeadList[i - 1].offsetWidth / 2
          this.barWidths.push(w + preW)
        }
      }
      let disc = this.barWidths.reduce((sum, value, i) => {
        if (i <= nextIndex) {
          return sum + value
        } else {
          return sum
        }
      })
      if (callByClick) {
        this.$refs.activeBar.style.transition = 'all 0.3s'
        this.$refs.activeBar.style.width = `${this.activeBarWidth}px`
        this.$refs.activeBar.style.transform = `translateX(${disc}px)`
      }
      let width = 0
      if (index < nextIndex && !callByClick) {
        // 向右
        if (progress <= 0.5) {
          this.$refs.activeBar.style.transition = 'all 0s'
          width = this.activeBarWidth + this.barWidths[nextIndex] * progress * 2
          this.$refs.activeBar.style.width = `${width}px`
        } else {
          this.$refs.activeBar.style.transition = 'all 0s'
          width = this.activeBarWidth + this.barWidths[nextIndex] * (1 - progress) * 2
          this.$refs.activeBar.style.transform = `translateX(${disc + this.activeBarWidth - width}px)`
          this.$refs.activeBar.style.width = `${width}px`
        }
      } else if (index > nextIndex && !callByClick) {
        // 向左
        if (Math.abs(progress) <= 0.5) {
          this.$refs.activeBar.style.transition = 'all 0s'
          width = this.activeBarWidth + this.barWidths[index] * Math.abs(progress) * 2
          this.$refs.activeBar.style.transform = `translateX(${disc + this.barWidths[index] + this.activeBarWidth - width}px)`
          this.$refs.activeBar.style.width = `${width}px`
        } else {
          this.$refs.activeBar.style.transition = 'all 0s'
          width = this.activeBarWidth + this.barWidths[index] * (1 - Math.abs(progress)) * 2
          this.$refs.activeBar.style.transform = `translateX(${disc}px)`
          this.$refs.activeBar.style.width = `${width}px`
        }
      }
    }
  },
  watch: {
    selectedTab (index, oldIndex) {
      if (!self.activeBar) {
        return
      }
      this.moveActiveBar2(oldIndex, index, 1, true)
    }
  }
}
