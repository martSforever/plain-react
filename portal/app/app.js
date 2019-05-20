import React from 'react';
import AppMenu from './app-menu'

class Dep {
    constructor() {
        this.deps = []
    }

    depend() {
        if (Dep.target && this.deps.indexOf(Dep.target) === -1) {
            this.deps.push(Dep.target)
        }
    }

    notify() {
        this.deps.forEach((dep) => {
            dep()
        })
    }
}

Dep.target = null

class Observable {
    constructor(obj) {
        return this.walk(obj)
    }

    walk(obj) {
        const keys = Object.keys(obj)
        keys.forEach((key) => {
            this.defineReactive(obj, key, obj[key])
        })
        return obj
    }

    defineReactive(obj, key, val) {
        const dep = new Dep()
        Object.defineProperty(obj, key, {
            get() {
                dep.depend()
                return val
            },
            set(newVal) {
                val = newVal
                dep.notify()
            }
        })
    }
}

class Compute {

    /**
     * @author  韦胜健
     * @date    2019/5/20 20:35
     * @param   obj                 计算属性所属的对象
     * @param   key                 计算属性名称
     * @param   exec                  计算属性计算逻辑
     * @param   onChange            计算计算属性变化触发的函数
     */
    constructor(obj, key, exec, onChange) {
        this.obj = obj
        this.key = key
        this.exec = exec
        this.onChange = onChange
        return this.defineComputed()
    }

    defineComputed() {
        const self = this
        const onDepUpdated = () => {
            const val = self.exec()
            this.onChange(val)
        }

        Object.defineProperty(self.obj, self.key, {
            get() {
                Dep.target = onDepUpdated
                const val = self.exec()
                Dep.target = null
                return val
            },
            set() {
                console.error('计算属性无法被赋值！')
            }
        })
    }
}

const hero = new Observable({
    health: 3000,
    IQ: 150
})

new Compute(hero,
    'type',
    () => {
        console.log('get type')
        return hero.health > 4000 ? '坦克' : '脆皮'
    },
    (val) => {
        console.log(`我的类型是：${val}`)
    })

console.log(`英雄初始类型：${hero.type}`)
console.log(`英雄初始类型：${hero.type}`)
hero.health = 5000


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
        console.log(this.state.data)
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

