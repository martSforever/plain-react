import {$utils} from "../scripts/utils";
import {proxy} from "./proxy";

import {Dep} from "../../portal/app/vue-reactive/Dep";
import {Watcher} from "../../portal/app/vue-reactive/Watcher";

function definedReactive(data, key, val) {
    const dep = new Dep()
    Object.defineProperty(data, key, {
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
}

function pl_initData(ctx) {
    ctx.state = !!ctx.data ? ctx.data() : {}
    Object.keys(ctx.state).forEach(key => {
        definedReactive(ctx.state, key, ctx.state[key])
        proxy(ctx, 'state', key)
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


export class PlainComponent extends React.Component {

    constructor(props) {
        super(props)
        pl_initData(this)
        pl_initProps(this)
        pl_initMethods(this)
        !!this.created && this.created()
    }

    componentDidMount = () => !!this.mounted && this.mounted()

}

