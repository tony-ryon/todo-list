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
import {ITodo as Todo} from "@/types/type";
// type에 있는 Todo 인터페이스를 연결하려고 했는데
// eslint에서 no-unused-vars 에러가 발생했다.
// @typescript-eslint/no-unused-vars": [2,{"args": "none"}]
// 위의 코드를 package.json의 rules에 추가해줌으로써 해결


@Component({
    components: {
        TodoListItem,
        TodoListFooter
    },
})
export default class TodoList extends Vue{
    // data
    private STORAGE_KEY: string =  'todos';
    private addNewText: string = '';
    private todos: Todo[] = [];
    private nextId: number = 0;
    private allChecked: boolean = localStorage.getItem('allChecked') === 'true' || false;
    private visibility: string = localStorage.getItem('visibility') || 'all';

    // created
    created() {
        const todos: Todo[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
        // todos의 id 순서를 다시 맞추기 위한것
        this.todos = todos.map(function (obj: Todo, index: number) {
            return { ...obj, id: index }
        });

        this.nextId = this.todos.length;
    }

    // methods
    addNewTodo (): void {
        if (this.todos.length === 0) {
            this.nextId = 0;
            this.allChecked = false;
        }

        if (!this.addNewText) {
            return;
        }

        this.todos = [...this.todos, {
            id: this.nextId++,
            text: this.addNewText,
            checked: false
        }];

        this.addNewText = '';
    }
    changeVisibility (visibility: string): void {
        this.visibility = visibility;
        localStorage.setItem('visibility', visibility);
    }
    clearCompletedTodos (): void {
        this.todos = this.todos.filter(todo => !todo.checked);
    }
    updateTodo (newTodo: Todo): void {
        const index: number = this.todos.findIndex(function (todo) {
            if(todo.id === newTodo.id) return true
        });

        this.todos = [...this.todos.slice(0, index), newTodo, ...this.todos.slice(index+1)];
    }

    // computed
    get filteredTodos(): Todo[] {
        if (this.visibility === 'all'){
            return this.todos
        }
        else if (this.visibility === 'active'){
            return this.todos.filter(todo => !todo.checked);
        }
        return this.todos.filter(todo => todo.checked);
    }
    get completedTodos(): number {
        return this.todos.filter(todo => todo.checked).length;
    }

    // watch
    @Watch('allChecked')
    onAllCheckedChanged(completed: boolean): void {
        this.todos = this.todos.map(function (obj: Todo) {
            return { ...obj, checked: completed }
        })
    }
    @Watch('todos')
    onTodosChanged(updateTodos: Todo[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updateTodos))
    }
}
</script>