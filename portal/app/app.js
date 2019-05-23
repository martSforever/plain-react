import AppMenu from './app-menu'
import {PlainComponent} from "../../src/PlainComponent/PlainComponent";
import {PlButton} from "../../src/components/pl-button";


export default class App extends PlainComponent {

    data() {
        return {
            p_value: 'hello world'
        }
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
                        [this.p_value]:{this.p_value}
                        <input value={this.p_value || ''} onChange={e => this.p_value = e.target.value}/>
                        <PlButton label={this.p_value}/>
                    </div>
                </div>
            </div>
        )
    }

}

