import React from 'react'
import { render } from 'react-dom'
import PivotTableUI from 'react-pivottable/PivotTableUI'
import 'react-pivottable/pivottable.css'
import TableRenderers from 'react-pivottable/TableRenderers'
import Plot from 'react-plotly.js'
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers'
import {aggregators, aggregatorTemplates} from 'react-pivottable/Utilities'

const renderers = Object.assign({}, TableRenderers, createPlotlyRenderers(Plot))

function num_format(x) {
  if (isNaN(x) || !isFinite(x)) {
    return '';
  }
  return (x < 0 ? '-' : '')+Math.floor(Math.abs(x.toFixed(2))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (Math.abs(x)%1).toFixed(2).replace(/0*$/,'').replace(/\.$/,'').substr(1)
}

function exp_format(x) {
  return num_format(Math.exp(x))
}

function exp_pct_format(x) {
  return num_format((Math.exp(x) - 1)*100)
}

aggregators['Exp Sum'] = aggregatorTemplates.sum(exp_format)
aggregators['Exp Avg'] = aggregatorTemplates.average(exp_format)
aggregators['Exp Stdev'] = aggregatorTemplates.stdev(1, exp_format)

aggregators['Exp % Sum'] = aggregatorTemplates.sum(exp_pct_format)
aggregators['Exp % Avg'] = aggregatorTemplates.average(exp_pct_format)
aggregators['Exp % Stdev'] = aggregatorTemplates.stdev(1, exp_pct_format)

class App extends React.Component
{
  constructor(props) {
    super(props)
    let data = document.getElementById('df').innerHTML.trim().split(/\r?\n/).map(function(x) {
      return x.split(',').map(function(str) {
        return str.replace(/(^"|"$)/g, '')
      })
    })
    this.state = {data, ...window.ptc}
  }

  render() {
    return (
      <PivotTableUI
        onChange={s => this.setState(s)}
        renderers={renderers}
        {...this.state}
      />
    )
  }
}

render(<App/>, document.getElementById("root"))
