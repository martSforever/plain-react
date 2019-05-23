import {PlainComponent} from "../PlainComponent/PlainComponent";

export class PlButton extends PlainComponent {

    static staticProps = {
        type: 'fill',
        color: 'primary',
        shape: 'fillet',
        size: 'default',
        label: null,
    }

    data() {
        return {
            id: 'hello'
        }
    }

    methods() {
        return {
            async pl_click(e) {
                console.dir(e)
                console.log(this)
            },
        }
    }

    render() {
        return (
            <button onClick={this.pl_click}>
                {this.label}
            </button>
        )
    }
}