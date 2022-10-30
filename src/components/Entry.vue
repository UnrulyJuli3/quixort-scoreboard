<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
    props: {
        index: {
            type: Number,
            required: true
        },
        info: {
            type: Object as PropType<{
                name: string;
                score: number;
            }>,
            required: true
        }
    }
});
</script>

<template>
    <tr>
        <td class="rank">{{ index + 1 }}.</td>
        <td class="score">{{ info.score.toLocaleString("en-US") }}</td>
        <td class="name">{{ info.name }}</td>
    </tr>
</template>

<style scoped lang="scss">
tr {
    color: #fff;

    &>td {
        &.rank {
            font-size: 22px;
            font-weight: 600;
            text-align: right;
            padding: 0;
        }

        &.score {
            font-size: 24px;
            font-weight: 600;
            text-align: right;
            padding: 0 20px 0 10px;
        }

        &.name {
            font-size: 24px;
            font-weight: 900;
            padding: 5px 0;
        }
    }
}
</style>