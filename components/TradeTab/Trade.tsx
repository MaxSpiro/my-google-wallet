import { useState } from 'react'
import { Receive } from './Receive'
import { Send } from './Send'
import { Swap } from './Swap'

enum TradeOption {
  Send = 'send',
  Receive = 'receive',
  Swap = 'swap',
}

const TradeComponents = {
  swap: <Swap />,
  receive: <Receive />,
  send: <Send />,
}

export const Trade = () => {
  const [title, setTitle] = useState<TradeOption>(TradeOption.Swap)
  return (
    <div className='col-span-5  py-2 px-6 bg-base-100 font-body text-primary-content'>
      <h1 className='font-semibold text-3xl text-center'>
        <span
          onClick={() => setTitle(TradeOption.Send)}
          className={`${
            title === 'send' ? '' : 'text-primary-focus'
          } cursor-pointer`}
        >
          Send
        </span>{' '}
        /{' '}
        <span
          onClick={() => setTitle(TradeOption.Swap)}
          className={`${
            title === 'swap' ? '' : 'text-primary-focus'
          } cursor-pointer`}
        >
          Swap{' '}
        </span>
        /{' '}
        <span
          onClick={() => setTitle(TradeOption.Receive)}
          className={`${
            title === 'receive' ? '' : 'text-primary-focus'
          } cursor-pointer`}
        >
          Receive
        </span>
      </h1>
      <main>{TradeComponents[title]}</main>
    </div>
  )
}






