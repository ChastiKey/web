<template>
  <v-expansion-panel>
    <v-expansion-panel-header>{{ decision.name }}</v-expansion-panel-header>

    <v-expansion-panel-content>
      
      <v-list dense>
        <v-subheader>Options</v-subheader>
        <v-list-item v-for="option in decision.options" :key="option._id">
          <v-list-item-content>{{ option.text }} </v-list-item-content></v-list-item
        >
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// Objects
import { Decision } from '@/objects/decision'

@Component({})
export default class DecisionManagerViewEntry extends Vue {
  @Prop({ default: () => new Decision() })
  private decision!: typeof Decision

  private isLoading = false
}
</script>
