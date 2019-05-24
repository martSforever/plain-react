import AppMenu from './app-menu'
import {PlButton} from "../../src/components/pl-button";
import {PlIcon} from "../../src/components/pl-icon";
import {Component} from "../../src/scripts/utils";
import {PlEditControl} from "../../src/components/pl-edit-control";
import {PlScroll} from "../../src/components/pl-scroll";


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
                        <PlButton label={this.state.p_value} icon="pad-check-square"/>
                        {['primary', 'success', 'warn', 'error', 'info'].map(color => <PlButton color={color} label={color} key={color}/>)}

                        <div style={{height: '300px', width: '300px', backgroundColor: '#f2f2f2'}}>
                            <PlScroll>
                                <div style={{height: '600px', width: '30px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',backgroundColor:'green',color:'white'}}>
                                    <span>hello world</span>
                                </div>
                            </PlScroll>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

