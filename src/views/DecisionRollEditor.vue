<template>
  <v-row>
    <v-col cols="12">
      <!-- Toolbar -->
      <v-toolbar dense>
        <v-btn icon :loading="isLoading" @click="back"><v-icon>mdi-arrow-left</v-icon></v-btn>
        <v-toolbar-title> Decision Roll Editor</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon class="ml-2" :loading="isLoading" @click="refreshFromKiera">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container v-if="!isLoading && !data.decision._id">
        <!-- No Decision to display message -->
        <v-row align="center" justify="center" style="height: 300px;">
          <span class="headline"><u>No</u> decision to show!</span>
        </v-row>
        <v-row align="center" justify="center">
          <router-link to="/">Return to home</router-link>
        </v-row>
      </v-container>

      <!-- Data from Kiera -->
      <v-container v-if="!isLoading && data.decision._id">
        <v-row>
          <v-col cols="12">
            <span class="title">Settings</span>
          </v-col>
          <v-col class="pt-2" cols="12" sm="4" md="4" lg="4">
            <v-switch
              v-model="data.decision.enabled"
              label="Enabled"
              color="teal"
              class="ma-0 pa-0 ml-2"
              hide-details
              @change="updateDecisionEnabled($event)"
              :disabled="data.decisionUpdatingPropsIsLoading"
              :loading="data.decisionUpdatingPropsIsLoading"
            ></v-switch>
          </v-col>
          <v-col class="pt-2 text-right" cols="12" sm="8" md="8" lg="8">
            <v-btn
              small
              color="teal"
              class="white--text ml-2 mt-2"
              :loading="data.decisionUpdatingPropsIsLoading"
              @click="updateProps"
              >Update</v-btn
            >
            <v-btn
              small
              color="error"
              class="white--text ml-2 mt-2"
              @click="
                data.decisionDeletePrompt = true
                data.decisionDeleteId = data.decision._id
              "
              :loading="data.decisionUpdatingPropsIsLoading"
              >Delete</v-btn
            >
            <v-btn
              small
              :disabled="data.decision.consumeMode === 'Basic'"
              color="indigo"
              class="white--text ml-2 mt-2"
              :loading="data.decisionConsumeModeIsLoading"
              @click="decisionResetConsumed"
              >Reset Consumed</v-btn
            >
            <v-btn
              small
              color="blue"
              class="white--text ml-2 mt-2"
              @click="
                data.decisionNewOutcomeId = data.decision._id
                data.decisionNewOutcomePrompt = true
              "
              :loading="data.decisionUpdatingPropsIsLoading"
              >+ Add Outcome</v-btn
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              readonly
              v-model="data.decision._id"
              label="ID of Decision"
              :id="`copy-id-${data.decision._id}`"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="data.decision.name"
              label="Title / Question"
              @keyup.enter="decisionUpdateName"
              :loading="data.decisionUpdatingPropsIsLoading"
              :disabled="data.decisionUpdatingPropsIsLoading"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-textarea
              v-model="data.decision.description"
              label="Subtitle or Description area"
              rows="1"
              auto-grow
              :loading="data.decisionUpdatingPropsIsLoading"
              :disabled="data.decisionUpdatingPropsIsLoading"
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="2" align="right" class="pa-0"> </v-col>
        </v-row>
        <v-row>
          <!-- <v-col cols="12" sm="6" md="6" lg="6">
            <v-select label="Permission Mode (Allowed scope)" :items="['All', 'None', 'Whitelist']"></v-select>
          </v-col> -->
          <v-col cols="12" sm="6" md="6" lg="6">
            <v-select
              label="Consume Mode"
              v-model="data.decision.consumeMode"
              :items="['Basic', 'Temporarily Consume', 'Consume']"
              :loading="data.decisionUpdatingPropsIsLoading"
              :disabled="data.decisionUpdatingPropsIsLoading"
              @change="decisionUpdateConsumeMode($event)"
            ></v-select>
            <p class="text--secondary caption">
              Basic = Always Available<br />
              Temporarily Consume = Available once per reset<br />
              Consume = Gone until the author resets
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="6" lg="6">
            <v-text-field
              type="number"
              label="Consume Reset in seconds"
              v-model="data.decision.consumeReset"
              required
              :rules="['Required to be at least set to 0']"
            ></v-text-field>
            <p class="text--secondary caption">Applies only to Consume Mode = <b>Temporarily Consume</b></p>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col>
            <span class="title">Outcomes</span>
            <DecisionManagerEditorOutcome
              @refreshFromKiera="refreshFromKiera"
              dense
              v-for="option in data.decision.options"
              :key="option._id"
              :decision="data.decision"
              :option="option"
            >
            </DecisionManagerEditorOutcome>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col>
            <span class="title">Log</span>
            <v-row>
              <v-col col="12">
                <v-simple-table dark>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Run</th>
                        <th class="text-left">Server</th>
                        <th class="text-left">Caller</th>
                        <th class="text-left">Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="entry in data.decision.log" :key="entry._id">
                        <td>{{ entry._id }}</td>
                        <td>{{ entry.serverID }}</td>
                        <td>@{{ entry.callerID }}</td>
                        <td>{{ entry.outcomeContent }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Prompt: Add Outcome -->
        <v-dialog v-model="data.decisionNewOutcomePrompt" max-width="600" persistent>
          <v-card>
            <v-card-title class="headline">New Outcome</v-card-title>

            <v-card-text>
              <v-textarea
                v-model="data.decisionNewOutcomeInput"
                rows="1"
                hint="The [Enter] key has been disabled on this input!"
                :disabled="data.decisionNewOutcomeIsLoading"
                :auto-grow="data.decisionNewOutcomeType === 'markdown'"
              >
                <template v-slot:prepend>
                  <v-menu transition="slide-y-transition" bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn color="indigo" v-on="on" min-width="76px" outlined small>
                        {{ data.decisionNewOutcomeType || 'Type' }}
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(item, i) in ['string', 'image', 'url', 'markdown']"
                        :key="i"
                        @click="data.decisionNewOutcomeType = item"
                      >
                        <v-list-item-title>{{ item }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template></v-textarea
              >
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="gray darken-1"
                :disabled="data.decisionNewOutcomeIsLoading"
                text
                @click="data.decisionNewOutcomePrompt = false"
              >
                Cancel
              </v-btn>

              <v-btn
                color="green darken-1"
                :loading="data.decisionNewOutcomeIsLoading"
                text
                @click="decisionNewOutcome"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- ==================== -->
        <!-- Prompt: Delete Decision Outcome -->
        <v-dialog v-model="data.decisionDeletePrompt" max-width="320" persistent>
          <v-card>
            <v-card-title class="headline">Are you sure?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="gray darken-1"
                :disabled="data.decisionDeleteIsLoading"
                text
                @click="data.decisionDeletePrompt = false"
              >
                No
              </v-btn>

              <v-btn
                color="green darken-1"
                :disabled="data.decisionDeleteIsLoading"
                :loading="data.decisionDeleteIsLoading"
                text
                @click="decisionDelete"
              >
                Yes
              </v-btn>
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

// Components
import DecisionManagerEditorOutcome from '@/components/DecisionManagerEditorOutcome.vue'

// Defaults
import { $DecisionRollEditor } from '@/defaults/decision'

// Objects
import { Decision } from '../objects/decision'

@Component({
  components: {
    DecisionManagerEditorOutcome
  }
})
export default class DecisionRollEditorView extends Vue {
  @Prop({ default: () => $DecisionRollEditor })
  private data!: typeof $DecisionRollEditor
  private isLoading = false

  private async mounted() {
    await this.refreshFromKiera()
  }

  private async refreshFromKiera() {
    this.isLoading = true
    const res = await DecisionAPI.fetchDecision(this.$route.params.id ? this.$route.params.id : '')

    if (res) {
      // Target Decision
      this.data.decision = new Decision(res)
    }

    this.isLoading = false
  }

  private async updateProps() {
    this.data.decisionUpdatingPropsIsLoading = true
    const res = await DecisionAPI.updateProps(this.data.decision)
    if (res) this.data.decision._originalName = this.data.decision.name
    this.data.decisionUpdatingPropsIsLoading = false
  }

  private async updateDecisionEnabled(state: boolean) {
    this.data.decisionUpdatingPropsIsLoading = true
    // Set state
    this.data.decision.enabled = state
    const res = await DecisionAPI.updateProps(this.data.decision)
    if (res) await this.refreshFromKiera()
    this.data.decisionUpdatingPropsIsLoading = false
  }

  private async decisionNewOutcome() {
    this.data.decisionNewOutcomeIsLoading = true
    const res = await DecisionAPI.decisionNewOutcome(
      this.data.decisionNewOutcomeId,
      this.data.decisionNewOutcomeType,
      this.data.decisionNewOutcomeInput
    )

    if (res) {
      this.data.decision.options.push(res)
      this.data.decisionNewOutcomePrompt = false
    }

    this.data.decisionNewOutcomeIsLoading = false
  }

  private async decisionDelete() {
    this.data.decisionDeleteIsLoading = true
    const res = await DecisionAPI.decisionDelete(this.data.decisionDeleteId)

    if (res) {
      await this.refreshFromKiera()
    }

    this.data.decisionDeletePrompt = false
    this.data.decisionDeleteIsLoading = false
  }

  private async decisionUpdateConsumeReset() {
    this.data.decisionConsumeModeIsLoading = true
    await DecisionAPI.decisionUpdateConsumeReset(this.data.decision._id, this.data.decision.consumeReset)
    this.data.decisionConsumeModeIsLoading = false
  }

  private async decisionResetConsumed() {
    this.data.decisionConsumeModeIsLoading = true
    await DecisionAPI.decisionResetConsumed(this.data.decision._id)
    this.data.decisionConsumeModeIsLoading = false
  }

  private back() {
    this.$router.push({ path: '/decision/manager' })
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
