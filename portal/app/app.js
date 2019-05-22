import AppMenu from './app-menu'
import {PlainComponent} from "../../src/PlainComponent/PlainComponent";


export default class App extends PlainComponent {

    static defaultProps = {
        name: '111',
        age: 20,
    }

    data() {
        return {
            aaa: 111,
            bbb: 222,
        }
    }

    watch = {}

    computed = {}

    methods = {}


    constructor(props) {
        super(props)
        console.log('app', this.props)
    }


    render() {
        return (
            <div className="app">

                <div className="app-header">
                    <h3>PLAIN for React</h3>
                </div>
                <div className="app-body">
                    <div className="app-left">
                        <AppMenu ref="menu"/>
                    </div>
                    <div className="app-right">
                        content
                    </div>
                </div>
            </div>
        )
    }


}

