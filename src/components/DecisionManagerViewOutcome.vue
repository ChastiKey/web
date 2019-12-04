<template>
  <v-row dense no-gutters>
    <v-col class="pt-2 text-right" cols="12" sm="12" md="12" lg="3">
      <v-btn text color="error" :disabled="isLoading" small @click="data.decisionDeleteOutcomePrompt = true"
        >Delete</v-btn
      >
      <v-btn
        text
        color="primary"
        :disabled="(option._originalText === option.text && option._originalType === option.type) || isLoading"
        :loading="isLoading"
        small
        @click="decisionUpdateOutcome"
        >Save</v-btn
      >
      <v-menu transition="slide-y-transition" bottom>
        <template v-slot:activator="{ on }">
          <v-btn color="indigo" :disabled="isLoading" v-on="on" min-width="76px" outlined small>
            {{ option.type || 'Type' }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, i) in ['string', 'image', 'url']" :key="i" @click="option.type = item">
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
    <v-col class="pl-2" cols="12" sm="12" md="12" lg="8">
      <v-text-field :disabled="isLoading" v-model="option.text" dense> </v-text-field>
    </v-col>

    <!-- ==================== -->
    <!-- Prompt: Delete Decision Outcome -->
    <v-dialog v-model="data.decisionDeleteOutcomePrompt" max-width="320" persistent="">
      <v-card>
        <v-card-title class="headline">Are you sure?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="gray darken-1" :disabled="isLoading" text @click="data.decisionDeleteOutcomePrompt = false">
            No
          </v-btn>

          <v-btn color="green darken-1" :disabled="isLoading" :loading="isLoading" text @click="decisionDeleteOutcome">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// API
import { DecisionAPI } from '@/api/decision'

// Defaults
import { $DecisionManagerViewOutcome } from '@/defaults/decision'

// Objects
import { Decision, DecisionOption } from '@/objects/decision'

@Component({})
export default class DecisionManagerViewOutcome extends Vue {
  @Prop({ default: () => new Decision() })
  private decision!: Decision
  @Prop({ default: () => new DecisionOption() })
  private option!: DecisionOption
  @Prop({ default: () => $DecisionManagerViewOutcome })
  private data!: typeof $DecisionManagerViewOutcome

  private isLoading = false

  private async decisionDeleteOutcome() {
    this.isLoading = true
    const res = await DecisionAPI.decisionDeleteOutcome(this.option._id)

    if (res) {
      this.$emit('refreshFromKiera')
      this.data.decisionDeleteOutcomePrompt = false
    }

    this.isLoading = false
  }

  private async decisionUpdateOutcome() {
    this.isLoading = true
    const res = await DecisionAPI.decisionUpdateOutcome(this.option._id, this.option.type, this.option.text)

    if (res) {
      this.option._originalText = this.option.text
      this.option._originalType = this.option.type
    } else {
      this.$emit('refreshFromKiera')
    }

    this.isLoading = false
  }
}
</script>
