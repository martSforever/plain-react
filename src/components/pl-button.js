import {PlainComponent} from "../PlainComponent/PlainComponent";
import {PlEditControl} from "./pl-edit-control";
import {ThrottleMixin} from "../mixins/mixins";
import {PlIcon} from "./pl-icon";

export class PlButton extends PlainComponent {

    render() {
        return (
            <button onClick={this.pl_click}
                    className={this.classes}
                    type={this.buttonType}
                    aria-readonly={this.p_readonly || this.loading}
                    aria-disabled={this.p_disabled}
            >
                {
                    !!this.children ? this.children :
                        <div>
                            {!!this.icon && <PlIcon icon={this.icon}/>}
                            {!!this.label && <span>{this.label}</span>}
                        </div>
                }
                <PlEditControl {...this.editBinding} {...this.editListening}/>
            </button>
        )
    }

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
        loading: null,
        circle: null,
        long: null,
        noPadding: null,
        textAlign: 'center',
        buttonType: 'button',

        onClick: null,
    }

    computed() {
        return {
            classes() {
                return this.classnames([
                    'pl-button',
                    `pl-type-${this.type}`,
                    `pl-color-${this.color}`,
                    `pl-shape-${this.shape}`,
                    `pl-size-${this.size}`,
                    `pl-align-${this.textAlign}`,

                    {
                        'pl-button-long': this.long,
                        'pl-button-active': this.active,
                        'pl-button-loading': this.loading,
                        'pl-button-circle': this.circle,
                        'pl-button-no-padding': this.noPadding,
                        'pl-button-disabled': this.p_disabled,
                    },
                ])
            },
        }
    }

    methods() {
        return {
            pl_click(e) {
                !!this.onClick && this.onClick(e)
            },

        }
    }
}