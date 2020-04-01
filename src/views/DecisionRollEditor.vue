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
          <v-col class="pt-2" cols="12" sm="6" md="6" lg="6">
            <v-switch
              v-model="data.decision.enabled"
              label="Enabled"
              color="teal"
              class="ma-0 pa-0 ml-2"
              hide-details
              @change="updateDecisionEnabled($event)"
              :disabled="data.decisionEnabledIsLoading"
              :loading="data.decisionEnabledIsLoading"
            ></v-switch>
          </v-col>
          <v-col class="pt-2 text-right" cols="12" sm="6" md="6" lg="6">
            <v-btn
              :disabled="data.decision.consumeMode === 'Basic'"
              color="blue"
              class="white--text ml-2 mt-2"
              :loading="data.decisionConsumeModeIsLoading"
              @click="decisionResetConsumed"
              >Reset Consumed</v-btn
            >
            <v-btn
              color="teal"
              class="white--text ml-2 mt-2"
              @click="
                data.decisionNewOutcomeId = data.decision._id
                data.decisionNewOutcomePrompt = true
              "
              >+ Add Outcome</v-btn
            >
            <v-btn
              color="error"
              class="white--text ml-2 mt-2"
              @click="
                data.decisionDeletePrompt = true
                data.decisionDeleteId = data.decision._id
              "
              >Delete Decision</v-btn
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
            <v-text-field v-model="data.decision.name" label="Title / Question" @keyup.enter="decisionUpdateName">
              <template v-slot:append>
                <v-btn
                  v-if="data.decision._originalName !== data.decision.name"
                  small
                  color="green"
                  class="white--text ma-0"
                  :disabled="data.decision._originalName === data.decision.name || data.decisionRenameIsLoading"
                  :loading="data.decisionRenameIsLoading"
                  @click="decisionUpdateName"
                  >Save</v-btn
                >
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-textarea v-model="data.decision.description" label="Subtitle or Description area" rows="1" auto-grow>
              <template v-slot:append>
                <v-btn
                  v-if="data.decision._originalDescription !== data.decision.description"
                  small
                  color="green"
                  class="white--text ml-2 mt-2"
                  :disabled="
                    data.decision._originalDescription === data.decision.description ||
                      data.decisionDescriptionIsLoading
                  "
                  :loading="data.decisionDescriptionIsLoading"
                  @click="decisionUpdateDescription"
                  >Save</v-btn
                >
              </template>
            </v-textarea>
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
            <v-text-field type="number" label="Consume Reset in seconds" v-model="data.decision.consumeReset">
              <template v-slot:append>
                <v-btn
                  v-if="data.decision._originalConsumeReset !== data.decision.consumeReset"
                  small
                  color="green"
                  class="white--text ml-2 mt-2"
                  :disabled="
                    data.decision._originalConsumeReset === data.decision.consumeReset ||
                      data.decisionConsumeModeResetIsLoading
                  "
                  :loading="data.decisionConsumeModeResetIsLoading"
                  @click="decisionUpdateConsumeReset"
                  >Save</v-btn
                >
              </template></v-text-field
            >
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

  private async decisionUpdateName() {
    this.data.decisionRenameIsLoading = true
    const res = await DecisionAPI.updateDecisionName(this.data.decision._id, this.data.decision.name)
    if (res) this.data.decision._originalName = this.data.decision.name
    this.data.decisionRenameIsLoading = false
  }

  private async updateDecisionEnabled(state: boolean) {
    this.data.decisionEnabledIsLoading = true
    const res = await DecisionAPI.updateDecisionEnabled(this.data.decision._id, state)
    if (res) await this.refreshFromKiera()
    this.data.decisionEnabledIsLoading = false
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

  private async decisionUpdateDescription() {
    this.data.decisionDescriptionIsLoading = true
    const res = await DecisionAPI.decisionUpdateDescription(this.data.decision._id, this.data.decision.description)

    if (res) this.data.decision._originalDescription = this.data.decision.description
    else this.refreshFromKiera()

    this.data.decisionDescriptionIsLoading = false
  }

  private async decisionUpdateConsumeMode() {
    this.data.decisionConsumeModeIsLoading = true
    await DecisionAPI.decisionUpdateConsumeMode(this.data.decision._id, this.data.decision.consumeMode)
    this.data.decisionConsumeModeIsLoading = false
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
