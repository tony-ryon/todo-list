<template>
    <v-footer
        v-if="todos.length > 0"
        color="success lighten-1"
        rounded>
        <v-row
            justify="center"
            no-gutters>
            <div class="my-3" style="color: white; font-size: 0.9rem; text-align: center">{{todos.length - completedTodos}} items left</div>

            <v-spacer></v-spacer>

            <v-btn href="#/all" @click="$emit('change-visibility', 'all')" color="white" rounded text class="my-1" style="font-size: 0.75rem">
                All
            </v-btn>
            <v-btn href="#/active" @click="$emit('change-visibility', 'active')" color="white" rounded text class="my-1" style="font-size: 0.75rem">
                Active
            </v-btn>
            <v-btn href="#/completed" @click="$emit('change-visibility', 'completed')" color="white" rounded text class="my-1" style="font-size: 0.75rem">
                Completed
            </v-btn>

            <v-spacer></v-spacer>
            <v-btn v-show="clearCompletedShow" @click="$emit('clear-completed-todos')" color="white" rounded text class="my-1" style="font-size: 0.75rem">
                Clear completed
            </v-btn>
        </v-row>
    </v-footer>
</template>

<script>
    export default {
        name: "TodoListFooter",
        props: {
          todos: {
            type: Array
          },
          completedTodos: {
            type: Number
          }
        },
        computed: {
            clearCompletedShow: function () {
                return this.todos.length > this.todos.filter(todo => !todo.checked).length;
            }
        }
    }
</script>
