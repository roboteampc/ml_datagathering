l = console.log

window.onload = function() {
    // setupPaperJs(FIELD_TYPES.FULL_96)
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
        if(!response.data.error)
            app.nLines++
    })
}

let app = new Vue({
    el: '#app',
    data: {
        list : [],
        fields : FIELD_TYPES,
        state : null,
        user : "",
        field : "",
        nLines : 0,
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
            this.$http.get('get/' + app.user + '/' + app.field).then(response => {
                this.nLines = response.data
                setupPaperJs(field)
            })

        }
    },

    mounted : function () {
        this.$http.get('list').then(response => {
            this.list = response.data
            this.state = this.states.selectUser
        })
    }
})