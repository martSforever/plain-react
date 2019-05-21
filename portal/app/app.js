import React from 'react';
import AppMenu from './app-menu'

import {changeA, changeB, getCount} from "./vue-reactive/vue-reactive";

export default class App extends React.Component {

    data() {
        return {
            a: 111,
            b: 222,
            c: 333,
            d: 444,
        }
    }

    constructor(props) {
        super(props)
        const data = this.data()
        this.state = {
            data,
        }
    }

    componentDidMount() {
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
                        {/*<input type="text" value={this.state.a} onChange={e => this.pl_change(e, 'a')}/>*/}
                        {/*<input type="text" value={this.state.b} onChange={e => this.pl_change(e, 'b')}/>*/}

                        <button onClick={() => changeA(getCount())}>change A</button>
                        <button onClick={() => changeB(getCount())}>change B</button>
                    </div>
                </div>
            </div>
        )
    }

    pl_change(e, name) {
        /*e事件对象在pl_change执行完之后，里面的东西会被置空*/
        this.setState({[name]: e.target.value})
    }
}

