/* eslint-disable @next/next/no-img-element */
/**
 * @since 2023/07/16
 * @author ThinhHV <thinh@thinhhv.com>
 * @description description
 * @copyright (c) 2023 Company Platform
 */

'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  useAccount,
  useConnect,
  useContractRead,
  useContractReads,
  useContractWrite,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
} from 'wagmi'
import votingABI from 'src/configs/contracts/voting.abi.json'
import tokenABI from 'src/configs/contracts/token.abi.json'
import { CONFIGS } from 'src/configs'
import { LoadingCircle } from '@/components/shared/icons'
import { BigNumber, utils } from 'ethers'
import { useSignInModal } from '@/components/layout/sign-in-modal'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { config } from '../../app/providers'
import { formatTime } from '@/lib/utils'
import Button from '../shared/button'
import HeroSection from './hero-section'
import Card from './card'
import NoImage from '@/assets/no-image.svg'

const TOTAL_ITEM = 5
const MIN_APPROVE_AMOUNT = 5
const contract = {
  voting: {
    address: CONFIGS.CONTRACT_VOTING,
    abi: votingABI as any,
    chainId: CONFIGS.CHAIN_ID,
  },
  token: {
    address: CONFIGS.TOKEN_VOTING,
    abi: tokenABI,
    chainId: CONFIGS.CHAIN_ID,
  },
}

