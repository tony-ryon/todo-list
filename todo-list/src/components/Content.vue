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
                        style="font-size: 16px"></div>
                    <v-text-field
                        v-else-if="changeLabel"
                        type="text"
                        autocomplete="off"
                        maxlength="30"
                        color="success"
                        v-model="updateText"
                        style="display: inline"
                        @keypress.enter="updateTodo(todo)"
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

<script>
    export default {
        name: "Content",
        props: ['todo'],
        data: () => ({
            changeLabel: false,
            updateText: ''
        }),
        methods: {
            changeTodoText () {
                this.changeLabel = true;
            },
            updateTodo (todo) {
                var value = this.updateText && this.updateText.trim()
                if (!value) {
                    return;
                }

                todo.text = this.updateText
                this.changeLabel = false;
            }
        }
    }
</script>