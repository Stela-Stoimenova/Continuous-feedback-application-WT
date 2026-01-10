import {useEffect, useState} from 'react'

const API_URL = import.meta.env.VITE_API_URL || 
  `${window.location.protocol}//${window.location.hostname}:${window.location.port}`

function QuoteBanner(){
    const [quote, setQuote] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() =>{
        let mounted = true
        const load = async()=>{
            try{
                // Call backend proxy to avoid CORS/https issues
                const res = await fetch(`${API_URL}/api/quotes/quote`)
                const data = await res.json()
                if(!mounted) return
                setQuote({
                    quote: data?.quote || 'Keep going. You are doing great.',
                    author: data?.author || 'Unknown',
                })

            }catch{
                if(mounted) setError('Unable to load quote right now.')
            }
        }
        load()
        return ()=> {mounted = false}
    }, [])

    return (
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex items-start space-x-3">
            <div className="text-blue-900">
                {error && <p className="text-sm">{error}</p>}
                {!error && !quote && <p className="text-sm">Fetching today's inspiration...</p>}
                {!error && quote && (
                    <>
                        <p className= "text-sm italic">"{quote.quote}"</p>
                        <p className= "text-xs mt-1 text-blue-700">~{quote.author}</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default QuoteBanner