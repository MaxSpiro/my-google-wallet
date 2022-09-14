import { useWallet } from 'lib/hooks/useWallet'
import { NextPage } from 'next'
import { useState } from 'react'

const Profile: NextPage = () => {
  const { getPrivateKey } = useWallet()
  const privateKey = getPrivateKey()
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  return (
    <div className='p-6 flex flex-col items-center gap-6'>
      <h1 className='text-error text-5xl uppercase'>Danger Zone</h1>
      {showPrivateKey ? (
        <>
          <button
            onClick={() => setShowPrivateKey(false)}
            className='btn btn-error'
          >
            Hide
          </button>
          <h1 className='text-error'>{privateKey}</h1>
        </>
      ) : (
        <button
          onClick={() => setShowPrivateKey(true)}
          className='btn btn-error'
        >
          Expose private key
        </button>
      )}
    </div>
  )
}
export default Profile
