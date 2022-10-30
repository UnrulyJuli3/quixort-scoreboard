<script lang="ts">
import { defineComponent } from "vue";
import Entry from "./Entry.vue";
import scores from "../assets/scores.json";

export default defineComponent({
    data() {
        return {
            scores
        };
    },
    components: { Entry }
});
</script>

<template>
    <div class="logo">
        <img :draggable="false" src="../assets/logo.png" />
    </div>
    <div class="board">
        <table class="list">
            <tbody>
                <Entry v-for="(info, index) in scores" :index="index" :info="info" />
            </tbody>
        </table>
    </div>
</template>

<style scoped lang="scss">
.logo {
    padding: 0 30px;
    width: 450px;
    max-width: 100%;
    margin: 0 auto;

    &>img {
        width: 100%;
    }
}

.board {
    padding: 30px;
}

table.list {
    margin: 0 auto;
}
</style>