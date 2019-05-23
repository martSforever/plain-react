import {$utils} from "../scripts/utils";
import {sharedPropertyDefinition, proxy} from "./proxy";

import {Dep} from "../../portal/app/vue-reactive/Dep";
import {Watcher} from "../../portal/app/vue-reactive/Watcher";

function pl_initProps(ctx) {
    ctx.state = ctx.state || {}
    const _props = {...(ctx.props || {})}
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
    ctx.state = Object.assign({}, ctx.state, !!ctx.data ? ctx.data() : {})
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
    const methods = !!ctx.methods ? ctx.methods() : {}
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
    const computed = !!ctx.computed ? ctx.computed() : {}
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
    const watch = !!ctx.watch ? ctx.watch() : {}
    Object.keys(watch).forEach(key => new Watcher(ctx, key, key, watch[key], true))
}


export class PlainComponent extends React.Component {

    constructor(props) {
        super(props)
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

