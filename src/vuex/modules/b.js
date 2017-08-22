const state = {
  loading: true
}

// mutations
const mutations = {
  changeload (state, { load }) {
    state.loading = load
  }
}

export default {
  state,
  mutations
}
