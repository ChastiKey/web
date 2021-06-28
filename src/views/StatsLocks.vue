<template>
  <v-row>
    <v-col cols="12">
      <!-- Toolbar -->
      <v-toolbar elevation="3" dense>
        <v-toolbar-title>🔐 Running Locks Statistics</v-toolbar-title>

        <v-spacer></v-spacer>

        Viewing Data for
        <v-dialog v-if="!isLoading" v-model="data.datePicker" width="290px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              label="View Data for"
              v-bind="attrs"
              v-on="on"
              class="ml-2"
              elevation="0"
              color="green darken-2 white--text"
            >
              <v-icon left> mdi-calendar </v-icon>{{ data.targetDate }}</v-btn
            >
          </template>
          <v-date-picker :events="datePickerDates" v-model="data.targetDate" @input="changeDate"></v-date-picker>
        </v-dialog>

        <v-btn icon :loading="isLoading" @click="refreshDataFromKiera">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>

      <v-row>
        <v-col class="d-flex" cols="12" sm="4" offset-sm="8"> </v-col>
      </v-row>

      <!-- Stats & Charts -->
      <v-row>
        <v-col cols="12" sm="12" md="4" lg="4">
          <!-- Stats -->
          <v-card elevation="1">
            <v-sheet class="v-sheet--offset title text-center stats-title" color="cyan darken-2" elevation="2" dark>
              Running Locks
            </v-sheet>
            <v-card-text class="headline text-center"> 🔒 {{ data.totalLocks }} </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-card elevation="1">
            <v-sheet
              class="v-sheet--offset title text-center stats-title"
              color="light-blue darken-2"
              elevation="2"
              dark
            >
              Locks Frozen
            </v-sheet>
            <v-card-text class="headline text-center"> ❄️ {{ data.frozenLocks }} </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="12" md="4" lg="4">
          <v-card elevation="1">
            <v-sheet class="v-sheet--offset title text-center stats-title" color="cyan darken-2" elevation="2" dark>
              Keyholder <small>vs</small> Bot <small>vs</small> Self
            </v-sheet>
            <v-card-text class="headline text-center">
              <span>🔑 {{ data.keyholderLocks }}</span> • <span>🤖 {{ data.botLocks }}</span> •
              <span>🔐 {{ data.selfLocks }}</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-card elevation="1">
            <v-sheet class="v-sheet--offset title text-center stats-title" color="cyan darken-2" elevation="2" dark>
              Keyholders Trusted Locks
            </v-sheet>
            <v-card-text class="headline text-center">
              🤝 {{ Math.round(data.keyholderTrust * 100 * 100) / 100 }}%
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-card elevation="1">
            <v-sheet class="v-sheet--offset title text-center stats-title" color="cyan darken-2" elevation="2" dark>
              Keyholders w/Lockees
            </v-sheet>
            <v-card-text class="headline text-center"> 🔑 {{ data.keyholdersCount }} </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-card elevation="1">
            <v-sheet class="v-sheet--offset title text-center stats-title" color="cyan darken-2" elevation="2" dark>
              Cumulative Keyholders Rating
            </v-sheet>
            <v-card-text class="headline text-center">
              🌟 {{ Math.round(data.keyholderAvgRating * 100) / 100 }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-card elevation="1">
            <apexchart
              type="bar"
              :options="data.distributionByInterval.chartOptions"
              :series="data.distributionByInterval.series"
              height="300px"
            />
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-card elevation="1">
            <apexchart
              type="donut"
              :options="data.distributionByLockType.chartOptions"
              :series="data.distributionByLockType.series"
              height="300px"
            />
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-card elevation="1">
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
          <v-card elevation="1">
            <apexchart
              type="bar"
              :options="data.distributionByLockLength.chartOptions"
              :series="data.distributionByLockLength.series"
              height="450px"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-card elevation="1">
        <v-card-title>
          <v-text-field v-model="khSearch" append-icon="mdi-magnify" label="Search" dense hide-details></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="tableHeadersVariable"
          :items="data.keyholders"
          :items-per-page="20"
          :search="khSearch"
          class="elevation-1"
        >
          <!-- KH Name -->
          <template v-slot:[`item.keyholder`]="{ item }">
            <router-link :to="{ path: `/user/${item.keyholder}` }">{{ item.keyholder }}</router-link>
          </template>
          <!-- KH Level -->
          <template v-slot:[`item.level`]="{ item }">
            <v-chip
              class="ma-2"
              :style="[{ color: getLevelColorText(item.level) }]"
              :color="getLevelColor(item.level)"
              label
              small
              >{{ getLevelName(item.level) }}</v-chip
            >
          </template>
          <!-- Info Frozen % -->
          <template v-slot:[`item.frozen`]="{ item }">
            <v-chip class="ma-2" :color="getFrozenPercColor(item.frozen)" label small
              >{{ Math.round(item.frozen) }}%</v-chip
            >
          </template>
          <!-- Info Hidden % -->
          <template v-slot:[`item.infoHidden`]="{ item }">
            <v-chip class="ma-2" color="gray" label small>{{ Math.round(item.infoHidden) }}%</v-chip>
          </template>
          <!-- KH Rating % -->
          <template v-slot:[`item.averageKeyholderRating`]="{ item }">
            <v-chip v-if="item.averageKeyholderRating === 0" class="ma-2" color="gray" label small>N/A</v-chip>
            <v-chip
              v-else
              class="ma-2"
              style="color: #fff;"
              :color="getRatingColor(item.averageKeyholderRating)"
              label
              small
              >{{ Math.round(item.averageKeyholderRating * 100) / 100 }}</v-chip
            >
          </template>
          <!-- Trust % -->
          <template v-slot:[`item.trust`]="{ item }">
            <v-chip class="ma-2" color="gray" label small>{{ Math.round(item.trust) }}%</v-chip>
          </template>
        </v-data-table>
      </v-card></v-col
    >
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { Component, Prop, Watch } from 'vue-property-decorator'

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
  private khSearch = ''
  private tableHeadersVariable = [
    { text: 'Keyholder', value: 'keyholder' },
    { text: 'Level', value: 'level' },
    { text: 'Running Locks', value: 'runningLocks' },
    { text: 'Unique Locks', value: 'uniqueLockeeCount' },
    { text: 'Fixed', value: 'fixed' },
    { text: 'Variable', value: 'variable' },
    { text: 'Frozen', value: 'frozen' },
    { text: 'Info Hidden', value: 'infoHidden' },
    { text: 'Avg Rating', value: 'averageKeyholderRating' },
    { text: 'Trust', value: 'trust' }
  ]

  private get datePickerDates() {
    const dates = [
      ...new Set(
        this.data.ranges.map(d => {
          return moment.utc(d).format('YYYY-MM-DD')
        })
      )
    ]

    console.log(dates)
    return dates
  }

  private async mounted() {
    if (this.data.keyholderLocks === 0) {
      this.refreshDataFromKiera()
    }
  }

  private async refreshDataFromKiera(date?: string) {
    this.isLoading = true
    const res = await StatsAPI.fetchLocksStats(date)

    if (res) {
      // Set dates
      this.data.targetDate = moment.utc(res.date).format('YYYY-MM-DD')
      this.data.ranges = res.ranges
      this.data.keyholders = res.keyholders
      this.data.keyholderLocks = res.stats.keyholderLocks
      this.data.keyholdersCount = res.stats.keyholdersCount
      this.data.keyholderAvgRating = res.stats.keyholderAvgRating
      this.data.selfLocks = res.stats.selfLocks
      this.data.botLocks = res.stats.botLocks
      this.data.totalLocks = res.stats.totalLocks
      this.data.keyholderTrust = res.stats.keyholderTrust
      this.data.botTrust = res.stats.botTrust
      this.data.frozenLocks = res.stats.frozenLocks
      this.data.distributionByInterval.series = [{ name: 'Count', data: res.stats.distributionByInterval }]
      this.data.distributionByLockType.series = [res.stats.fixedLocks, res.stats.variableLocks]
      this.data.distributionByCardsRemaining.series = [
        res.stats.distributionByCardsRemaining.resetCards,
        res.stats.distributionByCardsRemaining.greenCards,
        res.stats.distributionByCardsRemaining.yellowCards,
        res.stats.distributionByCardsRemaining.redCards,
        res.stats.distributionByCardsRemaining.doubleUpCards,
        res.stats.distributionByCardsRemaining.freezeCards,
        res.stats.distributionByCardsRemaining.stickyCards
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

  private getFrozenPercColor(perc: number) {
    if (perc <= 25 && perc > 0) return 'light-blue lighten-5'
    if (perc <= 50 && perc > 25) return 'light-blue lighten-4'
    if (perc <= 75 && perc > 50) return 'light-blue lighten-3'
    if (perc <= 100 && perc > 75) return 'light-blue lighten-2'
    return 'gray'
  }

  private getLevelName(level: number) {
    if (level === 1) return 'Novice' // #904fad
    if (level === 2) return 'Keyholder' // #a069ba
    if (level === 3) return 'Established' // #b184c7
    if (level === 4) return 'Distinguished' // #c19ed4
    if (level === 5) return 'Renowned' // #d1b8e1
    return 'Pending'
  }

  private getLevelColor(level: number) {
    if (level === 1) return '#904fad'
    if (level === 2) return '#a069ba'
    if (level === 3) return '#b184c7'
    if (level === 4) return '#c19ed4'
    if (level === 5) return '#d1b8e1'
    return 'gray'
  }

  private getLevelColorText(level: number) {
    if (level === 1) return '#fff'
    if (level === 2) return '#fff'
    if (level === 3) return '#000000de'
    if (level === 4) return '#000000de'
    return '#000000de'
  }

  private getRatingColor(rating: number) {
    if (rating < 3) return 'red'
    if (rating >= 3 && rating < 4) return 'yellow'
    if (rating >= 4 && rating < 4.5) return 'light-green darken-2'
    if (rating >= 4 && rating < 4.75) return 'green darken-1'
    return 'green darken-3'
  }

  private async changeDate(selectedDate: string) {
    this.data.datePicker = false
    console.log('Asking server for new data', selectedDate)
    if (!this.isLoading) {
      await this.refreshDataFromKiera(moment(selectedDate).format('YYYY-MM-DD'))
    }
  }
}
</script>

<style lang="less" scoped>
.stats-title {
  font-weight: 300;
  border-radius: 4px 4px 0 0;
}
</style>
