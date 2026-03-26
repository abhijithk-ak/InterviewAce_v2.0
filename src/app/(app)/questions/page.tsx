import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { QUESTION_BANK } from "@/lib/questions/bank"
import { QuestionBankClient } from "@/components/questions/QuestionBankClient"

export default async function QuestionBankPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/login')
  }

  return <QuestionBankClient questions={QUESTION_BANK} />
}