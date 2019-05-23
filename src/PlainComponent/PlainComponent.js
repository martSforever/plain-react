import {$utils, merge} from "../scripts/utils";
import {sharedPropertyDefinition, proxy} from "./proxy";

import {Dep} from "../../portal/app/vue-reactive/Dep";
import {Watcher} from "../../portal/app/vue-reactive/Watcher";

function pl_getFromContext(ctx) {
    if ($utils.typeOf(ctx) === 'function') ctx = new ctx()

    const props = {...(ctx.props || {})}
    const state = ctx.state || {}
    const data = !!ctx.data ? ctx.data() : {}
    const methods = !!ctx.methods ? ctx.methods() : {}
    const computed = !!ctx.computed ? ctx.computed() : {}
    const watch = !!ctx.watch ? ctx.watch() : {}

    const created = ctx.created || $utils.noop
    const mounted = ctx.mounted || $utils.noop
    const beforeDestroyed = ctx.beforeDestroyed || $utils.noop
    const destroyed = ctx.destroyed || $utils.noop

    return {
        props,
        state,
        data,
        methods,
        computed,
        watch,

        created,
        mounted,
        beforeDestroyed,
        destroyed,
    }
}

function pl_initContextDatas(ctx) {
    const mixins = !!ctx.mixins ? ctx.mixins() : []
    mixins.push(ctx)
    let hook = {created: null, mounted: null, beforeDestroyed: null, destroyed: null}
    const datas = mixins.reduce((ret, item) => {
        const itemData = pl_getFromContext(item);
        ['created', 'mounted', 'beforeDestroyed', 'destroyed'].forEach((name) => {
            const hookFunc = hook[name]
            hook[name] = () => {
                !!hookFunc && hookFunc.apply(ctx)
                !!itemData[name] && itemData[name].apply(ctx)
            }
        })
        ret.push(itemData)
        return ret
    }, [])
    ctx.__data__ = merge.all(datas)
    Object.assign(ctx, hook)
}

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

function pl_initData(ctx) {
    ctx.state = Object.assign({}, ctx.state, ctx.__data__.data)
    Object.keys(ctx.state).forEach(key => {
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

function pl_initMethods(ctx) {
    const methods = ctx.__data__.methods
    ctx.$methods = {}
    Object.keys(methods).forEach(key => {
        const func = methods[key]
        ctx.$methods[key] = (...args) => func.apply(ctx, args)
    })
    Object.keys(ctx.$methods).forEach(key => {
        proxy(ctx, '$methods', key)
    })
}

function pl_initComputed(ctx) {
    const computed = ctx.__data__.computed
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

function pl_initWatch(ctx) {
    const watch = ctx.__data__.watch
    Object.keys(watch).forEach(key => new Watcher(ctx, key, key, watch[key], true))
}


export class PlainComponent extends React.Component {

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

}

