export const changeload = ({ commit, state }, val) => {
    commit('changeload', { load: val })
}

export const changeName = ({ commit, state }, val) => {
    commit('change', { name: val })
}


export const changeMenu =(context,Array) =>{
    context.commit('cMenu',Array)
}
export const changeButton =(context,Object) =>{
    context.commit('cButton',Object)
}
export const changeArticleStatus =(context,String) =>{
    context.commit('cArticle',String)
}
