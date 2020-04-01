<template>
  <v-row>
    <v-col cols="12">
      <!-- Toolbar -->
      <v-toolbar dense>
        <v-toolbar-title>Decision Rolls</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn outlined color="success" :loading="isLoading" @click="data.decisionNewPrompt = true">
          <v-icon>mdi-plus</v-icon>New
        </v-btn>
        <v-btn icon class="ml-2" :loading="isLoading" @click="refreshFromKiera">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Data from Kiera -->
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="12" md="4" lg="4">
            <!-- Stats -->
            <v-card>
              <v-overlay :absolute="true" :value="isLoading">
                <v-progress-circular indeterminate size="64" width="2" color="teal"></v-progress-circular>
              </v-overlay>

              <v-sheet class="v-sheet--offset mx-auto title text-center stats-title" color="indigo" elevation="6" dark
                >Decisions</v-sheet
              >

              <v-card-text>
                <div class="headline text-center">
                  <span>{{ data.decisions.length || 0 }}</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>mdi-dice-multiple-outline</v-icon>
                <span class="caption grey--text font-weight-light"># of decision rolls</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-card>
              <v-overlay :absolute="true" :value="isLoading">
                <v-progress-circular indeterminate size="64" width="2" color="teal"></v-progress-circular>
              </v-overlay>

              <v-sheet class="v-sheet--offset mx-auto title text-center stats-title" color="indigo" elevation="6" dark
                >Total Outcomes Across</v-sheet
              >

              <v-card-text>
                <div class="headline text-center">
                  <span>
                    {{
                      data.decisions.length > 0
                        ? data.decisions.map(d => d.options.length).reduce((acc, cur) => acc + cur)
                        : 0
                    }}
                  </span>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>mdi-pound</v-icon>
                <span class="caption grey--text font-weight-light">...</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-card>
              <v-overlay :absolute="true" :value="isLoading">
                <v-progress-circular indeterminate size="64" width="2" color="teal"></v-progress-circular>
              </v-overlay>

              <v-sheet class="v-sheet--offset mx-auto title text-center stats-title" color="indigo" elevation="6" dark
                >-</v-sheet
              >

              <v-card-text>
                <div class="headline text-center">
                  <span>-</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>mdi-information-outline</v-icon>
                <span class="caption grey--text font-weight-light">...</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-divider class="my-3"></v-divider>

      <!-- Data from Kiera -->
      <v-container>
        <v-list>
          <template v-for="(decision, index) in data.decisions">
            <v-list-item :key="index" @click="editDecision(decision._id)">
              <v-list-item-content>
                <v-list-item-title v-text="decision.name"></v-list-item-title>
                <v-list-item-subtitle
                  class="text--secondary"
                  v-text="decision.description || '~ no subtitle ~'"
                ></v-list-item-subtitle>
                <v-list-item-subtitle v-text="decision.subtitle"></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <!-- <v-list-item-action-text v-text="decision.action"></v-list-item-action-text>
                    <v-icon v-if="!active" color="grey lighten-1">
                      star_border
                    </v-icon>

                    <v-icon v-else color="yellow">
                      star
                    </v-icon> -->
                <v-chip small label
                  ><v-icon left>mdi-numeric-zero-box-multiple-outline</v-icon>
                  {{ `${decision.options.length} outcomes` || 'no outcomes' }}</v-chip
                >
                <v-chip small label>
                  <v-icon left>mdi-fire</v-icon
                  >{{ decision.counter > 0 ? `${decision.counter} times` : 'not used yet' }}</v-chip
                >
              </v-list-item-action>
            </v-list-item>
            <v-divider v-if="index + 1 < data.decisions.length" :key="decision._id"></v-divider>
          </template>
        </v-list>

        <v-divider></v-divider>
        <!-- No Decisions to display message -->
        <v-row align="center" justify="center" style="height: 300px;" v-if="!isLoading && data.decisions.length === 0">
          <span class="headline"> <u>0</u> decisions to show! </span>
        </v-row>
        <v-row align="center" justify="center" v-if="!isLoading && data.decisions.length === 0">
          <router-link to="/">Return to home</router-link>
        </v-row>

        <!-- Prompt: New Decision -->
        <v-dialog v-model="data.decisionNewPrompt" max-width="320" persistent>
          <v-card>
            <v-card-title class="headline">New Decision</v-card-title>

            <v-card-text>
              <v-text-field
                label="Name"
                hint="This will be the title or question"
                persistent-hint
                v-model="data.decisionNewInput"
                :disabled="data.decisionNewIsLoading"
                @keyup.enter="decisionNew"
              ></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="gray darken-1"
                :disabled="data.decisionNewIsLoading"
                text
                @click="data.decisionNewPrompt = false"
                >Cancel</v-btn
              >

              <v-btn color="green darken-1" :loading="data.decisionNewIsLoading" text @click="decisionNew">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// API
import { DecisionAPI } from '@/api/decision'

// Defaults
import { $DecisionRollsView } from '@/defaults/decision'

// Objects
import { Decision } from '../objects/decision'

@Component({})
export default class DecisionRollsView extends Vue {
  @Prop({ default: () => $DecisionRollsView })
  private data!: typeof $DecisionRollsView
  private isLoading = false

  private async mounted() {
    await this.refreshFromKiera()
  }

  private findDecision(_id: string) {
    return this.data.decisions.find(d => d._id === _id) || new Decision()
  }

  private async refreshFromKiera() {
    this.isLoading = true
    const res = await DecisionAPI.fetchDecisions()

    if (res) {
      // Decisions List
      this.data.decisions = res.map(d => new Decision(d))
    }

    this.isLoading = false
  }

  private async decisionNew() {
    this.data.decisionNewIsLoading = true
    const res = await DecisionAPI.decisionNew(this.data.decisionNewInput)

    if (res.success) {
      this.data.decisions.push(new Decision({ _id: res._id, name: this.data.decisionNewInput }))
    }

    this.data.decisionNewPrompt = false
    this.data.decisionNewIsLoading = false
  }

  private editDecision(_id: string) {
    this.$router.push({ path: `/decision/manager/${_id}` })
  }
}
</script>

<style lang="less" scoped>
.stats-title {
  font-weight: 300;
  border-radius: 4px 4px 0 0;
}

.decision-stat {
  display: block;
  width: 100%;
  font-size: 12px;
  text-align: right;
}

.decision-list-title {
  padding: 5px 0;
  font-weight: 500;
}

.decision-title {
  word-wrap: normal;
}
</style>
