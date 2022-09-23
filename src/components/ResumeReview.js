import React, {useState, useMemo} from 'react';
import {AnnotationFactory} from "annotpdf";
import {Document, Page, pdfjs} from 'react-pdf';
import {Box, Skelly, Spinner, Text, Button, Textarea} from '@codeday/topo/Atom'
import {useDisclosure} from '@codeday/topo/utils';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import {UiCheck, UiX} from "@codeday/topocons/Icon"

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
} from "@codeday/topo/Atom";


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`


export default function ResumeReview({pdf}) {
    const [numPages, setNumPages] = useState(1)
    const [pageHeight, setPageHeight] = useState(null) // will cause problems if pages have varying heights but i dont care
    const [annotatedFile, setAnnotatedFile] = useState()
    const [annotationProps, setAnnotationProps] = useState()
    const [annotator, setAnnotator] = useState(null)
    const [feedbackText, setFeedbackText] = useState('')
    const [popoverX, setPopoverX] = useState()
    const [popoverY, setPopoverY] = useState()
    const {isOpen, onToggle, onClose} = useDisclosure({onClose: () => setFeedbackText('')})
    if(annotator && !annotatedFile) {
        setAnnotatedFile(annotator.write())
    }
    const document = useMemo(() => (
        <Document
            loading={<Skelly h={pageHeight * numPages} />}
            file={{data: annotatedFile}}
        >
            { [...Array(numPages).keys()].map((_, idx) => {
                return (
                    <Page
                        key={idx}
                        loading={<Skelly h={pageHeight} />}
                        pageNumber={idx+1}
                        onClick={(e) => {
                            if (isOpen) return;
                            //https://stackoverflow.com/a/48390126
                            const rect = e.currentTarget.getBoundingClientRect()
                            const offsetX = e.pageX - window.pageXOffset - rect.left
                            const offsetY = e.pageY - window.pageYOffset - rect.bottom
                            setPopoverX(e.pageX)
                            setPopoverY(e.pageY)
                            setAnnotationProps({
                                page: idx,
                                rect: [offsetX, -offsetY, offsetX + 10, -offsetY + 10],
                            })
                            onToggle()
                        }}
                    />
                )
            })
            }
        </Document>
    ), [numPages, annotator, annotatedFile])

    return (
        <Box>
            <Document
                file={pdf}
                loading={< Spinner />}
                onLoadSuccess={async (file) => {
                    setAnnotator(new AnnotationFactory(await file.getData()))
                    setNumPages(file.numPages)
                    setPageHeight((await file.getPage(1)).view[3])
                }}/>
            <Popover
                isOpen={isOpen}
                onClose={onClose}
                closeOnBlur={false}
            >
                <PopoverTrigger>
                    <Box position="absolute" left={popoverX} top={popoverY}/>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverHeader>
                        <Text bold>Compose Feedback</Text>
                    </PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)}/>
                    </PopoverBody>
                    <PopoverFooter textAlign="right">
                        <Button mr={4} color="red" variant="ghost" onClick={onClose}>
                            <UiX />
                        </Button>
                        <Button color="green" variant="ghost" onClick={() => {
                            annotator.createTextAnnotation({
                                ...annotationProps,
                                contents: feedbackText
                            })
                            setAnnotatedFile(annotator.write())
                            onClose()
                        }}>
                            <UiCheck />
                        </Button>
                    </PopoverFooter>
                </PopoverContent>
            </Popover>
            <Box  display="inline-block">
                {document}
            </Box>
        </Box>
    )
}
