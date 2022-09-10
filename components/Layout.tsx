import { Navbar } from './Navbar'

export const Layout = ({ children }: any) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
