import React, { Component } from "react";
import "./App.css";

const formatNumber = (number) => new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      newData: [],
      searchVal: '',
      caseSen: false,
      exactMatch: false,
    }
  }
  componentDidMount() {
    this.getData()
  }
  totalRevenue = (data) => {
    let price = 0;
    for (let i = 0; i < data.length; i++) {
      price += (data[i].sold * data[i].unitPrice)
    }
    return price
  }
  parseData = (data) => {
    let a = {}
    for (let i = 0; i < data.length; i++) {
      if (!a[data[i].id]) {
        a[data[i].id] = data[i]
      } else {
        a[data[i].id].sold = a[data[i].id].sold + data[i].sold
      }
    }
    let res = []
    Object.keys(a).forEach(key => {
      res.push(a[key])
    })
    res.sort((a, b) => {
      return a.name > b.name ? 1 : a.name < b.name ? -1 : 0
    })
    this.setState({ data: res, newData: res })
  }

  getData = () => {
    let urls = [
      'api/branch1.json',
      'api/branch2.json',
      'api/branch3.json'
    ];

    // map every url to the promise of the fetch
    let requests = urls.map(url => fetch(url));
    let res = []
    // Promise.all waits until all jobs are resolved
    Promise.all(requests)
      .then((responses) => responses.forEach(
        async response => {
          response = await response.json()
          res = [...res, ...response.products]
          this.parseData(res);
        }
      ));
  }
  searchProduct = (text) => {
    this.setState({ searchVal: text })
    if (text.trim().length === 0)
      {
        // this.setState({newData:this.state.data})
        return
      }
    let newData=''
    if (this.state.exactMatch && this.state.caseSen) {
      newData = this.state.data.filter((item) => {
        return item.name===text
      })
    }else if(this.state.exactMatch){
      newData = this.state.data.filter((item) => {
        return item.name.toLowerCase()===(text.toLowerCase()) || item.name===text
      })
    }else if(this.state.caseSen){
      newData = this.state.data.filter((item) => {
        return item.name.includes(text)
      })
    }else{
      newData = this.state.data.filter((item) => {
        return item.name.toLowerCase().includes(text.toLowerCase())
      })
    }
    this.setState({ newData })
  }
  extarOption = (e) => {
    var element = document.getElementById(e.target.id);
    if (element.id === 'caseSen') {
      element.classList.toggle("caseSen");
      this.setState({ caseSen: !this.state.caseSen },()=>this.searchProduct(this.state.searchVal))
    } else {
      element.classList.toggle("exactMatch");
      this.setState({ exactMatch: !this.state.exactMatch },()=>this.searchProduct(this.state.searchVal))
    }
  }
  render() {
    return (
      <div className="product-list">
        <div className="middle">
          <div style={{ position: 'relative' }}>
            <label>Search Products</label>
            <div className="extra">
              <label id="caseSen" onClick={e => this.extarOption(e)}>Aa</label>
              <label id='exactMat' onClick={e => this.extarOption(e)}>Ab</label>
            </div>
          </div>
          <input type="text" value={this.state.searchVal} onChange={e => this.searchProduct(e.target.value)} />
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {this.state.newData.length > 0 && this.state.newData.map((item) => {
              return <tr key={item.id}>
                <td>{item.name}</td>
                <td>{formatNumber(item.sold * item.unitPrice)}</td>
              </tr>
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>{formatNumber(this.totalRevenue(this.state.newData))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default App;