const Home = () => {
  const [data, setData] = useState<
    {
      title: string
      written_by: string
      category: string
      description: string
      amountVote: BigNumber
    }[]
  >([])
  const [dataTotalVote, setDataTotalVote] = useState<number>(0)
  const [dataTime, setDataTime] = useState<number[]>([0, 0])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hash, setHash] = useState<string>('')
  const [hashApprove, setHashApprove] = useState<string>('')
  const [imageId, setImageId] = useState<number>(0)
  const { data: session } = useSession()
  const { address: walletAddress } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork({
    chainId: CONFIGS.CHAIN_ID,
    onError: (error) => {
      console.log(error)
      // setError(error.message)
    },
  })
  const { SignInModal, setShowSignInModal } = useSignInModal()
  // const { VotingModal, setShowModal: setShowVotingModal } = useVotingModal()
  const { connect, error: errorConnect } = useConnect({ connector: config.connectors[1] })

  ////////////////////////////////////////////////
  ///////////// CONTRACT FUNCTIONS ///////////////
  ////////////////////////////////////////////////

  // Get list artist
  const {
    data: dataFetch,
    isError,
    error: errorFetchList,
    isSuccess: isSuccessFetchList,
    isLoading: isLoadingFetchList,
    refetch: refetchList,
  } = useContractReads({
    enabled: true,
    watch: true,
    contracts: Array.from(Array(TOTAL_ITEM).keys()).map((_, index) => ({
      ...contract.voting,
      functionName: 'imageId',
      args: [index + 1],
    })),
  })
  // Get total voted
  const {
    data: dataFetchTotalVote,
    refetch: refetchTotalVote,
    isSuccess: isSuccessTotalVote,
  } = useContractRead({
    enabled: true,
    watch: true,
    ...contract.voting,
    functionName: 'totalVote',
  })
  // Get start/end time
  const {
    data: dataFetchTime,
    isSuccess: isSuccessFetchTime,
    refetch: refetchTime,
  } = useContractReads({
    enabled: false,
    contracts: [
      {
        ...contract.voting,
        functionName: 'votingStartTime',
      },
      {
        ...contract.voting,
        functionName: 'votingEndTime',
      },
    ],
  })
  // Process approve
  const {
    data: dataApprove,
    isLoading: isLoadingApprove,
    error: errorApprove,
    isSuccess: isSuccessApprove,
    write: writeApprove,
  } = useContractWrite({
    ...contract.token,
    functionName: 'approve',
    args: [CONFIGS.CONTRACT_VOTING, 1000000 * Math.pow(10, 18)],
  })
  // approve
  const {
    isFetching: isFetchingTransactionApprove,
    isLoading: isLoadingTransactionApprove,
    isSuccess: isSuccessTransactionApprove,
    refetch: refetchTransactionApprove,
  } = useWaitForTransaction({
    enabled: false,
    hash: hashApprove as any,
  })
  // Check allowance
  const { data: dataAllowance, refetch: refetchDataAllowance } = useContractRead({
    enabled: false,
    ...contract.token,
    functionName: 'allowance',
    args: [(session as any)?.address, CONFIGS.CONTRACT_VOTING],
  })
  // Voting
  const {
    data: dataVoting,
    isLoading: isLoadingVoting,
    isSuccess: isSuccessVoting,
    write: writeVoting,
  } = useContractWrite({
    ...contract.voting,
    functionName: 'vote',
  })
  const {
    isFetching: isFetchingTransaction,
    isLoading: isLoadingTransactionVoting,
    isSuccess: isSuccessTransactionVoting,
    refetch: refetchVotingTransaction,
  } = useWaitForTransaction({
    enabled: false,
    hash: hash as any,
  })

  ////////////////////////////////////////////////
  /////////// END CONTRACT FUNCTIONS /////////////
  ////////////////////////////////////////////////

  useEffect(() => {
    refetchList()
    refetchTotalVote()
    refetchTime()
  }, [])

  useEffect(() => {
    console.log('errorConnect', errorConnect)
  }, [errorConnect])

  useEffect(() => {
    const { address } = (session as any) || {}
    if (address) {
      connect()
      refetchDataAllowance()
    }
  }, [session])

  useEffect(() => {
    if (dataVoting?.hash) {
      setHash(dataVoting.hash)
    }
  }, [dataVoting])

  useEffect(() => {
    if (dataApprove?.hash) {
      setHashApprove(dataApprove.hash)
    }
  }, [dataApprove])

  useEffect(() => {
    if (isSuccessTransactionApprove) {
      toast.success('Successfully approve!')
      refetchDataAllowance()
    }
  }, [isSuccessTransactionApprove])

  useEffect(() => {
    if (errorApprove) {
      toast.error(errorApprove.message.split('.')[0].substring(0, 100))
    }
  }, [errorApprove])

  useEffect(() => {
    setIsLoading(
      isLoadingVoting ||
        isFetchingTransaction ||
        isLoadingTransactionVoting ||
        isFetchingTransactionApprove ||
        isLoadingTransactionApprove ||
        isLoadingApprove,
    )
  }, [
    isLoadingVoting,
    isFetchingTransaction,
    isLoadingTransactionVoting,
    isFetchingTransactionApprove,
    isLoadingTransactionApprove,
    isLoadingApprove,
  ])

  useEffect(() => {
    if (hash) {
      // toast.promise(new Promise((rs, rj) => {
      //   if (isSuccessTransactionVoting) {
      //     rs(true)
      //   }
      //   setTimeout(() => rs(true), 5000)
      // }), {
      //   loading: 'Confirming transaction...',
      //   success: <b>Transaction confirmed!</b>,
      //   error: <b>Could not confirm.</b>,
      // })
      if (isSuccessVoting) {
        refetchVotingTransaction?.()
      }
    }
  }, [isSuccessVoting, hash])

  useEffect(() => {
    if (hashApprove && isSuccessApprove) {
      refetchTransactionApprove()
    }
  }, [isSuccessApprove, hashApprove])

  useEffect(() => {
    if (isSuccessTransactionVoting) {
      toast.success('Successfully voting!')
      refetchList()
      refetchTotalVote()
      refetchDataAllowance()
    }
  }, [isSuccessTransactionVoting])

  useEffect(() => {
    if (isSuccessTotalVote && dataFetchTotalVote) {
      setDataTotalVote(
        !dataFetchTotalVote
          ? 0
          : Number(utils.formatUnits(dataFetchTotalVote as unknown as BigNumber)),
      )
    }
  }, [dataFetchTotalVote, isSuccessTotalVote])

  useEffect(() => {
    if (isSuccessFetchList && dataFetch) {
      console.log('Received data', dataFetch)
      setData(
        (dataFetch as any[])?.map((e) => ({
          title: e.result[0],
          written_by: e.result[1],
          category: e.result[2],
          description: e.result[3],
          amountVote: e.result[4],
        })),
      )
    }
  }, [dataFetch, isSuccessFetchList])

  useEffect(() => {
    if (isSuccessFetchTime && dataFetchTime) {
      setDataTime([
        Number(dataFetchTime?.[0]?.result?.toString() || 0) * 1000,
        Number(dataFetchTime?.[1]?.result?.toString() || 0) * 1000,
      ])
      console.log('Received dataTime', dataFetchTime)
    }
  }, [dataFetchTime, isSuccessFetchTime])

  useEffect(() => {
    if (isSuccessTransactionApprove) {
      // handle voting
      console.log('Writing contract vote')
      writeVoting?.({
        args: [MIN_APPROVE_AMOUNT * Math.pow(10, 18), imageId],
      })
    }
  }, [isSuccessTransactionApprove, imageId])

  const onClickVote = useCallback(
    async (index: number) => {
      console.log('Voting for ' + index)
      setImageId(index)
      const { address } = (session as any) || {}
      if (!address) {
        setShowSignInModal(true)
        return
      }
      if (!walletAddress) {
        connect()
      }
      console.log('Current chain ID', chain?.id)
      if (chain?.id !== CONFIGS.CHAIN_ID) {
        switchNetwork?.()
      }
      console.log('dataAllowance', dataAllowance)
      if (
        Number(utils.formatUnits((dataAllowance as BigNumber) || BigNumber.from(0), 0)) <
        Number(MIN_APPROVE_AMOUNT * Math.pow(10, 18))
      ) {
        writeApprove?.()
      } else {
        // handle voting
        console.log('Writing contract vote')
        writeVoting?.({
          args: [MIN_APPROVE_AMOUNT * Math.pow(10, 18), index],
        })
      }
    },
    [session, chain, writeApprove, writeVoting, dataAllowance, walletAddress],
  )

  return (
    <>
      <SignInModal />
      <HeroSection />
      <div className="z-10 mb-24 w-full bg-white bg-opacity-50 py-32 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            {[
              { id: 1, name: 'Transactions every 24 hours', value: '44 million' },
              { id: 2, name: 'Assets under holding', value: '$119 trillion' },
              { id: 3, name: 'New users annually', value: '46,000' },
            ].map((stat) => (
              <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div id="voting" className="py-3"></div>
      <div className="z-10 text-center text-indigo-500">
        <h1 className="pb-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Voting the artist you like best
        </h1>
        <div className="text-xs font-bold">
          {formatTime(dataTime[0]) + ' UTC'} ~ {formatTime(dataTime[1]) + ' UTC'}
        </div>
      </div>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        {(!data || data.length === 0) && (
          <p className="mt-6 flex justify-center text-center md:text-xl">
            <LoadingCircle height={10} width={10} />
          </p>
        )}
        {isError && !isLoadingFetchList && (
          <>
            <p className="mt-6 text-center text-gray-500 md:text-xl">
              Cannot fetch data from blockchain. {errorFetchList?.message}
            </p>
            <p className="mt-6 text-center text-gray-500 md:text-xl">
              <Button onClick={() => refetchList()}>Refetch</Button>
            </p>
          </>
        )}
      </div>
      {!isLoadingFetchList && data && data.length > 0 && (
        <div className="z-10 mt-5 font-bold">TOTAL DEPOSITED: {dataTotalVote} ATV</div>
      )}
      <div className="z-10 my-5 grid w-full max-w-screen-xl grid-cols-1 gap-5 px-5 md:grid-cols-2 xl:px-0">
        {data &&
          data.length > 0 &&
          data.map(({ title, written_by, category, description, amountVote }, index) => (
            <Card
              key={index}
              name={title}
              description={
                <>
                  <div className="mb-2 flex items-center text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="h-4 w-4 mr-1"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>

                    {written_by}
                  </div>
                  <div>
                    {category.split(',').map((e) => (
                      <span className="mr-1 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
                        {e}
                      </span>
                    ))}
                  </div>
                </>
              }
              avatar={NoImage.src}
              demo={
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                    />
                  </svg>
                  <span className="ml-1">
                    {Math.round(Number(utils.formatUnits(amountVote || BigNumber.from(0))) * 100) /
                      100}{' '}
                    ATV (
                    {Math.round(
                      (Number(utils.formatUnits(amountVote || BigNumber.from(0))) /
                        Number(dataTotalVote)) *
                        100,
                    )}
                    %)
                  </span>
                </>
              }
              actions={
                <>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={(e: any) => {
                      e.preventDefault()
                      setImageId(index + 1)
                      onClickVote(index + 1)
                      if (e.stopPropagation) e.stopPropagation()
                    }}
                    className="bg-indigo mr-1 inline-flex items-center rounded-md border bg-indigo-500 px-2.5 py-1.5 text-center text-xs font-medium text-white hover:bg-indigo-400 focus:outline-0"
                  >
                    {isLoading && imageId === index + 1 && (
                      <LoadingCircle className="mr-2 inline-block" />
                    )}
                    {imageId !== index + 1
                      ? 'Vote'
                      : isFetchingTransaction || isLoadingTransactionVoting
                      ? 'Confirming'
                      : isLoadingApprove ||
                        isFetchingTransactionApprove ||
                        isLoadingTransactionApprove
                      ? 'Approving'
                      : 'Vote'}
                  </button>
                  <a
                    href={description}
                    target="_blank"
                    type="button"
                    className="inline-flex items-center rounded-md border border-gray-500 px-2.5 py-1.5 text-center text-xs font-medium text-black hover:bg-gray-200 hover:text-gray-900 focus:outline-0"
                  >
                    Read
                    <svg
                      className="ml-2 h-3 w-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </a>
                </>
              }
            />
          ))}
      </div>
    </>
  )
}

export default Home
