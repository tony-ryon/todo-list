<template>
    <div>
        <v-divider></v-divider>

        <v-list-item>
            <v-list-item-action>
                <v-row>
                    <v-checkbox
                        v-model="todo.checked"
                        color="success">
                    </v-checkbox>
                    <div
                        v-if="!changeLabel"
                        :class="todo.checked && ('grey--text' && 'text-decoration-line-through') || 'black--text'"
                        class="ml-4 font-italic font-weight-regular"
                        v-text="todo.text"
                        @dblclick="changeTodoText"
                        style="font-size: 1rem"></div>
                    <v-text-field
                        v-else-if="changeLabel"
                        type="text"
                        autocomplete="off"
                        maxlength="30"
                        color="success"
                        v-model.trim="updateText"
                        style="display: inline"
                        @keypress.enter="updateTodo"
                    />
                </v-row>
            </v-list-item-action>

            <v-spacer></v-spacer>

            <v-scroll-x-transition>
                <v-icon
                    @click="$emit('remove')">
                    mdi-delete
                </v-icon>
            </v-scroll-x-transition>
        </v-list-item>
    </div>
</template>

<script lang="ts">
import {Component, Watch, Prop, Emit, Vue} from 'vue-property-decorator'
import {ITodo as Todo} from "@/types/type";

@Component
export default class TodoListItem extends Vue{
    // props
    @Prop(Object) readonly todo!: Todo
    @Prop(Array) readonly todos!: Todo[]

    // data
    private changeLabel: boolean = false;
    private updateText: string = '';

    // methods
    changeTodoText (): void {
        this.changeLabel = true;
    }
    @Emit()
    updateTodo (): Todo {
        this.changeLabel = false;
        return {...this.todo, text: this.updateText}
    }

    // watch
    @Watch('todo.checked')
    @Emit('update-todo')
    onTodoCheckedChanged(changeChecked: boolean): Todo {
        return {...this.todo, checked: changeChecked};
    }
}
</script>