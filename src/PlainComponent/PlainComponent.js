import {$utils, merge} from "../scripts/utils";
import {sharedPropertyDefinition} from "./proxy";

import {Dep} from "../../portal/app/vue-reactive/Dep";
import {Watcher} from "../../portal/app/vue-reactive/Watcher";

const HoolNames = ['created', 'mounted', 'beforeDestroyed', 'destroyed']

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
    const mixins = (!!ctx.mixins ? ctx.mixins() : []) || []
    mixins.push(ctx)
    let hook = {created: null, mounted: null, beforeDestroyed: null, destroyed: null}
    const datas = mixins.reduce((ret, item) => {
        const itemData = pl_getFromContext(item);
        HoolNames.forEach((name) => {
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
    HoolNames.forEach(name => !hook[name] && delete hook[name])
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
    const exclude = ['$props', '_props']
    ctx.state = Object.assign({}, ctx.state, ctx.__data__.data)
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

function pl_initMethods(ctx) {
    const methods = ctx.__data__.methods
    Object.keys(methods).forEach(key => {
        Object.defineProperty(ctx, key, {
            enumerable: true,
            writable: true,
            value: (...args) => methods[key].apply(ctx, args)
        })
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

