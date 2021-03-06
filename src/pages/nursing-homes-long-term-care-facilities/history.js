import React from 'react'
import { graphql } from 'gatsby'
import TableResponsive from '~components/common/table-responsive'
import Layout from '~components/layout'

export default ({ path, data }) => {
  const history = {}

  data.aggregate.nodes.forEach(item => {
    if (typeof history[item.isoDate] === 'undefined') {
      history[item.isoDate] = {
        date: item.date,
        sort: item.isoDate,
        cases: 0,
        deaths: 0,
        facilities: 0,
      }
    }
    Object.keys(item).forEach(key => {
      if (key.search(/posres|posstaff/) > -1) {
        history[item.isoDate].cases += item[key]
      }
      if (key.search(/deathres|deathstaff/) > -1) {
        history[item.isoDate].deaths += item[key]
      }
      if (key.search('outbrkfac') > -1) {
        history[item.isoDate].facilities += item[key]
      }
    })
  })
  return (
    <Layout
      title="Long-Term Care National Historic Data"
      returnLinks={[{ link: '/nursing-homes-long-term-care-facilities' }]}
      path={path}
    >
      <p>
        Cumulative COVID-19 totals represent total cases, deaths and facilities
        as reported by states and territories. For states who report current
        outbreaks but not cumulative data, CTP carries the highest reported
        outbreak case or death total. Due to outbreak reporting, CTP’s
        aggregated cumulative data for these states under-reports actual
        cumulative totals. This information can be found in our Aggregate
        Dataset. States vary in their reported cumulative data start date. Not
        all states and territories report long-term care data. Total cases
        represent a combined total of resident and staff COVID-19 cases and
        probable cases. Total deaths represent a combined total of resident and
        staff COVID-19 deaths and probable deaths. Total Number of Facilities
        represent the number of facilities affected by COVID-19. This total
        includes Long-Term Care Facilities, Nursing Homes, Skilled Nursing
        Facilities, and Assisted Living Facilities.
      </p>
      <TableResponsive
        labels={[
          {
            field: 'date',
            label: 'Date',
          },

          {
            field: 'cases',
            label: 'Cases',
            isNumeric: true,
          },
          {
            field: 'deaths',
            label: 'Deaths',
            isNumeric: true,
          },
          {
            field: 'facilities',
            label: 'Facilities tracked',
            isNumeric: true,
          },
        ]}
        data={Object.values(history).sort((a, b) => (a.sort < b.sort ? 1 : -1))}
      />
    </Layout>
  )
}

export const query = graphql`
  query {
    aggregate: allCovidLtcStates(
      sort: { fields: date, order: DESC }
      filter: { data_type: { eq: "Aggregate" } }
    ) {
      nodes {
        date(formatString: "MMMM D, YYYY")
        isoDate: date
        posstaff_other
        posstaff_nh
        posstaff_ltc
        posstaff_alf
        posres_other
        posres_nh
        posres_ltc
        posres_alf
        posresstaff_other
        posresstaff_nh
        posresstaff_ltc
        posresstaff_alf
        deathstaff_other
        deathstaff_nh
        deathstaff_ltc
        deathstaff_alf
        deathres_other
        deathres_nh
        deathres_ltc
        deathres_alf
        deathresstaff_other
        deathresstaff_nh
        deathresstaff_ltc
        deathresstaff_alf
        outbrkfac_other
        outbrkfac_nh
        outbrkfac_ltc
        outbrkfac_alf
        probposstaff_other
        probposstaff_nh
        probposstaff_ltc
        probposstaff_alf
        probposresstaff_other
        probposresstaff_nh
        probposresstaff_ltc
        probposresstaff_alf
        probposres_other
        probposres_nh
        probposres_ltc
        probposres_alf
        probdeathstaff_other
        probdeathstaff_nh
        probdeathstaff_ltc
        probdeathstaff_alf
        probdeathresstaff_other
        probdeathresstaff_nh
        probdeathresstaff_ltc
        probdeathresstaff_alf
        probdeathres_other
        probdeathres_nh
        probdeathres_ltc
        probdeathres_alf
        data_type
      }
    }
  }
`
