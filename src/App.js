import React, { useState } from 'react';
import Select from 'react-select';
import './App.css';  // Add your custom styles here

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);

    const options = [
        { value: 'Alphabets', label: 'Alphabets' },
        { value: 'Numbers', label: 'Numbers' },
        { value: 'Highest lowercase alphabet', label: 'Highest lowercase alphabet' }
    ];

    const handleInputChange = (e) => {
        setJsonInput(e.target.value);
        setError('');
    };

    const validateJSON = (jsonString) => {
        try {
            JSON.parse(jsonString);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!validateJSON(jsonInput)) {
            setError('Invalid JSON format');
            return;
        }

        const requestData = JSON.parse(jsonInput);

        try {
            const res = await fetch('https://your-backend.vercel.app/bfhl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const result = await res.json();
            setResponse(result);
        } catch (error) {
            console.error('Error:', error);

            setError('Error connecting to the server');
        }
    };
    
    const renderFilteredResponse = () => {
        if (!response) return null;

        const { alphabets, numbers, highest_lowercase_alphabet } = response;
        let filteredResponse = {};

        if (selectedOptions.includes('Alphabets')) {
            filteredResponse['Alphabets'] = alphabets.join(', ');
        }
        if (selectedOptions.includes('Numbers')) {
            filteredResponse['Numbers'] = numbers.join(', ');
        }
        if (selectedOptions.includes('Highest lowercase alphabet')) {
            filteredResponse['Highest lowercase alphabet'] = highest_lowercase_alphabet.join(', ');
        }

        return Object.keys(filteredResponse).map(key => (
            <div key={key}>
                <strong>{key}:</strong> {filteredResponse[key]}
            </div>
        ));
    };

    return (
        <div className="App">
            <div className="input-container">
                <label>API Input</label>
                <textarea
                    value={jsonInput}
                    onChange={handleInputChange}
                    placeholder='{"data":["M","1","334","4","B"]}'
                    rows="4"
                    cols="50"
                    className="input-area"
                />
            </div>
            <button onClick={handleSubmit} className="submit-button">Submit</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {response && (
                <>
                    <div className="filter-container">
                        <label>Multi Filter</label>
                        <Select
                            isMulti
                            options={options}
                            onChange={(selected) => setSelectedOptions(selected.map(opt => opt.value))}
                            className="select-dropdown"
                        />
                    </div>
                    <div className="response-container">
                        <h3>Filtered Response</h3>
                        {renderFilteredResponse()}
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
