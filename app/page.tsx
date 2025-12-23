'use client';

import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Button, Paper,
  TextField, InputAdornment, IconButton, Stack,
  Chip, Divider, CircularProgress
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Send as SendIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setAnswer(''); // Reset answer when a new file is uploaded
    }
  };

  const handleAsk = async () => {
    if (!file || !question) return;
    setAnswer('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('question', question);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setAnswer(data.answer || data.preview); // Show AI answer
    } catch (error) {
      console.error("Error asking question:", error);
      setAnswer("Sorry, something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>

        {/* Header Section */}
        <Box textAlign="center">
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
            File Buddy 2.0
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload your PDF, Word, or TXT files and ask questions instantly.
          </Typography>
        </Box>

        {/* Upload Section */}
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            borderStyle: 'dashed',
            borderWidth: 2,
            textAlign: 'center',
            bgcolor: 'action.hover',
            transition: 'all 0.3s ease',
            '&:hover': { bgcolor: 'action.selected', borderColor: 'primary.main' }
          }}
        >
          <input
            accept=".pdf,.doc,.docx,.txt"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Stack spacing={2} alignItems="center" sx={{ cursor: 'pointer' }}>
              <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.light' }} />
              <Typography variant="h6">
                {file ? file.name : "Click to upload or drag and drop"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supported formats: PDF, DOCX, TXT (Max 10MB)
              </Typography>
              <Button variant="contained" component="span" sx={{ pointerEvents: 'none' }}>
                {file ? "Change File" : "Select File"}
              </Button>
            </Stack>
          </label>
        </Paper>

        {/* Chat Interface */}
        <Box sx={{
          opacity: file ? 1 : 0.5,
          pointerEvents: file ? 'auto' : 'none',
          transition: '0.3s'
        }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionIcon /> Ask about your document
          </Typography>

          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            {/* Answer Display Area */}
            <Box sx={{
              minHeight: '150px',
              maxHeight: '400px',
              overflowY: 'auto',
              mb: 2,
              display: 'flex',
              flexDirection: 'column', // Allow title and text to stack
              alignItems: answer ? 'flex-start' : 'center',
              justifyContent: answer ? 'flex-start' : 'center',
              bgcolor: '#f9f9f9',
              p: 3, // Increased padding
              borderRadius: 2,
              border: '1px solid',
              borderColor: answer ? 'primary.light' : 'divider'
            }}>
              {loading ? (
                <Stack alignItems="center" spacing={1}>
                  <CircularProgress size={30} />
                  <Typography variant="caption">AI is reading your file...</Typography>
                </Stack>
              ) : (
                <>
                  {answer && (
                    <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      AI Response:
                    </Typography>
                  )}
                  <Typography
                    variant="body1"
                    color={answer ? "text.primary" : "text.disabled"}
                    sx={{
                      whiteSpace: 'pre-wrap',
                      width: '100%',
                      textAlign: answer ? 'left' : 'center'
                    }}
                  >
                    {answer || "The AI is ready. Ask your first question below!"}
                  </Typography>
                </>
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              placeholder="e.g., Summarize the main points of this document..."
              variant="outlined"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        color="primary"
                        onClick={handleAsk}
                        disabled={!question || loading}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Paper>
        </Box>

        {/* Quick Actions */}
        <Stack direction="row" spacing={1} justifyContent="center">
          <Chip label="Summarize" onClick={() => { setQuestion("Summarize this document"); }} disabled={!file || loading} clickable />
          <Chip label="Key Insights" onClick={() => { setQuestion("What are the key insights?"); }} disabled={!file || loading} clickable />
          <Chip label="Extract Dates" onClick={() => { setQuestion("List all important dates found in this text"); }} disabled={!file || loading} clickable />
        </Stack>
      </Box>
    </Container>
  );
}