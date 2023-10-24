'use client'
import React, { useState } from 'react'
import styles from './page.module.css'
import { useQuery } from '@tanstack/react-query'
import AutocompleteInput, { SelectItem } from './AutocompleteInput'

type StockData = {
  Contract: string;
  UnderlyingSecurityCode: string;
  ContractName: string;
  UnderlyingOfSingleStockFutures: string;
  GroupLevel: string;
  ClearingMarginRate: string;
  MaintenanceMarginRate: string;
  InitialMarginRate: string;
  Date: string;
};

function removeLastCharacter(inputString: string) {
  if (typeof inputString === 'string' && inputString.length > 0) {
    return inputString.slice(0, -1);
  } else {
    return inputString;
  }
}

export default function Dashboard() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['stockData'],
    queryFn: () =>
      fetch('/api/stock').then(
        (res) => res.json(),
      ),
  })

  const [selected, setSelected] = useState<SelectItem | null>(null)
  const [qty, setQty] = useState(1)
  const [price, setPrice] = useState(1)
  const [calResult, setCalResult] = useState<{ [key: string]: string } | null>(null)

  const handleSelected = (data: SelectItem) => {
    setSelected(data)
  }

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQty(Number(value))
  }
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPrice(Number(value))
  }

  const addCommas = (number: number) => {
    const parts = number.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    return parts.join('.')
  }

  const handleCal = () => {
    if (!selected) return
    const { name } = selected
    const current = data.find((item: StockData) => item.ContractName === name)
    const { ClearingMarginRate, MaintenanceMarginRate, InitialMarginRate, ContractName } = current
    const base = ContractName.includes("小型") ? 100 : 2000
    const clearRate = Number(removeLastCharacter(ClearingMarginRate)) * 0.01
    const maintenanceRate = Number(removeLastCharacter(MaintenanceMarginRate)) * 0.01
    const initialRate = Number(removeLastCharacter(InitialMarginRate)) * 0.01

    const clearMargin = addCommas(Math.floor(price * base * qty * clearRate))
    const maintenanceMargin = addCommas(Math.floor(price * base * qty * maintenanceRate))
    const initialMargin = addCommas(Math.floor(price * base * qty * initialRate))

    setCalResult({ clearMargin, maintenanceMargin, initialMargin })

  }

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: '

  const options = data.map((item: StockData) => ({ id: item.UnderlyingSecurityCode, name: item.ContractName }))

  return (
    <div className="p-2 box-border">
      <div>
        <div className="p-2 mb-2 bg-slate-100 border border-black border-solid flex flex-col justify-center">
          <h1 className="text-xl mb-2 text-center">個股期貨保證金計算機</h1>
          <AutocompleteInput options={options} callback={handleSelected} />
          <div className="mb-2">
            <span>口數: </span>
            <input className="w-1/2 indent-2 outline-0 flex-1 p-0 text-xl rounded" value={qty} onChange={handleQtyChange} />
          </div>
          <div className="mb-2">
            <span>股價: </span>
            <input className="w-1/2 indent-2 outline-0 flex-1 p-0 text-xl rounded" value={price} onChange={handlePriceChange} />
          </div>
          <button onClick={handleCal} className="my-2 px-7 py-2 text-center uppercase duration-300 text-white rounded block border-0 text-lg font-bold cursor-pointer select-none touch-manipulation bg-sky-500">確認</button>
        </div>
        {
          calResult ? (
            <table className="w-full font-sans border-collapse">
              <thead>
                <tr>
                  <th className="border border-slate-100 border-solid py-3 text-center text-white bg-sky-600">結算保證金</th>
                  <th className="border border-slate-100 border-solid py-3 text-center text-white bg-sky-600">維持保證金</th>
                  <th className="border border-slate-100 border-solid py-3 text-center text-white bg-sky-600">原始保證金</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 border-solid pl-2 py-3">{calResult.clearMargin}</td>
                  <td className="border border-slate-300 border-solid pl-2 py-3">{calResult.maintenanceMargin}</td>
                  <td className="border border-slate-300 border-solid pl-2 py-3">{calResult.initialMargin}</td>
                </tr>
              </tbody>
            </table>
          ) : null
        }
      </div>
    </div>
  )
}
