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
                        {this.aaa}-{this.bbb}
                        <button onClick={val => this.pl_click()}>change a</button>
                    </div>
                </div>
            </div>
        )
    }

    pl_click() {
        this.aaa = '20200202'
        console.log(this)
    }


}

