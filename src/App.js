import React, {Component} from "react"
import "./App.css"
import Main from "./containers/Main/Main"
import {BrowserRouter} from "react-router-dom"

//REDUX
import {createStore, applyMiddleware, compose} from "redux"
import thunk from "redux-thunk"
import reducer from "./store/reducer"
import {Provider} from "react-redux"

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<div className='App'>
						<Main />
					</div>
				</BrowserRouter>
			</Provider>
		)
	}
}

export default App
