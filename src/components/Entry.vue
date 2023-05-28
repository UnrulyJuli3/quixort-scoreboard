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
                reference: string;
                type: string;
            }>,
            required: true
        }
    },
    data(): {
        expanded: boolean;
    } {
        return {
            expanded: false
        };
    },
    methods: {
        toggle() {
            if (this.info.type !== "default") return;
            this.expanded = !this.expanded;
        }
    }
});
</script>

<template>
    <tr :class="`entry ${info.type}`" @click="toggle">
        <td class="rank">{{ index + 1 }}.</td>
        <td class="score">{{ info.score.toLocaleString("en-US") }}</td>
        <td class="name">{{ info.name }}</td>
    </tr>
    <tr class="reference" v-if="expanded">
        <td :colspan="3">{{ info.reference }}</td>
    </tr>
</template>

<style scoped lang="scss">
tr {
    &.entry {
        &.default {
            color: #fff;
            cursor: pointer;

            &:hover {
                opacity: 0.5;
            }
        }

        &.solo {
            color: #ff7900;
        }

        &.team-one {
            color: #db268c;
        }

        &.team-two {
            color: #3ea6fb;
        }

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

    &.reference {
        &>td {
            text-align: left;
            font-size: 18px;
            color: #fff;
            max-width: 300px;
            padding: 10px 0 20px;
        }
    }
}
</style>