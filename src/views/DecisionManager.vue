<template>
  <v-row>
    <v-col cols="12">
      <!-- Toolbar -->
      <v-toolbar dense>
        <v-toolbar-title>Decision Manager</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn outlined color="success" :loading="isLoading" @click="data.decisionNewPrompt = true">
          <v-icon>mdi-plus</v-icon> New
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
                Total Outcomes Across
              </v-sheet>

              <v-card-text>
                <div class="headline text-center">
                  <span>{{
                    data.decisions.length > 0
                      ? data.decisions.map(d => d.options.length).reduce((acc, cur) => acc + cur)
                      : 0
                  }}</span>
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
                <v-col cols="12" md="6">
                  <v-text-field
                    readonly
                    v-model="decision._id"
                    label="ID of Decision"
                    :hint="`use in chat: !decision roll ${decision._id}`"
                    :id="`copy-id-${decision._id}`"
                    persistent-hint
                  >
                    <!-- <template v-slot:append>
                      <v-btn @click="copyToClipboard(decision._id)"><v-icon>mdi-clipboard</v-icon></v-btn>
                    </template> -->
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="decision.description"
                    label="Subtitle or Description area"
                    rows="1"
                    auto-grow
                    persistent-hint
                  >
                  </v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6" align="right" class="pa-0">
                  <v-btn
                    small
                    color="green"
                    class="white--text ml-2 mt-2"
                    :disabled="decision._originalDescription === decision.description || isLoading"
                    @click="decisionUpdateDescription(decision._id, decision.description)"
                    >Save Description</v-btn
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <span class="title">Settings</span>
                </v-col>
                <v-col class="pt-2" cols="12" sm="6" md="6" lg="6">
                  <v-switch
                    v-model="decision.enabled"
                    label="Enabled"
                    color="teal"
                    class="ma-0 pa-0 ml-2"
                    hide-details
                    @change="updateDecisionEnabled(decision._id, $event)"
                    :disabled="data.decisionEnabledIsLoading"
                    :loading="data.decisionEnabledIsLoading"
                  ></v-switch>
                </v-col>
                <v-col class="pt-2 text-right" cols="12" sm="6" md="6" lg="6">
                  <v-btn
                    small
                    color="teal"
                    class="white--text ml-2 mt-2"
                    @click="
                      data.decisionNewOutcomeId = decision._id
                      data.decisionNewOutcomePrompt = true
                    "
                    >+ Add Outcome</v-btn
                  >
                  <v-btn
                    small
                    color="primary"
                    class="white--text ml-2 mt-2"
                    @click="
                      data.decisionRenamePrompt = true
                      data.decisionRenameId = decision._id
                    "
                    >Edit Title</v-btn
                  >
                  <v-btn
                    small
                    color="error"
                    class="white--text ml-2 mt-2"
                    @click="
                      data.decisionDeletePrompt = true
                      data.decisionDeleteId = decision._id
                    "
                    >Delete Decision</v-btn
                  >
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row>
                <v-col>
                  <span class="title">Outcomes</span>
                  <DecisionManagerViewOutcome
                    @refreshFromKiera="refreshFromKiera"
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

        <!-- ==================== -->
        <!-- Prompt: Rename Decision -->
        <v-dialog v-model="data.decisionRenamePrompt" max-width="320" persistent>
          <v-card>
            <v-card-title class="headline">Change Decision Name</v-card-title>

            <v-card-text>
              <v-text-field
                v-model="data.decisionRenameInput"
                :disabled="data.decisionRenameIsLoading"
                :placeholder="findDecision(data.decisionRenameId).name"
                @keyup.enter="decisionUpdateName"
              ></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="gray darken-1"
                :disabled="data.decisionRenameIsLoading"
                text
                @click="data.decisionRenamePrompt = false"
              >
                Cancel
              </v-btn>

              <v-btn color="green darken-1" :loading="data.decisionRenameIsLoading" text @click="decisionUpdateName">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

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
              >
                Cancel
              </v-btn>

              <v-btn color="green darken-1" :loading="data.decisionNewIsLoading" text @click="decisionNew">
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
    await this.refreshFromKiera()
  }

  private findDecision(_id: string) {
    return this.data.decisions.find(d => d._id === _id) || new Decision()
  }

  private async refreshFromKiera() {
    this.isLoading = true
    const res = await DecisionAPI.fetchMyDecisions()

    if (res) {
      // Decisions List
      this.data.decisions = res.map(d => new Decision(d))
    }

    this.isLoading = false
  }

  private async decisionUpdateName() {
    this.data.decisionRenameIsLoading = true
    const res = await DecisionAPI.updateDecisionName(this.data.decisionRenameId, this.data.decisionRenameInput)

    if (res) {
      this.findDecision(this.data.decisionRenameId).name = this.data.decisionRenameInput
      this.data.decisionRenamePrompt = false
    }

    this.data.decisionRenameIsLoading = false
  }

  private async updateDecisionEnabled(_id: string, state: boolean) {
    this.data.decisionEnabledIsLoading = true
    const res = await DecisionAPI.updateDecisionEnabled(_id, state)

    if (res) {
      await this.refreshFromKiera()
    }

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
      this.findDecision(this.data.decisionNewOutcomeId).options.push(res)

      this.data.decisionNewOutcomePrompt = false
    }

    this.data.decisionNewOutcomeIsLoading = false
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

  private async decisionDelete() {
    this.data.decisionDeleteIsLoading = true
    const res = await DecisionAPI.decisionDelete(this.data.decisionDeleteId)

    if (res) {
      await this.refreshFromKiera()
    }

    this.data.decisionDeletePrompt = false
    this.data.decisionDeleteIsLoading = false
  }

  private async decisionUpdateDescription(_id: string, text: string) {
    this.isLoading = true
    const res = await DecisionAPI.decisionUpdateDescription(_id, text)

    if (res) {
      this.findDecision(_id)._originalDescription = text
    } else {
      this.refreshFromKiera()
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
