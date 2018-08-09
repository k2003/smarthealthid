import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import JSONPretty from 'react-json-pretty';

import Config from './Config'

import { Button, ButtonGroup } from 'react-bootstrap';
import loadgif from './load.gif'
//import MyTable from './MyTable'

/*
   get token
   let res = await axios.post('https://smarthealth.service.moph.go.th/phps/public/api/v3/gettoken', {
     username: 'xxxxx@gmail.com',
     password: 'xxxxxxxxx'
   })
   this.setState({      
     token : res.data.jwt_token
   })*/


class App extends Component {


  state = {
    'token': Config.token,
    'pic': null,
    'person_data': {},
    'loading': false,
    'apiGeneral': 'https://smarthealth.service.moph.go.th/phps/api/person/v2/findby/cid?cid=',
    'apiAddress': 'https://smarthealth.service.moph.go.th/phps/api/address/v1/find_by_cid?cid=',
    'apiDrug': 'https://smarthealth.service.moph.go.th/phps/api/drugallergy/v1/find_by_cid?cid=',
    'apiLink1': 'https://smarthealth.service.moph.go.th/phps/api/00031/009/01',
    'apiLink2': 'https://smarthealth.service.moph.go.th/phps/api/00265/004/02'
  }

  onChange = (e) => {
    this.setState({
      cid: e.target.value
    })
  }
  onSubmit = (e) => {
    e.preventDefault();
    this.process2(this.state.apiGeneral)

  }

  process = async (api) => {
    this.setState({
      loading: true,
    })
    let resp;
    try {
      resp = await axios.get('http://localhost:8084/smartcard/data/')
    } catch (error) {
      console.log(error)
      return;
    }



    if (resp.data.cid) {
      this.setState({
        cid: resp.data.cid,
        pic: 'http://localhost:8084/smartcard/picture/?h=' + Math.random()
      })
    } else {
      alert('Error')
      window.location.reload();
      return;
    }



    let raw = await axios.get(api + resp.data.cid, {
      headers: {
        'jwt-token': this.state.token
      }
    });

    console.log(JSON.stringify(raw.data))
    this.setState({
      person_data: raw.data,
      loading: false
    })
  }

  process2 = async (api) => {

    this.setState({
      loading: true,
      pic: null
    })

    setTimeout(() => {

    })

    let raw = await axios.get(api + this.state.cid, {
      headers: {
        'jwt-token': this.state.token
      }
    });

    console.log(JSON.stringify(raw.data))
    this.setState({
      person_data: raw.data,
      loading: false
    })
  }

  generalClick = () => {
    this.process(this.state.apiGeneral)
  }

  addressClick = () => {
    this.process(this.state.apiAddress)
  }

  drugClick = () => {
    this.process(this.state.apiDrug)
  }

  linkAge1 = async () => {
    let resp = await axios.post(this.state.apiLink1,this.state.cid, {
      headers: {
        'jwt-token': this.state.token
      },
    });
    console.log(JSON.stringify(resp.data))
    if(resp.data.data){
      this.setState({
        person_data:resp.data.data.return
      })
    }
    
  }

  render() {
    return (
      <div className="App">

        <h1 className="App-title">SmartHealthId สสจ.พิษณุโลก</h1>
        <div>กดปุ่มเมื่อไฟเครื่องอ่านหยุดกระพริบ</div>
        <div style={{ padding: 10 }}>
          <ButtonGroup>
            <Button bsStyle="primary" bsSize="large" onClick={this.generalClick} > ทั่วไป </Button>
            <Button bsStyle="success" bsSize="large" onClick={this.addressClick} > ที่อยู่ </Button>
            <Button bsStyle="danger" bsSize="large" onClick={this.drugClick} > แพ้ยา </Button>
            <Button bsSize='large' onClick={this.linkAge1}>linkage-1</Button>
          </ButtonGroup>
          <div style={{ marginTop: 25 }}>
            <form onSubmit={this.onSubmit}>
              
            </form>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          {!this.state.loading ? <div>
            <div>
              <img width={100} height={100} src={this.state.pic} />
            </div>
            <div>

              <JSONPretty id="json-pretty" json={this.state.person_data}></JSONPretty>
            </div>
          </div> : <div><img src={loadgif} /></div>}
        </div>


      </div>
    );
  }
}

export default App;
