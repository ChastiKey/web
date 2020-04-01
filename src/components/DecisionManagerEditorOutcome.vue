<template>
  <v-row dense no-gutters>
    <v-col v-if="!data.deleteConfirm" class="pt-2 text-right" cols="12" sm="12" md="12" lg="3">
      <!-- When delete is not triggered show the Delete, Save & Type buttons -->
      <v-btn text color="error" :disabled="isLoading" small @click="data.deleteConfirm = true">Delete</v-btn>
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
          <v-list-item v-for="(item, i) in ['string', 'image', 'url', 'markdown']" :key="i" @click="option.type = item">
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
    <!-- When delete is triggered show the confirm buttons -->
    <v-col v-if="data.deleteConfirm" class="pt-2 text-right" cols="12" sm="12" md="12" lg="3">
      <v-btn color="gray darken-1" small :disabled="isLoading" text @click="data.deleteConfirm = false">
        Cancel
      </v-btn>

      <v-btn
        color="green darken-1"
        small
        :disabled="isLoading"
        :loading="isLoading"
        text
        @click="decisionDeleteOutcome"
      >
        Confirm delete
      </v-btn>
    </v-col>
    <!-- Text field with Outcome text in it -->
    <v-col class="pl-2" cols="12" sm="12" md="12" lg="8">
      <v-textarea
        :disabled="isLoading"
        :auto-grow="option.type === 'markdown'"
        label="Outcome text"
        v-model="option.text"
        rows="1"
        @keyup.enter="data.decisionNewOutcomeType !== 'markdown' ? decisionUpdateOutcome : null"
        dense
        outlined
      >
      </v-textarea>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// API
import { DecisionAPI } from '@/api/decision'

// Objects
import { Decision, DecisionOption } from '@/objects/decision'

@Component({})
export default class DecisionManagerEditorOutcome extends Vue {
  @Prop({ default: () => new Decision() })
  private decision!: Decision
  @Prop({ default: () => new DecisionOption() })
  private option!: DecisionOption
  @Prop({
    default: () => {
      return { deleteConfirm: false }
    }
  })
  private data!: { deleteConfirm: false }
  private isLoading = false

  private async decisionDeleteOutcome() {
    this.isLoading = true
    const res = await DecisionAPI.decisionDeleteOutcome(this.option._id)

    if (res) {
      this.$emit('refreshFromKiera')
    } else {
      this.data.deleteConfirm = false
      this.isLoading = false
    }
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
