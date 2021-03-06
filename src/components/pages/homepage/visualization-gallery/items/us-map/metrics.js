import mapStyle from './us-map.module.scss'

const getAverage = (history, state, value, offset = 0) =>
  history
    .find(group => group.nodes[0].state === state)
    .nodes.slice(offset, offset + 7)
    .reduce((total, item) => total + value(item), 0) / 7

export default {
  casesPer100k: {
    title: 'Average daily new COVID-19 cases per 100k people (past 7 days)',
    subTitle: (now, sevenDaysAgo) => `From ${sevenDaysAgo} to ${now}`,
    getValue: (history, state) =>
      getAverage(
        history,
        state.state,
        item => item.childPopulation.positiveIncrease.per100k,
      ),
    getUsValue: history =>
      history
        .slice(0, 7)
        .reduce(
          (total, item) =>
            total + item.childPopulation.positiveIncrease.per100k,
          0,
        ) / 7,
    getColor: item => {
      if (item > 75) {
        return mapStyle.level4
      }
      if (item > 50) {
        return mapStyle.level3
      }
      if (item > 25) {
        return mapStyle.level2
      }
      return mapStyle.level1
    },
    legend: [
      {
        style: mapStyle.level1,
        label: 'Under 25',
      },
      {
        style: mapStyle.level2,
        label: '26 - 50',
      },
      {
        style: mapStyle.level3,
        label: '51 - 75',
      },
      {
        style: mapStyle.level4,
        label: 'Over 75 cases per 100k',
      },
    ],
    format: value => Math.round(value).toLocaleString(),
  },
  sevenDayPositive: {
    title: 'Average daily new COVID-19 cases (past 7 days)',
    subTitle: (now, sevenDaysAgo) => `From ${sevenDaysAgo} to ${now}`,
    getValue: (history, state) =>
      getAverage(history, state.state, item => item.positiveIncrease),

    getUsValue: history =>
      history
        .slice(0, 7)
        .reduce((total, item) => total + item.positiveIncrease, 0) / 7,
    getColor: item => {
      if (item > 5000) {
        return mapStyle.level4
      }
      if (item > 3000) {
        return mapStyle.level3
      }
      if (item > 2000) {
        return mapStyle.level2
      }
      return mapStyle.level1
    },
    legend: [
      {
        style: mapStyle.level1,
        label: 'Below 2,000',
      },
      {
        style: mapStyle.level2,
        label: '2,000 - 3,000',
      },
      {
        style: mapStyle.level3,
        label: '3,000 - 5,000',
      },
      {
        style: mapStyle.level4,
        label: 'Over 5,000 cases',
      },
    ],
    format: value => Math.round(value).toLocaleString(),
  },
  hospitalizationPer1m: {
    title: 'Currently hospitalized per 1 million people',
    subTitle: now => `Data updated ${now}`,
    getValue: (history, state) =>
      history.find(group => group.nodes[0].state === state.state).nodes[0]
        .childPopulation.hospitalizedCurrently.percent * 1000000,
    getUsValue: history =>
      history[0].childPopulation.hospitalizedCurrently.percent * 1000000,
    getColor: item => {
      if (item > 500) {
        return mapStyle.blueLevel4
      }
      if (item > 250) {
        return mapStyle.blueLevel3
      }
      if (item > 100) {
        return mapStyle.blueLevel2
      }
      return mapStyle.blueLevel1
    },
    legend: [
      {
        style: mapStyle.blueLevel1,
        label: 'Under 100',
      },
      {
        style: mapStyle.blueLevel2,
        label: '100 - 250',
      },
      {
        style: mapStyle.blueLevel3,
        label: '250 - 500',
      },
      {
        style: mapStyle.blueLevel4,
        label: 'Over 500 hospitalizations per 1 million',
      },
    ],
    format: value => Math.round(value).toLocaleString(),
  },
  deathsChange7day: {
    title: 'Change in 7-day average deaths - today vs. previous week',
    subTitle: (now, sevenDaysAgo) => `From ${sevenDaysAgo} to ${now}`,
    getValue: (history, state) => {
      const current = getAverage(
        history,
        state.state,
        item => item.deathIncrease,
      )

      const past = getAverage(
        history,
        state.state,
        item => item.deathIncrease,
        7,
      )

      return (current - past) / past
    },
    getUsValue: history => {
      const current =
        history
          .slice(0, 7)
          .reduce((total, item) => total + item.deathIncrease, 0) / 7

      const past =
        history
          .slice(7, 14)
          .reduce((total, item) => total + item.deathIncrease, 0) / 7
      return (current - past) / past
    },
    getColor: item => {
      if (item > 0.1) {
        return mapStyle.deathsRising
      }
      if (item > -0.1) {
        return mapStyle.deathsSame
      }
      return mapStyle.deathsFalling
    },
    legend: [
      {
        style: mapStyle.deathsFalling,
        label: 'Under -10%',
      },
      {
        style: mapStyle.deathsSame,
        label: '-10% to 10%',
      },
      {
        style: mapStyle.deathsRising,
        label: 'Over 10% change',
      },
    ],
    format: value =>
      Number.isNaN(value) ? '0%' : `${Math.round(value * 100)}%`,
  },
}
