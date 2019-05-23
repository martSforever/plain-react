import {PlainComponent} from "../PlainComponent/PlainComponent";
import {ThrottleMixin} from "../mixins/mixins";

export class PlButton extends PlainComponent {

    mixins() {
        return [ThrottleMixin]
    }

    static defaultProps = {
        type: 'fill',
        color: 'primary',
        shape: 'fillet',
        size: 'default',
        label: null,
        icon: null,
        active: null,
        
    }

    computed() {
        return {
            ab() {
                console.log('reset ab')
                return this.a + '--' + this.b
            },

        }
    }

    methods() {
        return {
            pl_click(e) {
                console.dir(e.target)
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