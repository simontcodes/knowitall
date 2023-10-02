import HistoryComponent from '@/components/HistoryComponent'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAuthSession } from '@/lib/nextauth'
import { LucideLayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

type HistoryPageProps = {}

const HistoryPage = async (props: HistoryPageProps) => {
  const session = await getAuthSession()
  if (!session?.user) {
    return redirect("/");
  }
  return (
    <div className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]'> 
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className=' text-2xl font-bold'>
            History
          </CardTitle>
          <Link href="/dashboard" className={buttonVariants()}>
						<LucideLayoutDashboard className="mr-2" />
						Back to dashboard
					</Link>
        </div>
      </CardHeader>
      <CardContent className=' max-h-[60vh] overflow-scroll'>
      <HistoryComponent limit={10} userId={session?.user.id}  />
      </CardContent>
    </Card>



    </div>
    
    
  )
}

export default HistoryPage