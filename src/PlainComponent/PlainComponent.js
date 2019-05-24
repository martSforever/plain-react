import {$utils, classnames, merge} from "../scripts/utils";
import {sharedPropertyDefinition} from "./proxy";

import {Dep} from "../../portal/app/vue-reactive/Dep";
import {Watcher} from "../../portal/app/vue-reactive/Watcher";
import $plain from 'src/index'

const HookNames = ['created', 'mounted', 'beforeDestroyed', 'destroyed']

/**
 * 初始化上下文数据，一个组件可能会有多个mixin，一个mixin算一个上下文，组件自己也是一个上下文
 * @author  韦胜健
 * @date    2019/5/23 19:06
 */
function pl_getFromContext(ctx) {
    if ($utils.typeOf(ctx) === 'function') ctx = new ctx()

    const props = {...(ctx.props || {})}
    const state = ctx.state || {}
    const data = !!ctx.data ? ctx.data() : {}
    const methods = !!ctx.methods ? ctx.methods() : {}
    const computed = !!ctx.computed ? ctx.computed() : {}
    const watch = !!ctx.watch ? ctx.watch() : {}

    const created = ctx.created
    const mounted = ctx.mounted
    const beforeDestroyed = ctx.beforeDestroyed
    const destroyed = ctx.destroyed

    return {
        props, state, data, methods, computed, watch, created, mounted, beforeDestroyed, destroyed,
    }
}

/**
 * 初始化组件数据，合并所有的上下文，将props, state, data, methods, computed, watch深度合并，将 created, mounted, beforeDestroyed, destroyed等钩子函数嵌入合并；
 * @author  韦胜健
 * @date    2019/5/23 19:07
 */
function pl_initContextDatas(ctx) {
    const mixins = (!!ctx.mixins ? ctx.mixins() : []) || []
    mixins.push(ctx)
    let hook = {created: null, mounted: null, beforeDestroyed: null, destroyed: null}
    const datas = mixins.reduce((ret, item) => {
        const itemData = pl_getFromContext(item);
        HookNames.forEach((name) => {
            const hookFunc = hook[name]
            const itemHookFunc = itemData[name]
            hook[name] = (!hookFunc && !itemHookFunc) ? null : () => {
                !!hookFunc && hookFunc.apply(ctx)
                !!itemData[name] && itemHookFunc.apply(ctx)
            }
        })
        ret.push(itemData)
        return ret
    }, [])
    // console.log(datas)
    ctx.__data__ = merge.all(datas)
    HookNames.forEach(name => !hook[name] && delete hook[name])
    Object.assign(ctx, hook)
}

/**
 * 检查名称是否已经被使用
 * @author  韦胜健
 * @date    2019/5/23 20:00
 */
function pl_checkKeyNames(checkObj, targetObj, checkName, targetName) {
    const targetKeys = Object.keys(targetObj)
    Object.keys(checkObj).forEach(checkKey => {
        if (targetKeys.indexOf(checkKey) > -1) {
            console.log(checkKey, checkObj, targetObj)
            throw new Error(`${checkName}: ${checkKey} has already been defined as a ${targetName} property`)
        }
    })
}

/**
 * 初始化props，并响应式监听依赖
 * @author  韦胜健
 * @date    2019/5/23 19:09
 */
function pl_initProps(ctx) {
    ctx.state = ctx.__data__.state
    const _props = {...ctx.__data__.props}
    ctx.state._props = _props
    ctx.state.$props = (props) => Object.assign(_props, props)
    Object.keys(_props).forEach(key => {
        const dep = new Dep()
        let val = _props[key]
        Object.defineProperty(_props, key, {
            configurable: true,
            enumerable: true,
            get: function () {
                dep.depend()
                return val
            },
            set: function (newVal) {
                if (newVal === val) return
                val = newVal
                dep.notify()
            },
        })
        sharedPropertyDefinition.get = function getter() {
            return ctx.state._props[key]
        }
        sharedPropertyDefinition.set = function setter(val) {
            ctx.state._props[key] = val
        }
        Object.defineProperty(ctx, key, sharedPropertyDefinition)
    })
}

/**
 * 初始化data，保存到state中，并响应式监听依赖
 * @author  韦胜健
 * @date    2019/5/23 19:10
 */
function pl_initData(ctx) {
    const exclude = ['$props', '_props']
    ctx.state = Object.assign({}, ctx.state, ctx.__data__.data)
    pl_checkKeyNames(ctx.state, ctx.__data__.props, 'Data', 'props')
    Object.keys(ctx.state).forEach(key => {
        if (exclude.indexOf(key) > -1) return
        const dep = new Dep()
        let val = ctx.state[key]
        Object.defineProperty(ctx, key, {
            configurable: true,
            enumerable: true,
            get: function () {
                dep.depend()
                return val
            },
            set: function (newVal) {
                if (newVal === val) return
                val = newVal
                ctx.setState({[key]: val})
                dep.notify()
            },
        })

    })
}

/**
 * 初始化methods函数，代理触发函数，同时将函数执行的上下文设置为当前组件
 * @author  韦胜健
 * @date    2019/5/23 19:10
 */
function pl_initMethods(ctx) {
    const methods = ctx.__data__.methods
    pl_checkKeyNames(methods, ctx.__data__.props, 'Methods', 'props')
    pl_checkKeyNames(methods, ctx.state, 'Methods', 'data')
    pl_checkKeyNames(methods, ctx.__data__.computed, 'Methods', 'computed')
    Object.keys(methods).forEach(key => {
        Object.defineProperty(ctx, key, {
            enumerable: true,
            writable: true,
            value: (...args) => methods[key].apply(ctx, args)
        })
    })
}

/**
 * 初始化计算属性
 * @author  韦胜健
 * @date    2019/5/23 19:11
 */
function pl_initComputed(ctx) {
    const computed = ctx.__data__.computed
    pl_checkKeyNames(computed, ctx.__data__.props, 'Computed', 'props')
    pl_checkKeyNames(computed, ctx.state, 'Computed', 'data')
    Object.keys(computed).forEach(key => {
        const getter = () => {
            if (!computed[key]) return
            return computed[key].apply(ctx)
        }
        const watcher = new Watcher(ctx, key, getter)
        Object.defineProperty(ctx, key, {
            configurable: true,
            enumerable: true,
            get: function () {
                if (watcher.dirty) {
                    watcher.evaluate()
                }
                if (Dep.target) {
                    watcher.depend()
                }
                return watcher.value
            },
            set: $utils.noop
        })
    })
}

/**
 * 初始化监听属性
 * @author  韦胜健
 * @date    2019/5/23 19:11
 */
function pl_initWatch(ctx) {
    const watch = ctx.__data__.watch
    Object.keys(watch).forEach(key => new Watcher(ctx, key, key, watch[key], true))
}


export class PlainComponent extends React.Component {

    $plain = $plain

    constructor(props) {
        super(props)
        pl_initContextDatas(this)
        pl_initProps(this)
        pl_initData(this)
        pl_initMethods(this)
        pl_initComputed(this)
        pl_initWatch(this)
        !!this.created && this.created()
    }

    componentDidMount = () => !!this.mounted && this.mounted()

    static getDerivedStateFromProps(props, state) {
        state.$props(props)
        return null
    }

    classnames(...args) {
        return classnames(...args)
    }

    $emit(name, ...args) {
        // console.log('emit', `on${name.charAt(0).toUpperCase() + name.substring(1)}`)
        !!this[name] && this[`on${name.charAt(0).toUpperCase() + name.substring(1)}`](...args)
    }
}

