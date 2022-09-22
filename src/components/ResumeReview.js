import React, {useState, useRef, useEffect} from 'react';
import {AnnotationFactory} from "annotpdf";
import { pdfjs, Document, Page } from 'react-pdf';
import { Box } from '@codeday/topo/Atom'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
export default function ResumeReview({pdf}) {
    const [page, setPage] = useState(1)
    const [annotator, setAnnotator] = useState(null)
    if(annotator) {
        annotator.createTextAnnotation({page: 0, rect: [100,100, 200, 200], contents: "This is an annotation", author: "Hello World!"})
        annotator.download()
    }
    return (
        <Box>
            <Document file={pdf} onLoadSuccess={async (file) => {
                setAnnotator(new AnnotationFactory(await file.getData()))
            }}>
                <Page pageNumber={1} />
            </Document>
        </Box>
    )
}
