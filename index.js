var STORAGE_KEY = 'todos'

var filters = {
    all: function (todos) {
        return todos;
    },
    active: function (todos) {
        return todos.filter(function (todo) {
            return !todo.checked;
        });
    },
    completed: function (todos) {
        return todos.filter(function (todo) {
            return todo.checked;
        });
    }
}

var todoStorage = {
    save: function (todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    },
    fetch: function () {
        var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
        // todos의 id 순서를 다시 맞추기 위한것
        todos.forEach(function (todo, index) {
            todo.id = index;
        })

        return todos;
    }
}

// checkbox를 유지하려면 v-model에서 todo.checked로 받아야한다.
Vue.component('todo-item', {
    props: ['todo'],
    template: '\
        <li>\
            <div class="todo-item">\
                <input type="checkbox" v-model="todo.checked">\
                <label \
                    @dblclick="changeTodoText" \
                    class="todo-text" \
                    :class="{ completed: todo.checked}" \
                    v-show="!changeLabel">{{ todo.text }}</label>\
                <form @submit.prevent="updateTodo(todo)" style="display: inline">\
                    <input \
                        type="text" \
                        autocomplete="off"\
                        maxlength="30"\
                        v-show="changeLabel"\
                        v-model="updateText"\
                        >\
                </form>\
                <button @click="$emit(\'remove\')">remove</button>\
            </div>\
        </li>\
    ',
    data: function () {
        return {
            changeLabel: false,
            updateText: ''
        }
    },
    methods: {
        changeTodoText: function () {
            // dblclick시 내용 바꿀 수 있도
            this.changeLabel = true;
        },
        updateTodo: function (todo) {
            todo.text = this.updateText
            this.$emit('update', todo);
            this.changeLabel = false;
        }
    }
});

var todoItems = new Vue({
    el: '#todo',
    data: {
        addNewText: '',
        nextId: todoStorage.fetch().length,
        todos: todoStorage.fetch(),
        visibility: 'all',
        checked: false
    },
    methods: {
        addNewTodo: function () {
            if (this.todos.length === 0) {
                this.nextId = 0;
                this.checked = false;
            }

            var value = this.addNewText && this.addNewText.trim()
            if (!value) {
                return;
            }

            this.todos.push({
                id: this.nextId++,
                text: this.addNewText,
                checked: false
            })
            this.addNewText = '';
        },
        changeVisibility: function (visibility) {
            this.visibility = visibility;
        },
        clearCompletedTodos: function () {
            // 선택된 거는 지우고 남은 것만 todos에 넣는다.
            this.todos = filters.active(this.todos);
        },
    },
    // computed는 페이지 처음 실행할 때 작동한다.
    // 데이터를 캐싱하고 사용하기 때문인거 같다.
    computed: {
        filteredTodos: function () {
            return filters[this.visibility](this.todos);
        },
        clearCompletedShow: function () {
            return this.todos.length > filters.active(this.todos).length;
        },
        allDoneShow: function () {
            return this.todos.length;
        }
    },
    // 값이 변경되면 호출된다.
    watch: {
        checked: function (completed) {
            this.todos.forEach(function (todo){
                todo.checked = completed;
            })
        },
        todos: {
            handler: function (updateTodos) {
                todoStorage.save(updateTodos);
            },
            // deep 속성을 넣어주게되면 todos안에 todo의 객체가 변경되어도 watch가 작동된다.
            deep: true
        }
    }
});