# IHatePDF

IHatePDF is a privacy-focused web application that provides essential PDF tools for converting, splitting, and managing PDF files. All processing happens locally in the browser, ensuring that no files are uploaded or stored on any server.

## Features

* Image to PDF – Convert multiple images (JPG, PNG, etc.) into a single PDF file
* PDF Splitter – Split PDF files into individual pages or selected ranges
* Word to PDF – Convert Word documents (.docx) into PDF format
* PDF to Word – Convert PDF files into editable Word documents

## Highlights

* 100% private — all processing happens in the browser
* Completely free with no subscriptions
* Fast and modern user experience
* Responsive interface for desktop and mobile devices
* Clean and intuitive UI

## Tech Stack

### Core

* React
* Vite

### Routing and State

* React Router DOM
* TanStack React Query

### PDF Processing

* jsPDF
* pdf-lib
* docx
* file-saver

### UI and Styling

* Tailwind CSS
* Radix UI
* Base UI
* class-variance-authority
* clsx
* tailwind-merge

### Visuals and Interaction

* lucide-react
* framer-motion
* embla-carousel-react
* recharts

### Forms and Validation

* react-hook-form
* @hookform/resolvers
* zod

### Utilities

* sonner
* next-themes
* cmdk
* vaul
* react-day-picker
* date-fns
* input-otp
* react-resizable-panels

## Project Structure

```
ihatepdf/
├── src/
│   ├── components/
│   │   ├── tools/
│   │   │   ├── ImageToPdf.jsx
│   │   │   ├── PdfSplitter.jsx
│   │   │   ├── WordToPdf.jsx
│   │   │   └── PdfToWord.jsx
│   │   ├── ui/
│   │   ├── DropZone.jsx
│   │   ├── ImagePreview.jsx
│   │   └── ConvertButton.jsx
│   ├── pages/
│   │   ├── Index.jsx
│   │   └── NotFound.jsx
│   ├── hooks/
│   ├── lib/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── components.json
└── package.json
```

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/ihatepdf.git
cd ihatepdf
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application at:

```
http://localhost:5173
```
## How It Works

### Image to PDF

Upload multiple images, arrange them in order, and generate a single PDF file directly in the browser.

### PDF Splitter

Upload a PDF file, choose page ranges or individual pages, and download the separated files.

### Word to PDF

Upload a .docx document and convert it into a PDF file.

### PDF to Word

Upload a PDF file and convert the content into an editable Word document.
often works better for portfolios.
