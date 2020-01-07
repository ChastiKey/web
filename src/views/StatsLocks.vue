<template>
  <v-row>
    <v-col cols="12">
      <!-- Toolbar -->
      <v-toolbar dense>
        <v-toolbar-title>Running Locks Statistics</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon :loading="isLoading" @click="refreshDataFromKiera">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Stats & Charts -->
      <div>
        <v-row>
          <v-col cols="12" sm="12" md="4" lg="4">
            <!-- Stats -->
            <v-card>
              <v-sheet class="v-sheet--offset title text-center stats-title" color="cyan darken-2" elevation="6" dark>
                Running Locks
              </v-sheet>
              <v-card-text class="headline text-center">
                {{ data.totalLocks }}
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-card>
              <v-sheet class="v-sheet--offset title text-center stats-title" color="cyan darken-2" elevation="6" dark>
                KH Trusted Locks
              </v-sheet>
              <v-card-text class="headline text-center"> {{ Math.round(data.trust * 10000) / 100 }}% </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-card>
              <v-sheet class="v-sheet--offset title text-center stats-title" color="cyan darken-2" elevation="6" dark>
                Keyholder vs Bot Locks
              </v-sheet>
              <v-card-text class="headline text-center">
                <span>{{ data.keyholderLocks }}</span> •
                <span>{{ data.botLocks }}</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-card>
              <apexchart
                type="bar"
                :options="data.distributionByInterval.chartOptions"
                :series="data.distributionByInterval.series"
                height="300px"
              />
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-card>
              <apexchart
                type="donut"
                :options="data.distributionByLockType.chartOptions"
                :series="data.distributionByLockType.series"
                height="300px"
              />
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-card>
              <apexchart
                type="donut"
                :options="data.distributionByCardsRemaining.chartOptions"
                :series="data.distributionByCardsRemaining.series"
                height="300px"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <apexchart
                type="bar"
                :options="data.distributionByLockLength.chartOptions"
                :series="data.distributionByLockLength.series"
                height="450px"
              />
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// API
import { StatsAPI } from '@/api/'

// Components
import ApexCharts from 'vue-apexcharts'

// Defaults
import { $StatsLocksView } from '@/defaults/stats'

// Objects
import { KeyholderLock } from '@/objects/lock'

@Component({
  components: {}
})
export default class StatsLocksView extends Vue {
  @Prop({ default: () => $StatsLocksView })
  private data!: typeof $StatsLocksView
  private isLoading = false
  private isFirstLoad = true

  private async mounted() {
    if (this.data.keyholderLocks === 0) {
      this.refreshDataFromKiera()
    }
  }

  private async refreshDataFromKiera() {
    this.isLoading = true
    const res = await StatsAPI.fetchLocksStats()

    if (res) {
      this.data.keyholderLocks = res.stats.keyholderLocks
      this.data.botLocks = res.stats.botLocks
      this.data.totalLocks = res.stats.totalLocks
      this.data.trust = res.stats.trust
      this.data.trusted = res.stats.trusted
      this.data.distributionByInterval.series = [{ name: 'Count', data: res.stats.distributionByInterval }]
      this.data.distributionByLockType.series = [res.stats.fixedLocks, res.stats.variableLocks]
      this.data.distributionByCardsRemaining.series = [
        res.stats.distributionByCardsRemaining.resetCards,
        res.stats.distributionByCardsRemaining.greenCards,
        res.stats.distributionByCardsRemaining.yellowCards,
        res.stats.distributionByCardsRemaining.redCards,
        res.stats.distributionByCardsRemaining.doubleUpCards,
        res.stats.distributionByCardsRemaining.freezeCards
      ]
      this.data.distributionByLockLength.series = [
        {
          name: '[Fixed] Number of Locks',
          type: 'bar',
          data: res.stats.distributionByLockedTimeFixed
        },
        {
          name: '[Variable] Number of Locks',
          type: 'bar',
          data: res.stats.distributionByLockedTimeVariable
        },
        {
          name: '[Fixed] Trusted Keyholder',
          type: 'line',
          data: res.stats.distributionByLockedTimeFixedTrusted
        },
        {
          name: '[Variable] Trusted Keyholder',
          type: 'line',
          data: res.stats.distributionByLockedTimeVariableTrusted
        }
      ]
    }

    // Dummy data
    // this.data.distributionByInterval.series = [{ name: 'Count', data: [384, 164, 684, 240, 214, 180, 2412] }]
    // this.data.distributionByLockType.series = [1234, 2645]
    // this.data.distributionByLockLength.series = [
    //   {
    //     name: 'Fixed',
    //     data: [20, 76, 46, 234, 262, 265, 156, 187, 64, 105, 50, 25, 54, 21, 39]
    //   },
    //   {
    //     name: 'Variable',
    //     data: [11, 179, 106, 571, 337, 487, 232, 134, 116, 145, 80, 53, 69, 73, 92]
    //   }
    // ]

    this.isLoading = false
  }
}
</script>

<style lang="less" scoped>
.stats-title {
  font-weight: 300;
  border-radius: 4px 4px 0 0;
}
</style>
