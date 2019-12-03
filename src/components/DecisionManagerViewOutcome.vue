<template>
  <v-row dense no-gutters>
    <v-col class="pt-2 text-right" cols="12" sm="12" md="12" lg="3">
      <v-btn text color="error" small>Delete</v-btn>
      <v-btn text color="primary" small>Save</v-btn>
      <v-menu transition="slide-y-transition" bottom>
        <template v-slot:activator="{ on }">
          <v-btn color="indigo" v-on="on" min-width="76px" outlined small>
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
      <v-text-field v-model="option.text" dense> </v-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// Objects
import { Decision, DecisionOption } from '@/objects/decision'

@Component({})
export default class DecisionManagerViewOutcome extends Vue {
  @Prop({ default: () => new Decision() })
  private decision!: typeof Decision
  @Prop({ default: () => new DecisionOption() })
  private option!: typeof DecisionOption

  private isLoading = false
}
</script>
