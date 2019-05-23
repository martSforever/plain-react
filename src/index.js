import './styles/index.scss'
import Service from './scripts/services'

const PlainReact = {
    p_theme: null,
    prefix: null,
    rootOption: null,
    zIndex: null,

    /*主题切换*/
    changeTheme(theme) {
        if (!!this.p_theme) this.$dom.removeClass(document.body, `pl-theme-${this.p_theme}`)
        this.$dom.addClass(document.body, `pl-theme-${theme}`)
        this.p_theme = theme
    },

    install({theme = 'default', prefix = 'pl', pageRegistry, iconfont, rootOption, zIndex = 3000} = {}) {
        this.p_theme = theme
        Service(this)
        this.changeTheme(theme)

        this.$utils.addScript('https://at.alicdn.com/t/font_948159_9jgozvpudu.js')                   //plain
        this.$utils.addScript('https://at.alicdn.com/t/font_1113642_w82jwgy9lk8.js')                 //ant-design
        !!iconfont && this.$utils.addScript(iconfont)
    },
}

export default PlainReact