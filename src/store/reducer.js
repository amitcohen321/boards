import * as actionTypes from "./actionTypes"

const initialState = {
	boards: [],
	loading: false,
	boardCreated: false,
	error: false,
	auth: {
		token: null,
		localId: null,
		expirationDate: null
	},
	redirect: {
		needsRedirect: false,
		redirectTo: "/"
	}
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		// Boards create cases
		case actionTypes.SEND_BOARD_START:
			return {
				...state,
				loading: true
			}

		case actionTypes.SEND_BOARD_SUCCESS:
			// const newBoard = {
			// 	id: action.boardId,
			// 	boardData: action.boardData
			// }
			return {
				...state,
				loading: false,
				boardCreated: true,
				error: null
			}

		case actionTypes.SEND_BOARD_FAIL:
			return {
				...state,
				loading: false,
				error: true
			}

		// Boards fetch cases
		case actionTypes.FETCH_BOARDS_START:
			return {
				...state,
				loading: true
			}

		case actionTypes.FETCH_BOARDS_SUCCESS:
			return {
				...state,
				boards: action.fetchedBoards,
				loading: false,
				error: null
			}

		case actionTypes.FETCH_BOARDS_FAIL:
			return {
				...state,
				loading: false,
				error: true
			}

		case actionTypes.DELETE_BOARD_SUCCESS:
			const idxToDel = state.boards.findIndex(board => {
				return board.id === action.deletedBoardId
			})
			return {
				...state,
				error: null,
				boards: state.boards.filter((item, index) => {
					if (index === idxToDel) {
						return false
					}
					return true
				})
			}

		case actionTypes.DELETE_BOARD_FAIL:
			return {
				...state,
				error: true
			}

		// AUTH CASES //

		case actionTypes.AUTH_START:
			return {
				...state,
				loading: true
			}

		case actionTypes.AUTH_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				auth: {
					...state.auth,
					token: action.authData.idToken,
					localId: action.authData.localId,
					expirationDate: action.authData.expirationDate
				}
			}

		case actionTypes.AUTH_FAIL:
			return {
				...state,
				loading: false,
				error: true
			}

		case actionTypes.AUTH_LOGOUT:
			return {
				...state,
				auth: {
					...state.auth,
					token: null,
					localId: null
				}
			}

		case actionTypes.NEEDS_REDIRECT:
			return {
				...state,
				redirect: {
					...state.redirect,
					needsRedirect: true,
					redirectTo: action.path
				}
			}

		case actionTypes.INITIALIZE_REDIRECT:
			return {
				...state,
				redirect: {
					...state.redirect,
					needsRedirect: false,
					redirectTo: "/"
				}
			}

		default:
			return state
	}
}

export default reducer
