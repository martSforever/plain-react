import AppMenu from './app-menu'
import {PlButton} from "../../src/components/pl-button";
import {PlIcon} from "../../src/components/pl-icon";
import {Component} from "../../src/scripts/utils";
import {PlEditControl} from "../../src/components/pl-edit-control";


export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            p_value: 'hello'
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
                        [this.state.p_value]:{this.state.p_value}
                        <input value={this.state.p_value || ''} onChange={e => this.setState({p_value: e.target.value})}/>
                        <PlButton label={this.state.p_value}/>
                        {/*<PlIcon {...{icon: 'pad-check'}}/>
                        <PlEditControl {...this.editBinding} {...this.editListening}/>*/}
                    </div>
                </div>
            </div>
        )
    }

}

