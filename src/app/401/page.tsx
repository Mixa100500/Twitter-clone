import Link from "next/link";

export default function ErrorPage () {

  return (
    <>
      <h1>Strange attempt to authorize</h1>
      <Link href='/login' >login</Link>
    </>
  )
}