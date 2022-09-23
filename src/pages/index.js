import Page from "../components/Page";
import ResumeReview from "../components/ResumeReview";
import { Box } from "@codeday/topo/Atom";

export default function Index() {
  return (
      <Page>
          <Box textAlign="center">
              <ResumeReview pdf="http://localhost:3000/BestInShow.pdf" />
          </Box>
      </Page>
  )
}
