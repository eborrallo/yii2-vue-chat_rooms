/**
 * Created by Enric on 18/10/2018.
 */
const URL = "https://jsonplaceholder.typicode.com/todos/1";
var data = [
    {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.',
        date: '1/1/1',
        owner: true
    }, {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.',
        date: '1/1/1',
        owner: true
    },
    {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.',
        date: '1/1/1',
        owner: false
    },
    {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.',
        date: '1/1/1',
        owner: true
    },
];
 Vue.component('chat-vue', {
    props: [
        'results',
    ],
    methods: {
        addMessage(){
            axios.get(URL).then((response) => {
                this.results.push({message: response.data.title});
                console.log(this.results);
            }).catch((error) => {
                console.log(error);
            });
            this.autoScrollDown();

        },
        autoScrollDown(){
            const panel = $(".panel-body");
            panel.stop().animate({scrollTop: panel[0].scrollHeight}, 1000);
        },
    },
    template: '  <div id="vue-chat">' +
    ' <div class="panel-body">' +
    '<chat-vue-content :results=results ></chat-vue-content>' +
    '</div>' +
    '<div class="panel-footer">' +
    '<div class="input-group">' +
    '<input id="btn-input" type="text" class="form-control input-sm"' +
    'placeholder="Type your message here...">' +
    '<span class="input-group-btn">' +
    '<button  @click="addMessage()" class="btn btn-warning btn-sm" id="btn-chat">' +
    'Send' +
    '</button>' +
    '</span>' +
    '</div>' +
    '</div>' +
    '</div>'
});
 Vue.component('chat-vue-content', {
    props: [
        'results'
    ],

    template: '<ul class="chat"  >' +
    '<li v-for="result in results"   :class="{ \'left\': result.owner ,\'right\': !result.owner }" class="clearfix">' +
    '<span  :class="{ \'pull-left\':result.owner ,\'pull-right\':!result.owner }" class="chat-img ">' +
    '<img src="http://placehold.it/50/55C1E7/fff&amp;text=U" alt="User Avatar" class="img-circle">' +
    '</span>' +
    '<div class="chat-body clearfix">' +
    '<div class="header">' +
    '<strong class="primary-font">Jack Sparrow</strong>' +
    '<small  :class="{\'pull-right\':result.owner ,\'pull-left\':!result.owner }" class=" text-muted">' +
    '<span class="glyphicon glyphicon-time"></span>12 mins ago' +
    '</small>' +
    '</div>' +
    '<p>' +
    '{{result.message}}' +
    '</p>' +
    '</div>' +
    '</li>' +
    '</ul>'
})

const vm = new Vue({
    el: '#chat',
    data: {
        results: [],
        loading: true,
    },
    template: ' <chat-vue :results=results ></chat-vue>',
    mounted () {

        this.results = data;
        // $(this.$refs.vuemodal).on("hidden.bs.modal", this.doSomethingOnHidden)
        // $(this.$refs.vuemodal).on("show.bs.modal", this.doSomethingOnShow)

    },
    methods: {
        doSomethingOnHidden(){
            console.log('hidde');
            clearInterval(timer);
        },
        doSomethingOnShow(){
            console.log('show');
            timer = setInterval(function () {
                console.log("Hello");
            }, 3000);
        },
    }
});