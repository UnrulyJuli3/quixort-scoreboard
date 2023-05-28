<script lang="ts">
import { defineComponent } from "vue";
import { get, set } from "idb-keyval";
import Entry from "./Entry.vue";
import scores from "../assets/scores.json";

const artifactRegex = /(?:LineupGame\/|^)([a-z0-9]{32})(?:\/|$)/;

interface LineupPlayer {
    avatar: number;
    id: string;
    name: string;
    score: number;
    sessionId: number;
    team: string;
    teamName: string;
    wonLastGame: false;
}

interface LineupTeam {
    audienceRoundScores: number[];
    audienceScore: number;
    name: string;
    numTopOuts: number;
    players: string[];
    roundScores: number[];
    score: number;
    sequences: any[];
    team: string;
}

interface LineupBlob {
    audience: {
        lastAudienceCount: number;
        maxAudienceCount: number;
        name: string;
    };
    board: {
        rows: number;
        columns: number;
        spawnRow: number;
    };
    endingForeverBlocks: any[];
    "inForeverMode:": boolean;
    locale: string;
    players: LineupPlayer[];
    teams: LineupTeam[];
}

export default defineComponent({
    data(): {
        defaultScores: { name: string; score: number; reference: string; }[];
        fetching: boolean;
        userScores: { name: string; score: number; reference: string; type: string; }[];
        url: string;
    } {
        return {
            defaultScores: scores,
            fetching: false,
            userScores: [],
            url: ""
        };
    },
    methods: {
        /* updateURL(e: Event) {
            if (this.fetching) return;
            this.url = (e.target as HTMLInputElement).value.trim();
            if (artifactRegex.test(this.url)) this.fetch();
        },
        async fetch() {
            if (this.fetching) return;
            this.fetching = true;
            const artifactId = artifactRegex.exec(this.url)![1];
            const res = await fetch(`https://fishery.jackboxgames.com/artifact/LineupGame/${artifactId}/`);
            const data = await res.json();
            this.fetching = false;
            if (data.success === false) {
                // error
                console.error(data.error);
                return;
            }

            this.artifacts.push(data.blob);
        } */
        submit() {
            const match = this.url.trim().match(artifactRegex);
            if (!match) return;
            this.userScores = [];
            this.$router.push({
                name: "artifact",
                params: {
                    artifactId: match[1]
                }
            });
        },
        async loadArtifact() {
            if (this.$route.name === "artifact") {
                const artifactId = this.artifactId;

                this.fetching = true;
                const existing = await get(`artifact-${artifactId}`);
                let data;

                if (existing) data = existing;
                else {
                    const res = await fetch(`https://fishery.jackboxgames.com/artifact/LineupGame/${artifactId}/`);
                    data = await res.json();
                    if (data.success !== false) await set(`artifact-${artifactId}`, data);
                }

                if (artifactId !== this.artifactId) return;

                this.fetching = false;

                if (data.success === false) {
                    console.error(data.error);
                    return;
                }

                this.userScores = [];

                const blob = data.blob as LineupBlob;
                if (blob["inForeverMode:"]) {
                    const team = blob.teams[0];
                    this.userScores.push({
                        name: team.players.length >= 3 ? `TEAM ${team.players[0]}` : team.players.join(" & "),
                        score: team.score,
                        reference: "None",
                        type: "solo"
                    });
                } else {
                    blob.teams.forEach((team, index) => this.userScores.push({
                        name: team.name,
                        score: team.score,
                        reference: "None",
                        type: ["team-one", "team-two"][index]
                    }));
                }
            }
        }
    },
    computed: {
        artifactId() {
            return this.$route.params.artifactId;
        },
        scores() {
            return this.defaultScores.map(entry => ({
                name: entry.name,
                score: entry.score,
                reference: entry.reference,
                type: "default"
            })).concat(this.userScores).sort((a, b) => b.score - a.score);
        }
    },
    watch: {
        artifactId() {
            this.loadArtifact();
        }
    },
    mounted() {
        this.loadArtifact();
    },
    components: { Entry }
});
</script>

<template>
    <div class="logo">
        <img :draggable="false" src="../assets/logo.png" />
    </div>
    <div class="custom">
        <div class="text">Enter a Quixort gallery URL to see your score(s) on this scoreboard:<br>(You may need to press Enter)</div>
        <form @submit.prevent="submit">
            <input v-model="url" type="text" placeholder="https://games.jackbox.tv/LineupGame/&#x2026;"
                maxlength="100" />
        </form>
        <div class="instructions">Click on a name below to see what it's a reference to</div>
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

    margin-bottom: 30px;
}

.custom {
    width: 500px;
    max-width: 100%;
    padding: 20px 20px 0;
    margin: 0 auto;

    &>.text {
        text-align: left;
        color: #fff;
        font-size: 18px;
        margin: 8px 0;
    }

    &>form>input {
        width: 100%;
        border: 0;
        background: #0003;
        padding: 6px 10px;
        color: #fff;
        outline: 0;
        font-size: 18px;
        border-radius: 8px;
        text-overflow: ellipsis;

        &::placeholder {
            color: #fff;
            opacity: 0.5;
        }
    }

    &>.instructions {
        text-align: left;
        color: #fff;
        font-size: 22px;
        margin: 40px 0 0;
    }
}

.board {
    padding: 30px;

    &>table.list {
        margin: 0 auto;
    }
}
</style>