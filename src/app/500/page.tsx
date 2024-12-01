import {errors} from "@/utils/errors.ts";

type props = { searchParams: { message?: string } }

export default function ErrorPage ({ searchParams } : props) {
  let message = 'Unknown error'
  const urlMessage = searchParams?.message || ''

  if(errors.has(urlMessage)) {
    message = urlMessage
  }

  return (
    <>
      <h1>500 - Server-side error occurred</h1>
      <div>Technical issues. Please try again later</div>
      <div>{message}</div>
    </>
  )
}