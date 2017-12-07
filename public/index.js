l = console.log;

window.onload = function() {
    setupPaperJs(FIELD_TYPES.FULL_96)
};

function storeClick(attacker, keeper, field){
    l(attacker);
    l(keeper);
    l(field);

    let ax = attacker.x / (field.w/2) - 1;
    let ay = attacker.y / (field.h/2) - 1;
    let ar = attacker.r;
    let kx = keeper.x / (field.w/2) - 1;
    let ky = keeper.y / (field.h/2) - 1;

    let data = {ax, ay, ar, kx, ky};

    l("==== " + app.username);
    if(app.username == ""){
        alert("Please enter your name on the left");
        return
    }

    Vue.http.post('/store/' + app.username + '/' + FIELD_TYPES.NEXPERIA, data).then(response => {
        l("Response! error: " + response.data.error)
    })
}




let app = new Vue({
    el: '#app',
    data: {
        list : [],
        username : ""
    },

    mounted : function () {
        this.$http.get('list').then(response => {
            this.list = response.data
        })
    }
});