import axios from 'axios'

let api = axios.create({
    baseURL: 'http://localhost:3000/api/',
    withCredentials: true,
    timeout: 200000

})

api.post('http://localhost:3000/login', {

    email: 'test@gmail.com',
    password: '1234'
})

//register all data here
let state = {
    boards: [{ name: 'this is crap' }],
    activeBoard: {},
    error: {},
    activeLists: [],
    activeCards: []
}




let handleError = (err) => {
    state.error = err
}



export default {
    //all data lives in the state
    state,
    //actions are responsible for managing all async requests
    actions: {
        getBoards() {
            api('boards').then(res => {
                state.boards = res.data.data
            }).catch(handleError)
        },
        getBoard(id) {
            let vm = this
            api('boards/' + id)
                .then(res => {
                    state.activeBoard = res.data.data
                    vm.getLists(id)
                   
                })
                
              
                .catch(handleError)
        },
        createBoard(board) {
            api.post('boards/', board)
                .then(res => {
                    this.getBoards()
                })
                .catch(handleError)
        },
        removeBoard(board) {
            api.delete('boards/' + board._id)
                .then(res => {
                    this.getBoards()
                })
                .catch(handleError)
        },
        getLists(id) {
            let vm = this
            api('boards/' + id + '/lists')
                .then(res => {
                    state.activeLists = res.data.data
                    let lists = res.data.data
                    lists.forEach(list => {
                        vm.getCards(list._id)
                    })
                    // vm.getCards(id)
                    console.log(state.activeLists)
                })

        },
        createList(list, boardId) {
            api.post('lists', list)
                .then(res => {
                    this.getLists(boardId)
           
                })
                .catch(handleError)
        },
        removeList(list, boardId) {
            api.delete('lists/' + list._id)
                .then(res => {
                    this.getLists(boardId)
                })
                .catch(handleError)
        },
        getCards(id) {
            api('lists/' + id + '/cards')
                .then(res => {
                    state.activeCards.push(res.data.data)
                    console.log(res.data.data)
                })
        },

        createCard(card, boardId) {
            api.post('cards/', card)
                .then(res => {
                    this.getLists(boardId)
                    // debugger 
                }).then(()=>{
                    this.getCards(card.listId)
                })
                .catch(handleError)
        },
        removeCard(card, cardId) {
            api.delete('cards/' + card._id)
                .then(res => {
                    this.getCards(listId)
                })
                .catch(handleError)
        }
    }
}