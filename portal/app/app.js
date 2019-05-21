import React from 'react';
import AppMenu from './app-menu'


class Dep {
    constructor() {
        this.watchers = []
    }

    depend() {
        if (Dep.watcher && this.watchers.indexOf(Dep.watcher) === -1) {
            this.watchers.push(Dep.watcher)
        }
    }

    notify() {
        this.watchers.forEach((watcher) => watcher.evaluate())
    }

    dirty() {
        this.watchers.forEach((watcher) => watcher.dirty = true)
    }
}

class Watcher {
    value;
    get;
    dirty;
    dep;

    constructor(get) {
        Object.assign(this, {
            value: null,
            get,

            dirty: true,
            dep: new Dep()
        })
    }

    evaluate() {
        if (this.dirty) return
        Dep.watcher = this
        !!this.get && (this.value = this.get.call())
        this.dep.dirty()
        Dep.watcher = null
    }

    depend() {
        this.dep.depend()
    }

    notify() {
        this.dep.notify()
    }
}


function defineReactive(data, key, val, fn) {
    const dep = new Dep()
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get: function () {
            dep.depend()
            return val
        },
        set: function (newVal) {
            if (newVal === val) return
            fn && fn(newVal)
            val = newVal
            dep.notify()
        },
    })
}

function initData(data) {
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
}

function computed(data, computed) {
    let keys = Object.keys(computed)
    keys.reduce((ret, key) => {
        const watcher = new Watcher(computed[key])

        Object.defineProperty(data, key, {
            configurable: true,
            enumerable: true,
            get: function () {
                watcher.depend()
                if (watcher.dirty) {
                    watcher.dirty = false
                    watcher.evaluate()
                }
                return watcher.value
            },
            set: function () {
            },
        })
        return ret

    }, {})
}

const hero = {
    a: 111,
    b: 222,
    c: 333,
    d: 444,
}

initData(hero)

computed(hero, {
    ab() {
        console.log('----------------reset ab-----------------')
        return hero.a + '' + hero.b
    },
    cd() {
        console.log('----------------reset cd-----------------')
        return hero.c + '' + hero.d
    },
    abab() {
        console.log('----------------reset abab-----------------')
        return hero.ab + '-->>' + hero.ab
    },
})

console.log('ab-->>', hero.ab)
console.log('ab-->>', hero.ab)
console.log('ab-->>', hero.ab)
console.log('abab-->>', hero.abab)
console.log('abab-->>', hero.abab)

console.log('')
console.log('||||||||||||||||||||||||||||||||')
console.log('')

console.log('set a=aaa')
hero.a = 'aaa'
console.log('ab-->>', hero.ab)

console.log('')
console.log('||||||||||||||||||||||||||||||||')
console.log('')

console.log('set b=bbb')
hero.b = 'bbb'
console.log('ab-->>', hero.ab)
console.log('abab-->>', hero.abab)

console.log('')
console.log('||||||||||||||||||||||||||||||||')
console.log('')

console.log('set a=111,b=222')
hero.a = '111'
hero.b = '222'
console.log('ab-->>', hero.ab)
console.log('ab-->>', hero.ab)
console.log('ab-->>', hero.ab)
console.log('abab-->>', hero.abab)
console.log('abab-->>', hero.abab)


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
        // console.log(this.state.data)
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

