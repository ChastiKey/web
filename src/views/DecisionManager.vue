<template>
  <v-row>
    <v-col cols="12">
      <!-- Toolbar -->
      <v-toolbar dense>
        <v-toolbar-title>Decision Manager</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon :loading="isLoading" @click="refreshFromKiera">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Data from Kiera -->
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="12" md="4" lg="4">
            <!-- Stats -->
            <v-card>
              <v-overlay :absolute="true" :value="isLoading"
                ><v-progress-circular indeterminate size="64" width="2" color="teal"></v-progress-circular
              ></v-overlay>

              <v-sheet class="v-sheet--offset mx-auto title text-center stats-title" color="indigo" elevation="6" dark>
                Decisions
              </v-sheet>

              <v-card-text>
                <div class="headline text-center">
                  <span>{{ data.decisions.length || 0 }}</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>
                  mdi-dice-multiple-outline
                </v-icon>
                <span class="caption grey--text font-weight-light"># of decision rolls</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-card>
              <v-overlay :absolute="true" :value="isLoading"
                ><v-progress-circular indeterminate size="64" width="2" color="teal"></v-progress-circular
              ></v-overlay>

              <v-sheet class="v-sheet--offset mx-auto title text-center stats-title" color="indigo" elevation="6" dark>
                -
              </v-sheet>

              <v-card-text>
                <div class="headline text-center">
                  <span>-</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>
                  mdi-pound
                </v-icon>
                <span class="caption grey--text font-weight-light">...</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-card>
              <v-overlay :absolute="true" :value="isLoading"
                ><v-progress-circular indeterminate size="64" width="2" color="teal"></v-progress-circular
              ></v-overlay>

              <v-sheet class="v-sheet--offset mx-auto title text-center stats-title" color="indigo" elevation="6" dark>
                -
              </v-sheet>

              <v-card-text>
                <div class="headline text-center">
                  <span>-</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>
                  mdi-information-outline
                </v-icon>
                <span class="caption grey--text font-weight-light">...</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-divider class="my-3"></v-divider>

      <!-- Data from Kiera -->
      <v-container>
        <v-expansion-panels>
          <v-expansion-panel v-for="decision in data.decisions" :key="decision._id">
            <!-- Decision row header -->
            <v-expansion-panel-header>
              <v-row no-gutters>
                <v-col cols="8" class="decision-list-title"
                  >{{ decision.name }}
                  <!-- Enabled Icon -->
                  <v-icon color="teal" v-if="decision.enabled">mdi-checkbox-marked-circle</v-icon>
                  <!-- Disabled Icon -->
                  <v-icon color="gray" v-if="!decision.enabled">mdi-close-circle-outline</v-icon>
                </v-col>
                <!-- Right side of row -->
                <v-col cols="4" class="text--secondary">
                  <v-fade-transition leave-absolute>
                    <v-row no-gutters style="width: 100%">
                      <div class="decision-stat">{{ `${decision.options.length} outcomes` || 'no outcomes' }}</div>
                      <div class="decision-stat">
                        {{ decision.counter > 0 ? `${decision.counter} times` : 'not used yet' }}
                      </div>
                      <div class="decision-stat">
                        {{
                          decision.options.length > 0 ? Math.round((1 / decision.options.length) * 100 * 100) / 100 : 0
                        }}
                        %
                      </div>
                    </v-row>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </v-expansion-panel-header>

            <v-divider></v-divider>

            <!-- Inside expanded panel -->
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12">
                  <span class="title">Settings</span>
                </v-col>
                <v-col cols="6" md="2">
                  <v-switch
                    v-model="decision.enabled"
                    label="Enabled"
                    color="teal"
                    class="ma-0 pa-0"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="6" md="2">
                  <v-btn small color="teal" class="white--text">+ Add Outcome</v-btn>
                </v-col>
                <v-col cols="6" md="2">
                  <v-btn small color="primary" class="white--text">Edit Title</v-btn>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row>
                <v-col>
                  <span class="title">Outcomes</span>
                  <DecisionManagerViewOutcome
                    dense
                    v-for="option in decision.options"
                    :key="option._id"
                    :decision="decision"
                    :option="option"
                  >
                  </DecisionManagerViewOutcome>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- No Decisions to display message -->
        <v-row align="center" justify="center" style="height: 300px;" v-if="!isLoading && data.decisions.length === 0">
          <span class="headline"><u>0</u> decisions to show!</span>
        </v-row>
        <v-row align="center" justify="center" v-if="!isLoading && data.decisions.length === 0">
          <router-link to="/">Return to home</router-link>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// API
import { DecisionAPI } from '@/api/decision'

// Components
import DecisionManagerViewOutcome from '@/components/DecisionManagerViewOutcome.vue'

// Defaults
import { $DecisionManagerView } from '@/defaults/decision'

// Objects
import { Decision } from '../objects/decision'

@Component({
  components: {
    DecisionManagerViewOutcome
  }
})
export default class DecisionManagerView extends Vue {
  @Prop({ default: () => $DecisionManagerView })
  private data!: typeof $DecisionManagerView
  private isLoading = false

  private async mounted() {
    this.refreshFromKiera()
  }

  private async refreshFromKiera() {
    this.isLoading = true
    const res = await DecisionAPI.fetchMyDecisions()

    if (res) {
      // Decisions List
      this.data.decisions = res.map(d => new Decision(d))

      console.log(this.data)
    }

    this.isLoading = false
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
</style>
