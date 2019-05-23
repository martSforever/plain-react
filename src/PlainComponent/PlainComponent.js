import {$utils} from "../scripts/utils";
import {proxy} from "./proxy";

const dataKey = 'state'

function pl_initData(ctx, dataFunc) {
    dataFunc = dataFunc || $utils.noop
    ctx[dataKey] = dataFunc.apply(ctx) || {}
    Object.keys(ctx[dataKey]).forEach(key => {
        proxy(ctx, dataKey, key)
    })
}

function pl_initProps(ctx) {
    if (!ctx.props || Object.keys(ctx.props).length === 0) return
    Object.keys(ctx.props).forEach(key => {
        proxy(ctx, 'props', key)
    })
}

function pl_initMethods(ctx) {
    if (!ctx.methods || Object.keys(ctx.methods).length === 0) return
    Object.keys(ctx.methods).forEach(methodKey => {
        const func = ctx.methods[methodKey]
        ctx.methods[methodKey] = function (...args) {
            return func.apply(ctx, args)
        }
    })
    ctx.$methods = ctx.methods
    delete ctx.methods
    Object.keys(ctx.$methods).forEach(key => {
        proxy(ctx, '$methods', key)
    })
}



export class PlainComponent extends React.Component {

    constructor(props) {
        super(props)
        pl_initData(this, this.data)
        pl_initProps(this)
        setTimeout(() => {
            pl_initMethods(this)
            this.forceUpdate()
            !!this.created && this.created()
        }, 0)
    }

    componentDidMount = () => !!this.mounted && this.mounted()

}

