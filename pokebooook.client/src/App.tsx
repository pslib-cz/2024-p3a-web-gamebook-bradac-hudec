import React from 'react';
import Location from './Location';
import './App.css';

function App() {
    const locationId = 1; // Set this dynamically as needed

    return (
        <div>
            <Location locationId={locationId} />
        </div>
    );
}

export default App;