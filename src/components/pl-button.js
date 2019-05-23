import {PlainComponent} from "../PlainComponent/PlainComponent";

export class PlButton extends PlainComponent {

    static defaultProps = {
        type: 'fill',
        color: 'primary',
        shape: 'fillet',
        size: 'default',
        label: null,
    }

    data() {
        return {
            a: -1,
            b: -2,

            count: 0,
        }
    }

    created() {
        // console.log('button created', this)
    }

    watch() {
        return {
            a(newVal, oldVal) {
                console.log(`a change from [${oldVal}] to [${newVal}]`)
            },
            b(newVal, oldVal) {
                console.log(`b change from [${oldVal}] to [${newVal}]`)
            },
            label(newVal, oldVal) {
                console.log(`label change from [${oldVal}] to [${newVal}]`)
            },
        }
    }

    computed() {
        return {
            ab() {
                console.log('reset ab')
                return this.a + '--' + this.b
            },
            abab() {
                console.log('reset abab')
                return this.ab + '--' + this.ab
            },
        }
    }

    methods() {
        return {
            pl_click(e) {
                console.dir(e)
                console.log(this)
            },
            multiChangeA() {
                this.a = ++this.count
                this.a = ++this.count
                this.a = ++this.count
                this.a = ++this.count
            },
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.pl_click}>
                    {this.label}
                </button>
                <div>
                    [count]={this.count}
                </div>
                <div>
                    [a]={this.a}
                </div>
                <div>
                    [b]={this.b}
                </div>
                <div>
                    [ab]={this.ab}
                </div>
                <div>
                    [abab]={this.abab}
                </div>
                <div>
                    <button onClick={() => this.count++}>count ++</button>
                </div>
                <div>
                    <button onClick={() => this.a = ++this.count}>+ a</button>
                </div>
                <div>
                    <button onClick={() => this.b = ++this.count}>+ b</button>
                </div>
                <div>
                    <button onClick={() => console.log(this.ab)}>log ab</button>
                </div>
                <div>
                    <button onClick={() => console.log(this.abab)}>log abab</button>
                </div>
                <div>
                    <button onClick={this.multiChangeA}>multi change a</button>
                </div>
            </div>
        )
    }
}