import React from 'react';
import AppMenu from './app-menu'

export default class App extends React.Component {
    render() {
        return (
            <div className="app">
                <div className="app-header">
                    <h3>PLAIN for React</h3>
                </div>
                <div className="app-body">
                    <div className="app-left">
                        <AppMenu/>
                    </div>
                    <div className="app-right">
                        right
                    </div>
                </div>
            </div>
        )
    }
}

