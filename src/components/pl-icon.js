import {PlainComponent} from "../PlainComponent/PlainComponent";

export class PlIcon extends PlainComponent {

    static defaultProps = {
        icon: null,
        loading: null,
        hover: null,
    }

    computed() {
        return {
            classes() {
                return this.classnames([
                    'pl-icon',
                    {
                        'pl-icon-enable-hover': this.hover,
                        'pl-icon-loading': this.loading,
                    }
                ])
            },

        }
    }

    render() {
        return (
            <div className={this.classes}>
                <svg className="pl-icon-svg" aria-hidden="true" onClick={e => !!this.onClick && this.onClick(e)}>
                    <use xlinkHref={`#${this.icon}`}>
                    </use>
                </svg>
            </div>
        );
    }
}