const { PDFDocument, PDFName, PDFString } = require('pdf-lib');
const fs = require('fs');

async function run() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3] || inputPath.replace('.pdf', '_node.pdf');

  if (!inputPath) {
    console.error('Usage: node ats_node_injector.js <input.pdf> [output.pdf]');
    process.exit(1);
  }

  const existingPdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // 1. SET CORE PDF DICTIONARY METADATA
  pdfDoc.setTitle('Dementia Care Ecosystem - Spatial Tracking & Cognitive AI Therapy');
  pdfDoc.setAuthor('Engineering Team');
  pdfDoc.setSubject('System Architecture, Healthcare Tech, Artificial Intelligence, Microservices');
  pdfDoc.setKeywords([
    'Rust', 'Go', 'Node.js', 'React', 'Artificial Intelligence', 
    'Machine Learning', 'Spatial Analytics', 'Dementia Care', 'HIPAA'
  ]);
  pdfDoc.setProducer('ATS Node.js Metadata Engine');
  pdfDoc.setCreator('Enterprise Healthcare Architecture');

  // 2. INVISIBLE ANNOTATION HACK (Tooltips)
  // Removed because some strict PDF viewers render Text annotations as yellow sticky notes 
  // regardless of the Hidden flags, causing a visual artefact. PyMuPDF and Rust XMP are sufficient.
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`[Node.js] Processed successfully! Saved to ${outputPath}`);
}

run().catch(err => console.error(err));
