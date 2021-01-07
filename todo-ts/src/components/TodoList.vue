App.vue<template>
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
              v-model.trim="addNewText"
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
                  <todo-list-item
                    v-for="(todo, index) in filteredTodos"
                    :todo="todo"
                    :todos="todos"
                    :key="index"
                    @remove="todos = todos.filter((todo, idx) => idx !== index)"
                    @update-todo="updateTodo"
                    />
            </v-slide-y-transition>
        </v-card>

        <!-- footer 부분 -->
        <todo-list-footer
            :todos="todos"
            :completed-todos="completedTodos"
            @change-visibility="changeVisibility"
            @clear-completed-todos="clearCompletedTodos"
            />
    </v-container>
</template>

<script lang="ts">
import TodoListItem from '@/components/TodoListItem.vue';
import TodoListFooter from '@/components/TodoListFooter.vue';
import {Watch, Component, Vue} from "vue-property-decorator";

interface Todo{
    id: number,
    text: string,
    checked: boolean
}

@Component({
    components: {
        TodoListItem,
        TodoListFooter
    }
})
export default class TodoList extends Vue{
    // data
    private STORAGE_KEY: string =  'todos';
    private addNewText: string = '';
    private todos: Array<Todo> = [];
    private nextId: number = 0;
    private completedTodos: number = 0;
    private allChecked: boolean = localStorage.getItem('allChecked') === 'true' || false;
    private visibility: string = localStorage.getItem('visibility') || 'all';

    // created
    created() {
        let todos: Array<Todo> = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
        // todos의 id 순서를 다시 맞추기 위한것
        this.todos= todos.map(function (obj: Todo, index: number) {
            let todo = {} as Todo;
            todo.id = index;
            todo.text = obj.text;
            todo.checked = obj.checked;

            return todo;
        });
        this.nextId = this.todos.length;
        this.completedTodos = this.todos.filter(todo => todo.checked).length;
    }

    // methods
    addNewTodo () {
        if (this.todos.length === 0) {
            this.nextId = 0;
            this.allChecked = false;
        }

        const value: string = this.addNewText;
        if (!value) {
            return;
        }

        let todo: Todo = {
            id: this.nextId++,
            text: this.addNewText,
            checked: false
        };
        this.todos = [...this.todos, todo];

        this.addNewText = '';
    }
    changeVisibility (visibility: string) {
        this.visibility = visibility;
        localStorage.setItem('visibility', visibility);
    }
    clearCompletedTodos () {
        // this.todos = this.filters.active(this.todos);
        this.todos = this.todos.filter(todo => !todo.checked);
    }
    updateTodo (newTodo: Todo) {
        let index: number = this.todos.findIndex(function (todo) {
            if(todo.id === newTodo.id) return true
        });

        this.todos = [...this.todos.slice(0, index), newTodo, ...this.todos.slice(index+1)];
    }

    // computed
    get filteredTodos() {
        if (this.visibility === 'all')
            return this.todos
        else if (this.visibility === 'active')
            return this.todos.filter(todo => !todo.checked);
        return this.todos.filter(todo => todo.checked);
    }

    // watch
    @Watch('allChecked')
    onAllCheckedChanged(completed: boolean) {
        this.todos = this.todos.map(function (obj: Todo) {
            let todo = {} as Todo;
            todo['id'] = obj.id;
            todo['text'] = obj.text;
            todo['checked'] = completed;

            return todo;
        })
    }
    @Watch('todos')
    onTodosChanged(updateTodos: Array<Todo>) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updateTodos))
        this.completedTodos = this.todos.filter(todo => todo.checked).length;
    }
}
</script>