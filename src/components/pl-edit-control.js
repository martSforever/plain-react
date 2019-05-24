import {PlainComponent} from "../PlainComponent/PlainComponent";
import {EditMixin} from "../mixins/mixins";

export class PlEditControl extends PlainComponent {

    render() {
        return (
            <div className="pl-edit-control" style={{display: this.isValid ? 'none' : 'block'}}>
                <span>{this.validMsg}</span>
            </div>
        );
    }

    mixins() {
        return [
            EditMixin
        ]
    }

    static defaultProps = {
        ...EditMixin.defaultProps,
        value: null,
    }

    watch() {
        return {
            value() {
                this.valid()
            },
        }
    }

    data() {
        return {
            validMsg: '输入格式不正确',
        }
    }

    mounted() {
        !!this.validOnInit && this.valid()
    }

    methods() {
        return {
            valid() {
                if (!this.rules && this.required === null) return {isValid: true};
                const {isValid, validMsg} = this.$plain.$valid.validate(this.value, this.required, this.rules)
                this.isValid = isValid
                this.validMsg = validMsg
                this.$emit('update:isValid', this.isValid)
                return {isValid, validMsg}
            },
            cancelValid() {
                this.isValid = true
                this.validMsg = null
                this.$emit('update:isValid', this.isValid)
            },
            setDisabled(flag = true) {
                this.$emit('update:p_disabled', flag)
            },
            setReadonly(flag = true) {
                this.$emit('update:p_readonly', flag)
            },
        }
    }
}