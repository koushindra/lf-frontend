import React from 'react';
import './App.css';
import DataTable from "./components/ManageCitizens"


function App() {
    return (
        <div className="App">
            <div>
                <header className="App-header">
                    <p>
                        Citizen List
                    </p>
                </header>
            </div>

            <div>
                <DataTable/>
            </div>

        </div>
    );
}

export default App;
