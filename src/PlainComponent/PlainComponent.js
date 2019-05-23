import {$utils} from "../scripts/utils";
import {proxy} from "./proxy";

const dataKey = 'state'

function pl_initData(dataFunc, ctx) {
    dataFunc = dataFunc || $utils.noop
    ctx[dataKey] = dataFunc.apply(ctx) || {}
    Object.keys(ctx[dataKey]).forEach(key => {
        proxy(ctx, dataKey, key)
    })
}

export class PlainComponent extends React.Component {
    constructor(props) {
        super(props)
        pl_initData(this.data, this)

        !!this.created && this.created()
    }

    componentDidMount = () => !!this.mounted && this.mounted()

}

