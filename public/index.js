l = console.log
FIELD_TYPE = FIELD_TYPES.FULL96

window.onload = function() {
    setupPaperJs(FIELD_TYPE)
}

function storeClick(attacker, keeper, field){
    l(attacker)
    l(keeper)
    l(field)

    let ax = attacker.x / (field.w/2) - 1
    let ay = attacker.y / (field.h/2) - 1
    let ar = attacker.r
    let kx = keeper.x / (field.w/2) - 1
    let ky = keeper.y / (field.h/2) - 1

    let data = {ax, ay, ar, kx, ky}

    l("==== " + app.user)
    if(app.user == ""){
        alert("Please enter your name on the left")
        return
    }

    Vue.http.post('/store/' + app.user + '/' + app.field, data).then(response => {
        l("Response! error: " + response.data.error)
    })
}




let app = new Vue({
    el: '#app',
    data: {
        state : null,
        list : [],
        fields : FIELD_TYPES,
        user : "",
        field : "",
        states : {
            selectUser : "selectUser",
            selectField : "selectField",
            playGame : "playGame"
        }
    },

    methods : {
        selectUser : function(user){
            l("User selected: " + user)
            this.user = user
            this.state = this.states.selectField
        },
        selectField : function(field){
            l("User selected: " + field)
            this.field = field
            this.state = this.states.playGame
        }
    },

    mounted : function () {
        this.$http.get('list').then(response => {
            this.list = response.data
            this.state = this.states.selectUser
        })
    }
})