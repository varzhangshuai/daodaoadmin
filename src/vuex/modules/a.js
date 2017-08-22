const state = {
  name: 'default',
  articleStatus:'1'
}

// mutations
const mutations = {
  change (state, { name }) {
    state.name = name
  },
    cArticle(state,String){
        state.articleStatus = String
    },
}

export default {
  state,
  mutations
}
