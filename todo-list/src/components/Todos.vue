<template>
    <v-container style="max-width: 600px">
        <br/><br/>
        <!-- todo 입력부분 -->
        <v-row>
            <v-checkbox
              v-if="todos.length > 0"
              v-model="allChecked"
              color="success"
              align="center">
            </v-checkbox>
            <!-- 여기서 한글을 입력받고 keydown.enter 이벤트를 발생시켰을 때  -->
            <!-- 입력이 2번들어가게 되는 이슈가 있었다. 그래서 keypress로 바꾸었더니 해결되었다. -->
            <v-text-field
              v-model="addNewText"
              placeholder="What needs to be done?"
              color="success"
              autocomplete="off"
              maxlength="30"
              @keypress.enter="addNewTodo"
            >
            </v-text-field>
        </v-row>

        <!-- todo 생성부분 -->
        <v-card v-if="todos.length > 0">
            <v-slide-y-transition group>
                  <Content
                    v-for="(todo, index) in filteredTodos"
                    :todo="todo"
                    :key="index"
                    @remove="todos.splice(index, 1)"
                    />
            </v-slide-y-transition>
        </v-card>

        <!-- footer 부분 -->
        <Footer
            :todos="todos"
            :completedTodos="completedTodos"
            @changeVisibility="changeVisibility"
            @clearCompletedTodos="clearCompletedTodos"
            />
    </v-container>
</template>

<script>
import Content from '@/components/Content.vue';
import Footer from '@/components/Footer';

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

export default {
    name: "Todos",
    components: {
        Content, Footer
    },
    data: () => ({
        addNewText: '',
        todos: todoStorage.fetch(),
        nextId: todoStorage.fetch().length,
        completedTodos: filters.completed(todoStorage.fetch()).length,
        allChecked: localStorage.getItem('allChecked') === 'true' || false,
        visibility: localStorage.getItem('visibility') || 'all',
        changeLabel: false
    }),
    methods: {
        addNewTodo () {
            if (this.todos.length === 0) {
                this.nextId = 0;
                this.allChecked = false;
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
        changeVisibility (visibility) {
            this.visibility = visibility;
            localStorage.setItem('visibility', visibility);
        },
        clearCompletedTodos () {
            this.todos = filters.active(this.todos);
        }
    },
    computed: {
        filteredTodos: function () {
            return filters[this.visibility](this.todos);
        }
    },
    watch: {
        allChecked: function (completed) {
            this.todos.forEach(function (todo) {
                todo.checked = completed;
            })
            localStorage.setItem('allChecked', completed);
        },
        todos: {
            handler: function (updateTodo) {
                todoStorage.save(updateTodo);
                this.completedTodos = filters.completed(this.todos).length;
            },
            deep: true
        }
    }
}
</script>