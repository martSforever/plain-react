import {$utils} from "../scripts/utils";
import {proxy} from "./proxy";

import {Dep} from "../../portal/app/vue-reactive/Dep";
import {Watcher} from "../../portal/app/vue-reactive/Watcher";

function pl_initData(ctx) {
    ctx.state = !!ctx.data ? ctx.data() : {}
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
                if (newVal === ctx.state[key]) return
                val = newVal
                ctx.setState({[key]: val})
                dep.notify()
            },
        })

    })
}

function pl_initProps(ctx) {
    if (!ctx.props || Object.keys(ctx.props).length === 0) return
    Object.keys(ctx.props).forEach(key => {
        proxy(ctx, 'props', key)
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
        pl_initData(this)
        pl_initProps(this)
        pl_initMethods(this)
        pl_initComputed(this)
        pl_initWatch(this)
        !!this.created && this.created()
    }

    componentDidMount = () => !!this.mounted && this.mounted()

}

