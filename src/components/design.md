# System Design

## Architecture

Frontend (React)
   ↓
AI Engine (local logic)
   ↓
Summary + Chat responses

## Components

1. UploadArea
   - Accepts PDF files

2. SummaryDisplay
   - Shows generated summary
   - Key points
   - Download option

3. QuestionChat
   - User asks questions
   - AI replies

4. AI Service
   - Generates summaries
   - Generates answers

## Flow

1. User uploads PDF
2. App processes text
3. AI generates summary
4. User asks questions
5. AI responds

## Advantages

- Fast
- Offline
- Simple UI
- Student friendly
- No internet dependency
