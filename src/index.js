import React from 'react'
import { render } from 'react-dom'
import PivotTableUI from 'react-pivottable/PivotTableUI'
import 'react-pivottable/pivottable.css'
import TableRenderers from 'react-pivottable/TableRenderers'
import Plot from 'react-plotly.js'
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers'
import {aggregators, aggregatorTemplates} from 'react-pivottable/Utilities'

function returnsColorScaleGenerator(values) {
  var min = Math.min.apply(Math, values);
  var max = Math.max.apply(Math, values);
  return function (x) {
    if (x > 0) {
      let nonGreen = 255 - Math.round(255 * x / max)
      return {backgroundColor: 'rgb(' + nonGreen + ',255,' + nonGreen + ')'}
    } else if (x < 0) {
      var nonRed = 255 - Math.round(255 * x / min)
      return {backgroundColor: 'rgb(255,' + nonRed + ',' + nonRed + ')' }
    } else {
      return {}
    }
  }
}

const renderers = Object.assign({}, TableRenderers, createPlotlyRenderers(Plot))

function num_format(x) {
  if (isNaN(x) || !isFinite(x)) {
    return '';
  }
  if (Math.abs(x) >= 1e8) {
    return x.toExponential(2)
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
        tableColorScaleGenerator={returnsColorScaleGenerator}
        {...this.state}
      />
    )
  }
}

render(<App/>, document.getElementById("root"))
