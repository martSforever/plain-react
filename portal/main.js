import ReactDOM from 'react-dom';
import App from './app/app.js'
import './main.scss'
import PlainReact from 'src/index'

PlainReact.install()

ReactDOM.render(<App/>, document.getElementById('root'))