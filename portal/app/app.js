import React from 'react';
import AppMenu from './app-menu'

export default class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            a: '111',
            b: '222',
            c: '333',
            d: '444',
        }
    }

    componentDidMount() {
        console.log('mounted')
    }

    componentWillUnmount() {
        console.log('destroyed')
    }

    get ab() {
        console.log('ab')
        return this.state.a + '' + this.state.b
    }

    get cd() {
        console.log('cd')
        return this.state.c + '' + this.state.d
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
                        <input type="text" value={this.state.a} onChange={e => this.pl_change(e, 'a')}/>
                        <input type="text" value={this.state.b} onChange={e => this.pl_change(e, 'b')}/>
                        ab:[{this.ab}]----cd:[{this.cd}]
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

