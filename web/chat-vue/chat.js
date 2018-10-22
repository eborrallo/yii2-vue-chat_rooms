/**
 * Created by Enric on 18/10/2018.
 */
const URL = "https://jsonplaceholder.typicode.com/todos/1";
var chatUrl = 'ws://localhost:9911';
var name = randomString(5);
var conn;

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
        'conn'
    ],
    data: function () {
        return {
            message: null
        }
    },
    methods: {
        addMessage(){
            if (this.message != null && this.message != '') {
                var d = new Date();
                var params = {
                    'roomId': 1,
                    'message': this.message,
                    'action': 'message',
                    'timestamp': d.getTime() / 1000
                };
                this.conn.send(JSON.stringify(params), function (error) {
                    // Do something in here here to clean things up (or don't do anything at all)
                    console.log(error)
                });
                this.message = '';
            }
            return true
        },


    },
    template: '<div id="vue-chat">' +
    ' <div class="panel-body">' +
    '<chat-vue-content :results=results ></chat-vue-content>' +
    '</div>' +
    '<div class="panel-footer">' +
    '<div class="input-group">' +
    '<input v-model="message" id="btn-input" type="text" class="form-control input-sm"' +
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

    '<div v-if="result.owner" class="header">' +
    '<small class=" text-muted"><span class="glyphicon glyphicon-time"></span>15 mins ago</small>' +
    '<strong class="pull-right primary-font">Bhaumik Patel</strong>' +
    '</div>' +

    '<div v-if="!result.owner" class="header">' +
    '<strong class="primary-font">Jack Sparrow</strong>' +
    '<small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>14 mins ago</small>'+
    '</div>' +
        
    '<p>' +
    '{{result.message}}' +
    '</p>' +
    '</div>' +
    '</li>' +
    '</ul>'
})
function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}
const vm = new Vue({
    el: '#chat',
    data: {
        results: [],
        loading: true,
        conn: null,
    },
    template: ' <chat-vue :results=results :conn=conn ></chat-vue>',
    mounted () {
        this.connectToChat();
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
        connectToChat() {
            var conn = new WebSocket(chatUrl);

            conn.onopen = function () {
                var params = {
                    'roomId': 1,
                    'userName': name,
                    'action': 'connect'
                };
                console.log(params);
                conn.send(JSON.stringify(params));
            };

            conn.onmessage = e => {
                console.log(e);
                var data = JSON.parse(e.data);


                if (data.hasOwnProperty('message') && data.hasOwnProperty('from')) {
                    // displayChatMessage(data.from.name, data.message);
                    if (data.from.name === name) {
                        this.results.push({from: data.from.name, message: data.message, owner: false})
                    } else {
                        this.results.push({from: data.from.name, message: data.message, owner: true})
                    }
                    this.autoScrollDown();
                }
                else if (data.hasOwnProperty('message')) {
                    // displayChatMessage(null, data.message);
                }
                else if (data.hasOwnProperty('type')) {
                    if (data.type == 'list-users' && data.hasOwnProperty('clients')) {
                        // displayChatMessage(null, 'There are ' + data.clients.length + ' users connected');
                    }
                    else if (data.type == 'user-started-typing') {
                        // displayUserTypingMessage(data.from)
                    }
                    else if (data.type == 'user-stopped-typing') {
                        // removeUserTypingMessage(data.from);
                    }
                }
            };

            conn.onerror = function (e) {
                console.log(e);
            };
            conn.onclose = function (e) {
                console.log(e);
            }
            this.conn = conn;
            return true;
        },
        autoScrollDown() {
            const panel = $(".panel-body");
            panel.stop().animate({scrollTop: panel[0].scrollHeight}, 1000);
        }
    }
});


function displayChatMessage(from, message) {
    var node = document.createElement("LI");

    if (from) {
        var nameNode = document.createElement("STRONG");
        var nameTextNode = document.createTextNode(from);
        nameNode.appendChild(nameTextNode);
        node.appendChild(nameNode);
    }

    var messageTextNode = document.createTextNode(message);
    node.appendChild(messageTextNode);

    document.getElementById("messageList").appendChild(node);
}

function displayUserTypingMessage(from) {
    var nodeId = 'userTyping' + from.name.replace(' ', '');
    var node = document.getElementById(nodeId);
    if (!node) {
        node = document.createElement("LI");
        node.id = nodeId;

        var messageTextNode = document.createTextNode(from.name + ' is typing...');
        node.appendChild(messageTextNode);

        document.getElementById("messageList").appendChild(node);
    }
}

function removeUserTypingMessage(from) {
    var nodeId = 'userTyping' + from.name.replace(' ', '');
    var node = document.getElementById(nodeId);
    if (node) {
        node.parentNode.removeChild(node);
    }
}

function updateChatTyping() {
    var params = {};

    if (document.getElementsByName("message")[0].value.length > 0) {
        params = {'action': 'start-typing'};
        conn.send(JSON.stringify(params));
    }
    else if (document.getElementsByName("message")[0].value.length == 1) {
        params = {'action': 'stop-typing'};
        conn.send(JSON.stringify(params));
    }
}

