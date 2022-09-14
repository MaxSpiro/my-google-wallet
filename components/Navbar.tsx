import { useWallet } from 'lib/hooks/useWallet'
import Image from 'next/image'
import Link from 'next/link'
import Google from 'public/google.svg'

export const Navbar = () => {
  const { userInfo, isConnected, connectGoogle, disconnectWallet } = useWallet()

  const ConnectGoogle = () => (
    <button
      className='btn btn-primary flex gap-2 text-lg'
      onClick={connectGoogle}
    >
      <div className='avatar'>
        <div className='w-12 rounded'>
          <Image src='/google.svg' alt='google logo' layout='fill' />
        </div>
      </div>
      Connect with google
    </button>
  )

  const ProfileMenu = () => {
    return (
      <div className='dropdown dropdown-end'>
        {userInfo?.profileImage ? (
          <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
            <div className='w-16 rounded-full'>
              <Image
                height={50}
                width={50}
                src={userInfo.profileImage}
                alt='profile picture'
              />
            </div>
          </label>
        ) : (
          <label tabIndex={0} className='btn btn-ghost'>
            Me
          </label>
        )}

        <ul
          tabIndex={0}
          className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 text-white rounded-box w-52'
        >
          <li>
            <Link href='/profile'>
              <a className='justify-between'>
                Profile
                <span className='badge'>New</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href='/settings'>
              <a>Settings</a>
            </Link>
          </li>
          <li>
            <a onClick={disconnectWallet}>Logout</a>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div className='navbar font-header max-h-[8vh] bg-secondary text-neutral justify-between'>
      <div>
        <Link href='/'>
          <a className='btn btn-ghost normal-case text-2xl flex gap-2 items-center'>
            {isConnected && <Google />}My Google Wallet
          </a>
        </Link>
      </div>
      <div>{isConnected ? <ProfileMenu /> : <ConnectGoogle />}</div>
    </div>
  )
}
