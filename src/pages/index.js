import Page from "../components/Page";
import ResumeReview from "../components/ResumeReview";
export default function Index() {
  return (
      <Page>
        <ResumeReview pdf="http://localhost:3000/BestInShow.pdf" />
      </Page>
  )
}
