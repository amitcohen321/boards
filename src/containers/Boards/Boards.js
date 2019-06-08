import React, {Component} from "react"
import "./Boards.scss"
import BoardThumbnail from "../../components/BoardThumbnail/BoardThumbnail"
import Spinner from "../../components/Spinner/Spinner"
import "../../style/fonts.scss"

//REDUX
import {connect} from "react-redux"
import * as actionCreators from "../../store/actionCreators"

class Boards extends Component {
	state = {}

	// DELETE BOARD
	boardDeleteHandler = (event, id) => {
		this.props.onBoardDelete(id, this.props.authData.token)
	}

	// FETCH BOARDS LIST
	componentDidMount() {
		if (this.props.authData.token) {
			this.props.onBoardsInit(this.props.authData.token, this.props.authData.localId)
		}
	}

	render() {
		const boardsCollection = this.props.boards.map(board => {
			return (
				<BoardThumbnail
					key={board.id}
					board={board}
					boardDeleteHandler={this.boardDeleteHandler}
				/>
			)
		})

		if (this.props.loading) {
			return <Spinner />
		} else if (!this.props.authData.token) {
			this.props.history.push("/auth")
			return null
		} else {
			if (this.props.boards.length === 0) {
				return (
					<>
						<h3>No Boards</h3>
						<br />
						<h6>start by creating one in the top-right corner</h6>
					</>
				)
			} else {
				return (
					<>
						<h1 className='headline'>My Boards</h1>
						<div className='BoardsContainer'>{boardsCollection}</div>
					</>
				)
			}
		}
	}
}

const mapStateToProps = state => {
	return {
		board: state.curBoard,
		boards: state.boards,
		loading: state.loading,
		authData: state.auth
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onBoardsInit: (token, userId) => {
			dispatch(actionCreators.fetchBoards(token, userId))
		},
		onBoardDelete: (id, token) => {
			dispatch(actionCreators.deleteBoard(id, token))
		}
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Boards)
