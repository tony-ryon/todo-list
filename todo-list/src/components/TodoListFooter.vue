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

            <v-btn href="#/all" @click="$emit('changeVisibility', 'all')" color="white" rounded text class="my-1" style="font-size: 0.75rem">
                All
            </v-btn>
            <v-btn href="#/active" @click="$emit('changeVisibility', 'active')" color="white" rounded text class="my-1" style="font-size: 0.75rem">
                Active
            </v-btn>
            <v-btn href="#/completed" @click="$emit('changeVisibility', 'completed')" color="white" rounded text class="my-1" style="font-size: 0.75rem">
                Completed
            </v-btn>

            <v-spacer></v-spacer>
            <v-btn v-show="clearCompletedShow(todos)" @click="$emit('clearCompletedTodos')" color="white" rounded text class="my-1" style="font-size: 0.75rem">
                Clear completed
            </v-btn>
        </v-row>
    </v-footer>
</template>

<script>
    var filters = {
        all: function (todos) {
            return todos;
        },
        active: function (todos) {
            return todos.filter(todo => !todo.checked);
        },
        completed: function (todos) {
            return todos.filter(todo => todo.checked);
        }
    }

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
        methods: {
            clearCompletedShow: function (todos) {
                return todos.length > filters.active(todos).length;
            }
        }
    }

</script>
