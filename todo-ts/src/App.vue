<template>
    <v-app>
        <v-app-bar
            app
            color="#81C784"
            dark
        >
            <div class="d-flex align-center" style="font-size: 36px;">
                <span class="mr-2"><v-icon>mdi-book-open-outline</v-icon></span>
                <strong>Todos</strong>
            </div>

            <v-spacer></v-spacer>
        </v-app-bar>

        <v-main>
            <Todos/>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Todos from '@/components/TodoList.vue';
import {Component, Vue} from 'vue-property-decorator'

@Component({
    components: {
        Todos
    }
})
export default class App extends Vue{}
</script>
