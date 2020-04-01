import * as React from 'react';
import axios from "axios"
import ReactTable from "react-table"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import "react-table/react-table.css";
import Modal from 'react-modal';

let countries = [];
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class DataTable extends React.Component {
    state = {
        data: [],
        filteredData: [],
        countries: [],
        modal: false,
        payload:{
            name:"",
            country:"",
            isCovidPositive:"",
            age:null,
        }
    };

    componentDidMount() {
        const self = this;
        axios.get(`http://204.236.246.168:8090/api/v1/citizens`)
            .then((res) => {
                console.log("res---",res.data)
                res.data.map(elem => !countries.includes(elem.country)?countries.push(elem.country):"");
                console.log("conut",countries)
                self.setState({
                    data: res.data,
                    filteredData: res.data
                })
            })
    }
    addUser = () =>{
        axios.post("http://204.236.246.168:8090/api/v1/citizens",this.state.payload)
            .then((res) => {
                this.setState({modal:false})
            })
    }
    updateStatus=(row)=>{
        let id=row.id;
        let status=row.isCovidPositive.toUpperCase() === "YES"   ? "NO" : "YES";
        axios.put("http://204.236.246.168:8090/api/v1/citizens/"+row.id+"/status/"+status,this.state.payload)
            .then((res) => {
                this.componentDidMount();
            })
    }
    filterHandler = (event) => {
        if (event.target.value === '') {
            this.setState({filteredData: this.state.data})
        } else {
            var res = this.state.data.filter(elem => elem.country === event.target.value)
            this.setState({filteredData: res})
        }
    }
    afterOpenModal = () => {
    }
    closeModal = () => {
        this.setState({modal: false})
    }
    onChangeHandler = event => {
        let id=event.target.id;
        switch (id) {
            case "name":
                this.setState({ payload: { ...this.state.payload, name: event.target.value} });
                break;
            case "country":
                this.setState({ payload: { ...this.state.payload, country: event.target.value} });
                break;
            case "age":
                this.setState({ payload: { ...this.state.payload, age: event.target.value} });
                break;
            case "isCovidPositive":
                this.setState({ payload: { ...this.state.payload, isCovidPositive: event.target.value} });
                break;
            default:
                break;
        }

    }

    render() {

        const columns = [
            {
            Header: 'Country',
            accessor: 'country',
            filterable: true,
            style: {
                textAlign: "left"
            }
        }, {
            Header: 'Name',
            accessor: 'name',
            filterable: true,
            style: {
                textAlign: "left"
            }
        }, {
            Header: 'isCovidPositive',
            accessor: 'isCovidPositive',
            filterable: false,
            style: {
                textAlign: "left"
            },
            width: 100
        }, {
            Header: 'age',
            accessor: 'age',
            style: {
                textAlign: "left"
            }
        }, {
            Header: 'Actions',
            Cell: props => {
                return (
                    <div>
                        <button onClick={()=>this.updateStatus(props.original)}>
                            <FontAwesomeIcon icon={faEye}/>
                        </button>
                    </div>
                )
            }, style: {
                textAlign: "left"
            },
            width: 100
        }]

        return (
            <div>
                <div style={{"position": "absolute", left: 30, top: 10, height: 20, bottom: 0}}>
                    <select id="id" onChange={this.filterHandler} style={{height: 40, fontSize: 30}}>
                        <option value="" style={{fontSize: 20}}>--- Country---</option>
                        {
                            countries && countries.map(country => {
                                return <option value={country} key={country} style={{fontSize: 20}}>{country}</option>
                            })
                        }
                    </select>
                </div>
                <div style={{"position": "absolute", right: 30, top: 10, bottom: 0}}>
                    <button style={{height: 40, fontSize: 20}} onClick={e => {
                        this.setState({modal: true})
                    }}
                    > Add Citizen
                    </button>
                </div>
                <ReactTable
                    data={this.state.filteredData}
                    columns={columns}
                    defaultPageSize={10}
                    noDataText={"No Data Found"}
                >
                </ReactTable>
                {this.state.modal ?
                    <Modal
                        isOpen={this.state.modal}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                    >

                        <form>
                            <input type="text" id="name" className="form-control" placeholder="Enter  name"
                                   style={{fontSize: 20, height: 20, width: 300,padding:10, margin:10}} required
                                   onChange={this.onChangeHandler}
                            /><br/> <input type="text" id="country" className="form-control" placeholder="Enter  Country"
                                   style={{fontSize: 20, height: 20, width: 300,padding:10, margin:10}} required
                                   onChange={this.onChangeHandler}
                            /><br/> <input type="text" id="age" className="form-control" placeholder="Enter  Age"
                                   style={{fontSize: 20, height: 20, width: 300,padding:10, margin:10}} required
                                   onChange={this.onChangeHandler}
                            /><br/> <input type="text" id="isCovidPositive" className="form-control" placeholder="Is Covid Positive"
                                   style={{fontSize: 20, height: 20, width: 300,padding:10, margin:10}} required
                                   onChange={this.onChangeHandler}
                            /><br/>

                            <button type="submit" className="btn btn-success"  onClick={this.addUser}
                                    style={{"position": "relative", left: 120, fontSize:20, margin:5, padding:10, top: 10, bottom: 0 }}>Save</button>

                        </form>
                    </Modal> : ""}
            </div>
        );
    }
}

export default DataTable;
