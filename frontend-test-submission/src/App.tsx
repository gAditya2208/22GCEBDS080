import axios from 'axios';
import React, { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { Log } from './logger';

interface URLInput {
  longUrl: string;
  shortcode?: string;
  validity?: number;
}

const API_BASE = process.env.REACT_APP_API_BASE!;
const clientID = process.env.REACT_APP_CLIENT_ID!;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET!;
const accessCode = process.env.REACT_APP_ACCESS_CODE!;
const email = process.env.REACT_APP_EMAIL!;
const name = process.env.REACT_APP_NAME!;
const rollNo = process.env.REACT_APP_ROLL_NO!;

function App() {
  const [urlInputs, setUrlInputs] = useState<URLInput[]>([{ longUrl: '' }]);
  const [results, setResults] = useState<any[]>([]);

  const handleChange = (index: number, field: keyof URLInput, value: string) => {
    const updated = [...urlInputs];
    if (field === 'validity') {
      updated[index][field] = parseInt(value || '0');
    } else {
      updated[index][field] = value;
    }
    setUrlInputs(updated);
  };

  const addInputField = () => {
    if (urlInputs.length >= 5) return;
    setUrlInputs([...urlInputs, { longUrl: '' }]);
  };

  const validateURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    const errors: string[] = [];
    const validInputs = urlInputs.filter(input => input.longUrl.trim() !== '');

    for (let i = 0; i < validInputs.length; i++) {
      if (!validateURL(validInputs[i].longUrl)) {
        errors.push(`Invalid URL at row ${i + 1}`);
      }
    }

    if (errors.length) {
      alert(errors.join('\n'));
      Log("frontend", "error", "component", "Validation failed");
      return;
    }

    const newResults = validInputs.map((input) => {
      const shortcode = input.shortcode?.trim() || Math.random().toString(36).substring(2, 8);
      const expiry = Date.now() + (input.validity ?? 30) * 60000;

      // Save to localStorage
      localStorage.setItem(shortcode, JSON.stringify({
        originalUrl: input.longUrl,
        expiry
      }));

      Log("frontend", "info", "component", `Shortened ${input.longUrl} to ${shortcode}`);

      return {
        shortUrl: `http://localhost:3000/${shortcode}`,
        originalUrl: input.longUrl,
        expiry: new Date(expiry).toLocaleString()
      };
    });

    setResults(newResults);
  };


  return (
    <Paper elevation={3} style={{ padding: 24, margin: 24 }}>
      <Typography variant="h4" gutterBottom>
        AffordMed URL Shortener
      </Typography>

      {urlInputs.map((input, index) => (
        <div key={index} style={{ marginBottom: 16 }}>
          <TextField
            label="Long URL"
            fullWidth
            value={input.longUrl}
            onChange={(e) => handleChange(index, 'longUrl', e.target.value)}
            required
            style={{ marginBottom: 8 }}
          />
          <TextField
            label="Custom Shortcode"
            fullWidth
            value={input.shortcode || ''}
            onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <TextField
            label="Validity (minutes)"
            type="number"
            fullWidth
            value={input.validity || ''}
            onChange={(e) => handleChange(index, 'validity', e.target.value)}
          />
        </div>
      ))}

      <Button
        variant="outlined"
        color="primary"
        onClick={addInputField}
        disabled={urlInputs.length >= 5}
        style={{ marginBottom: 16 }}
      >
        + Add Another URL
      </Button>

      <br />

      <Button variant="contained" color="secondary" onClick={handleSubmit}>
        Shorten URLs
      </Button>

      <br />
      <br />

      {results.length > 0 && (
        <>
          <Typography variant="h5">Shortened URLs:</Typography>
          {results.map((res, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <p>
                <strong>Original:</strong> {res.originalUrl}
              </p>
              <p>
                <strong>Shortened:</strong>{' '}
                <a href={res.shortUrl} target="_blank" rel="noopener noreferrer">
                  {res.shortUrl}
                </a>
              </p>
              <p>
                <strong>Expires:</strong> {res.expiry}
              </p>
              <hr />
            </div>
          ))}
        </>
      )}
    </Paper>
  );
}

export default App;
