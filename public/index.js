l = console.log

window.onload = function() {
    setupPaperJs(FIELD_TYPES.FULL_96)
}

function storeClick(attacker, keeper, field){
    l(attacker)
    l(keeper)
    l(field)
}




let app = new Vue({
    el: '#app',
    data: {
        list : []
    },

    mounted : function () {
        this.$http.get('list').then(response => {
            this.list = response.data
        })
    }
})