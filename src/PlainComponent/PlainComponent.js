export class PlainComponent extends React.Component {
    constructor(props) {
        super(props)
        console.log('component', this.props)
        if (!!this.data) {
            console.log('data', this.data())
        }
    }
}